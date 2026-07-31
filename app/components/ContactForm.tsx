"use client";

import { useEffect, useRef, useState } from "react";
import { whatsappUrl, proposalText } from "@/lib/whatsapp";
import { contact } from "@/data/site";

type Status = "idle" | "submitting" | "success" | "error";
type Field = "name" | "email" | "message";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMPTY = {
  name: "",
  email: "",
  subject: "",
  message: "",
  company: "",
};

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  // Snapshot of what was sent — the success screen must survive the reset.
  const [sent, setSent] = useState({ name: "", message: "" });

  // Set in an effect, not at render: Date.now() during render is impure.
  // Stamped after hydration, which is also when the visitor can first type.
  const mounted = useRef(0);
  const successRef = useRef<HTMLDivElement>(null);
  // Separate refs rather than an object literal: assembling a ref map during
  // render trips react-hooks/refs.
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    mounted.current = Date.now();
  }, []);

  // Move focus to the confirmation so screen readers announce the result.
  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  function validate() {
    const next: Partial<Record<Field, string>> = {};
    if (!form.name.trim()) next.name = "Informe seu nome.";
    if (!form.email.trim()) next.email = "Informe seu email.";
    else if (!EMAIL_RE.test(form.email.trim()))
      next.email = "Esse email não parece válido.";
    if (!form.message.trim()) next.message = "Escreva sua mensagem.";
    return next;
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      // Send focus to the first field that failed.
      if (found.name) nameRef.current?.focus();
      else if (found.email) emailRef.current?.focus();
      else if (found.message) messageRef.current?.focus();
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          elapsedMs: Date.now() - mounted.current,
        }),
      });
      const data = await res.json().catch(() => null);

      if (res.ok && data?.ok) {
        setSent({ name: form.name.trim(), message: form.message.trim() });
        setForm(EMPTY);
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        className="border-border bg-surface rounded-xl border p-[22px]"
      >
        <div aria-hidden className="bg-gold h-[2px] w-12" />
        <h2 className="mt-5 text-[22px]">Mensagem enviada</h2>
        <p className="text-ink mt-2 text-[15px] leading-relaxed">
          Respondo no seu email em breve. Se preferir, dá pra continuar a
          conversa agora mesmo no WhatsApp.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          {contact.whatsappNumber ? (
            <a
              href={whatsappUrl(
                contact.whatsappNumber,
                proposalText({ name: sent.name, message: sent.message }),
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="border-sea text-sea hover:bg-sea inline-flex items-center gap-2 rounded-full border px-5 py-2.5 font-mono text-[13px] transition-colors hover:text-white"
            >
              <span aria-hidden>◈</span>
              Continuar no WhatsApp →
            </a>
          ) : null}

          <button
            type="button"
            onClick={() => {
              mounted.current = Date.now();
              setStatus("idle");
            }}
            className="border-border text-ink hover:border-sea hover:text-sea inline-flex items-center rounded-full border px-5 py-2.5 font-mono text-[13px] transition-colors"
          >
            Enviar outra mensagem
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="border-border bg-surface rounded-xl border p-[22px]"
    >
      {/* Honeypot: hidden from sight, from the a11y tree and from tab order. */}
      <input
        type="text"
        name="company"
        value={form.company}
        onChange={(e) => setForm({ ...form, company: e.target.value })}
        className="sr-only"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          id="name"
          label="Nome"
          required
          value={form.name}
          error={errors.name}
          inputRef={nameRef}
          autoComplete="name"
          onChange={(v) => setForm({ ...form, name: v })}
        />
        <TextField
          id="email"
          label="Email"
          type="email"
          required
          value={form.email}
          error={errors.email}
          inputRef={emailRef}
          autoComplete="email"
          onChange={(v) => setForm({ ...form, email: v })}
        />
      </div>

      <div className="mt-5">
        <TextField
          id="subject"
          label="Assunto"
          hint="opcional"
          value={form.subject}
          onChange={(v) => setForm({ ...form, subject: v })}
        />
      </div>

      <div className="mt-5">
        <Label htmlFor="message" required>
          Mensagem
        </Label>
        <textarea
          id="message"
          ref={messageRef}
          value={form.message}
          maxLength={5000}
          rows={6}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          aria-required="true"
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={`bg-bg text-ink mt-2 w-full rounded-lg border px-3 py-2.5 text-[14px] leading-relaxed transition-colors ${
            errors.message ? "border-status-progress" : "border-border-strong"
          }`}
        />
        {errors.message ? <FieldError id="message-error">{errors.message}</FieldError> : null}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="bg-sea hover:bg-navy inline-flex items-center rounded-full px-6 py-2.5 font-mono text-[13px] text-white transition-colors disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === "submitting" ? "Enviando…" : "Enviar proposta"}
        </button>
        <p className="text-ink-muted font-mono text-[11px]">
          Respondo no email informado.
        </p>
      </div>

      {status === "error" ? (
        <p
          role="alert"
          className="text-status-progress mt-4 text-[13px] leading-relaxed"
        >
          Não consegui enviar agora. Tente novamente ou fale pelo WhatsApp
          abaixo.
        </p>
      ) : null}
    </form>
  );
}

function Label({
  htmlFor,
  required,
  hint,
  children,
}: {
  htmlFor: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-ink block font-mono text-[11px] tracking-wider uppercase"
    >
      {children}
      {required ? (
        <span className="text-sea" aria-hidden>
          {" "}
          *
        </span>
      ) : null}
      {hint ? <span className="text-ink-muted normal-case"> ({hint})</span> : null}
    </label>
  );
}

function FieldError({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} className="text-status-progress mt-1.5 text-[12px]">
      {children}
    </p>
  );
}

function TextField({
  id,
  label,
  type = "text",
  required,
  hint,
  value,
  error,
  inputRef,
  autoComplete,
  onChange,
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  hint?: string;
  value: string;
  error?: string;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  autoComplete?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <Label htmlFor={id} required={required} hint={hint}>
        {label}
      </Label>
      <input
        id={id}
        ref={inputRef}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`bg-bg text-ink mt-2 w-full rounded-lg border px-3 py-2.5 text-[14px] transition-colors ${
          error ? "border-status-progress" : "border-border-strong"
        }`}
      />
      {error ? <FieldError id={`${id}-error`}>{error}</FieldError> : null}
    </div>
  );
}
