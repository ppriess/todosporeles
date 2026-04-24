import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Mail, type LucideIcon } from "lucide-react"
import content from "@/data/home-content.json"

const { brand, footer } = content

const socialIconMap: Record<string, LucideIcon> = {
  Facebook,
  Instagram,
  Mail,
}

export function Footer() {
  const copyright = footer.copyright.replace(
    "{{year}}",
    new Date().getFullYear().toString()
  )

  return (
    <footer className="bg-navy text-navy-foreground w-full py-16 px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-1">
            <Link href="#inicio" className="inline-block mb-5">
              <Image
                src={brand.logo}
                alt={brand.name}
                width={160}
                height={52}
                style={{ height: "52px", width: "auto" }}
              />
            </Link>
            <p className="text-navy-foreground/70 text-xs uppercase tracking-widest leading-relaxed">
              {footer.tagline}
            </p>
          </div>

          {footer.columns.map((column) => (
            <div key={column.title}>
              <h5 className="font-display font-bold text-navy-foreground mb-4">
                {column.title}
              </h5>
              <ul className="space-y-2.5 text-sm">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-navy-foreground/70 hover:text-secondary-container transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-navy-foreground/15 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-navy-foreground/60 text-[10px] uppercase tracking-[0.2em] text-center md:text-left">
            {copyright}
          </p>
          <div className="flex gap-3">
            {footer.social.map((social) => {
              const Icon = socialIconMap[social.icon] ?? Mail
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target={social.href.startsWith("http") ? "_blank" : undefined}
                  rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg bg-navy-foreground/10 hover:bg-secondary-container hover:text-on-secondary-container flex items-center justify-center text-navy-foreground transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}
