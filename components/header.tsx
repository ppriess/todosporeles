"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import content from "@/data/home-content.json"

const { brand, nav } = content

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-navy",
        isScrolled && "shadow-[0_10px_30px_rgba(0,0,0,0.15)]"
      )}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between py-3">
        <Link href="#inicio" className="flex items-center" aria-label={brand.name}>
          <Image
            src={brand.logo}
            alt={brand.name}
            width={brand.logoWidth}
            height={brand.logoHeight}
            priority
            style={{ height: `${brand.logoHeight}px`, width: "auto", maxWidth: `${brand.logoWidth}px` }}
          />
        </Link>

        <div className="hidden md:flex gap-8 font-display font-semibold tracking-tight text-sm">
          {nav.items.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "transition-colors duration-300 pb-1",
                i === 0
                  ? "text-[#fcc420] border-b-2 border-[#fcc420]"
                  : "text-white/70 hover:text-[#fcc420]"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Button
            asChild
            className="hidden md:inline-flex bg-gradient-to-b from-primary to-primary-container text-primary-foreground font-display font-semibold shadow-md hover:scale-[0.98] transition-transform rounded-md"
          >
            <Link href={nav.ctaHref}>{nav.ctaLabel}</Link>
          </Button>

          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Menu" className="text-white hover:bg-white/10">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-sm p-0 bg-[#001a42] [&>button]:text-white">
              <div className="flex flex-col h-full">
                <div className="flex items-center p-4 border-b">
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    width={140}
                    height={48}
                    style={{ height: "48px", width: "auto" }}
                  />
                </div>
                <nav className="flex-1 overflow-y-auto p-4">
                  <ul className="space-y-1">
                    {nav.items.map((item) => (
                      <li key={item.href}>
                        <SheetClose asChild>
                          <Link
                            href={item.href}
                            className="block px-4 py-3 rounded-md text-base font-medium text-white hover:bg-white/10"
                          >
                            {item.label}
                          </Link>
                        </SheetClose>
                      </li>
                    ))}
                  </ul>
                </nav>
                <div className="p-4 border-t">
                  <SheetClose asChild>
                    <Button
                      asChild
                      className="w-full bg-gradient-to-b from-primary to-primary-container text-primary-foreground"
                    >
                      <Link href={nav.ctaHref}>{nav.ctaLabel}</Link>
                    </Button>
                  </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}
