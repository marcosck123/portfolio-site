import { NextResponse } from "next/server";
import { Resend } from "resend";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_MESSAGE = 5000;
const MIN_ELAPSED_MS = 2500;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { ok: false, error: "invalid_input" },
        { status: 400 },
      );
    }

    const { name, email, subject, message, company, elapsedMs } = body as
      Record<string, unknown>;

    // --- anti-spam -------------------------------------------------------
    // Honeypot: the `company` field is hidden, so a real visitor never fills
    // it. Answer ok:true so a bot gets no signal that it was caught.
    if (typeof company === "string" && company.trim()) {
      return NextResponse.json({ ok: true });
    }
    // Time trap: a submit faster than ~2.5s is almost certainly automated.
    if (typeof elapsedMs === "number" && elapsedMs < MIN_ELAPSED_MS) {
      return NextResponse.json({ ok: true });
    }

    // --- validation (never trust the client) -----------------------------
    const nome = typeof name === "string" ? name.trim() : "";
    const mail = typeof email === "string" ? email.trim() : "";
    const assunto = typeof subject === "string" ? subject.trim() : "";
    const texto = typeof message === "string" ? message.trim() : "";

    if (!nome || !mail || !texto) {
      return NextResponse.json(
        { ok: false, error: "missing_fields" },
        { status: 400 },
      );
    }
    if (!EMAIL_RE.test(mail) || texto.length > MAX_MESSAGE) {
      return NextResponse.json(
        { ok: false, error: "invalid_input" },
        { status: 400 },
      );
    }

    // --- send ------------------------------------------------------------
    // Read env at request time, not module scope: `new Resend(undefined)`
    // throws, which would break the route (and the build) when the key is
    // absent — e.g. in a fresh clone or a preview without env vars set.
    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.CONTACT_EMAIL;
    if (!apiKey || !to) {
      console.error("contact: RESEND_API_KEY or CONTACT_EMAIL is not set");
      return NextResponse.json(
        { ok: false, error: "not_configured" },
        { status: 500 },
      );
    }

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      // `onboarding@resend.dev` works with no domain verification, which is
      // fine for now. For production deliverability (and to send from your own
      // address), verify a domain in Resend and change this.
      from: "Portfolio <onboarding@resend.dev>",
      to,
      // Replying in the inbox goes straight to the visitor, not to Resend.
      replyTo: mail,
      subject: assunto ? `Proposta: ${assunto}` : `Nova mensagem — ${nome}`,
      text:
        `Nome: ${nome}\n` +
        `Email: ${mail}\n` +
        (assunto ? `Assunto: ${assunto}\n` : "") +
        `\n${texto}\n`,
    });

    if (error) {
      console.error("contact: resend rejected the send", error);
      return NextResponse.json(
        { ok: false, error: "send_failed" },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("contact: unexpected failure", err);
    return NextResponse.json(
      { ok: false, error: "send_failed" },
      { status: 500 },
    );
  }
}
