"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Container } from "./Container";
import { footerLinkGroups, socialLinks, legalLinks } from "@/data/footerLinks";

export function Footer() {
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  const toggleGroup = (title: string) => {
    setOpenGroup((prev) => (prev === title ? null : title));
  };

  return (
    <footer className="bg-surface border-t border-outline-variant">
      <Container className="py-12 lg:py-16">
        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 lg:gap-12">
          {/* Brand column */}
          <div className="pb-8 lg:pb-0 border-b border-outline-variant lg:border-none">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-md bg-primary flex items-center justify-center">
                <span className="text-on-primary font-bold text-base font-display">S</span>
              </div>
              <span className="font-bold text-xl text-on-surface font-display">ServiceHub</span>
            </Link>
            <p className="text-sm text-on-surface/60 leading-relaxed max-w-xs">
              Connecting local communities with trusted service professionals. Book with confidence, every time.
            </p>
            {/* Social links */}
            <div className="flex gap-3 mt-6">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-outline-variant text-on-surface/60 hover:text-on-surface hover:bg-surface-container-high transition-colors text-sm"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link groups */}
          {footerLinkGroups.map((group) => (
            <div key={group.title} className="border-b border-outline-variant lg:border-none">
              {/* Accordion button (base/sm/md only) */}
              <button
                onClick={() => toggleGroup(group.title)}
                className="flex items-center justify-between w-full py-4 lg:py-0 lg:pointer-events-none text-left cursor-pointer lg:cursor-auto"
                aria-expanded={openGroup === group.title}
              >
                <span className="text-sm font-bold text-on-surface uppercase tracking-wider">
                  {group.title}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-on-surface/50 transition-transform lg:hidden ${
                    openGroup === group.title ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Links — always visible on lg+, accordion-controlled on smaller */}
              <ul
                className={`overflow-hidden transition-all duration-300 space-y-2 ${
                  openGroup === group.title
                    ? "max-h-96 pb-4 lg:pb-0"
                    : "max-h-0 lg:max-h-96"
                } lg:pt-4`}
              >
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-on-surface/60 hover:text-on-surface transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>

      {/* Bottom bar */}
      <div className="border-t border-outline-variant">
        <Container className="py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-on-surface/50 text-center sm:text-left">
              © {new Date().getFullYear()} ServiceHub. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              {legalLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-xs text-on-surface/50 hover:text-on-surface transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}

export default Footer;
