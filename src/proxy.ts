
import { NextResponse, type NextRequest } from 'next/server'
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

export const locales = ['en', 'es', 'fr']
export const defaultLocale = 'en'

function getLocale(request: NextRequest): string {
  const headers: Record<string, string> = {}
  request.headers.forEach((value, key) => (headers[key] = value))

  // @ts-ignore languages are readonly
  const languages = new Negotiator({ headers }).languages()

  try {
    return match(languages, locales, defaultLocale)
  } catch (e) {
    return defaultLocale
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the pathname already has a locale prefix
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) {
    return NextResponse.next()
  }

  // Redirect if there is no locale
  const locale = getLocale(request)
  const newPathname = `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`
  
  return NextResponse.redirect(new URL(newPathname, request.url))
}

export const config = {
  matcher: [
    // Skip all internal paths (_next) and static assets (images, favicon)
    '/((?!_next|images|favicon.ico|api).*)',
    // Optional: only run on root (/) URL, if you want to redirect from / to /en
    // '/'
  ],
}
