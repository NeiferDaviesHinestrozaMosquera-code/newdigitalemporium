import { NextResponse, type NextRequest } from 'next/server'
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

export const locales = ['en', 'es', 'fr'] as const
export const defaultLocale = 'en'

function getLocale(request: NextRequest): string {
  const headers: Record<string, string> = {}
  request.headers.forEach((value, key) => (headers[key] = value))
  
  // @ts-ignore languages are readonly
  const languages = new Negotiator({ headers }).languages()
  
  try {
    return match(languages, locales as unknown as string[], defaultLocale)
  } catch (e) {
    return defaultLocale
  }
}

export function middleware(request: NextRequest) {  // ✅ Cambiar "proxy" a "middleware"
  const { pathname } = request.nextUrl
  
  // Check if the pathname already has a locale prefix
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`  // ✅ Corregir template literals
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