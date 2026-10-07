"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/data/site";

const links = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projetos" },
  { href: "/assets", label: "Assets" },
  { href: "/about", label: "Sobre" },
  { href: "/contact", label: "Contato" },
];

/** "/" only matches exactly; every other route also matches its children. */
function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="border-border bg-bg/85 sticky top-0 z-40 border-b backdrop-blur-md">
      <nav
        aria-label="Principal"
        className="mx-auto w-full max-w-[980px] px-6 py-4"
      >
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="text-navy font-mono text-sm font-semibold"
            onClick={() => setOpen(false)}
          >
            <span className="text-sea" aria-hidden>~/</span>{site.name.toLowerCase()}
          </Link>

          {/* Desktop */}
          <ul className="hidden items-center gap-1 sm:flex">
            {links.map((link) => (
              <li key={link.href}>
                <NavLink
                  href={link.href}
                  active={isActive(pathname, link.href)}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="border-border text-ink hover:border-sea hover:text-sea rounded-md border px-3 py-1.5 font-mono text-xs transition-colors sm:hidden"
          >
            {open ? "Fechar" : "Menu"}
          </button>
        </div>

        {/* Mobile panel */}
        {open ? (
          <ul id="mobile-nav" className="mt-3 flex flex-col gap-1 sm:hidden">
            {links.map((link) => (
              <li key={link.href}>
                <NavLink
                  href={link.href}
                  active={isActive(pathname, link.href)}
                  block
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        ) : null}
      </nav>
    </header>
  );
}

function NavLink({
  href,
  active,
  block = false,
  onClick,
  children,
}: {
  href: string;
  active: boolean;
  block?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`rounded-md px-3 py-1.5 font-mono text-xs transition-colors ${
        block ? "block" : "inline-block"
      } ${
        active
          ? "text-sea decoration-sea font-medium underline decoration-2 underline-offset-[6px]"
          : "text-ink-muted hover:text-sea hover:bg-surface-2"
      }`}
    >
      {children}
    </Link>
  );
}
