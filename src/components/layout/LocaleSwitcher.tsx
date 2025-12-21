
"use client"

import { usePathname, useRouter } from "next/navigation"
import type { Locale } from "@/lib/i18n/i18n-config"
import { i18n } from "@/lib/i18n/i18n-config"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Languages } from "lucide-react" // Using a generic languages icon

export default function LocaleSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const router = useRouter()
  const pathname = usePathname()

  const changeLocale = (newLocale: Locale) => {
    if (!pathname) return
    // Remove current locale prefix from pathname
    const segments = pathname.split('/')
    if (i18n.locales.includes(segments[1] as Locale)) {
      segments.splice(1, 1)
    }
    const newPath = `/${newLocale}${segments.join('/')}`
    router.push(newPath)
    router.refresh() // Important to refresh server components with new locale
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Languages className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Change language - {currentLocale.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {i18n.locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => changeLocale(locale)}
            disabled={currentLocale === locale}
          >
            {locale.toUpperCase()}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
