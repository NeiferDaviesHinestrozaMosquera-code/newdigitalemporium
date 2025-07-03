
"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { signInWithEmailAndPassword, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, LogIn, CodeXml, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n/i18n-config';


// The actual form component that uses the hook
function LoginForm() {
  const pathname = usePathname();
  const lang = (pathname.split('/')[1] as Locale) || 'en';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();

  const getRedirectUrl = () => {
    const callbackUrl = searchParams.get('redirect');
    if (callbackUrl) {
        const hasLocale = /^\/(en|es|fr)/.test(callbackUrl);
        return hasLocale ? callbackUrl : `/${lang}${callbackUrl}`;
    }
    return `/${lang}/admin`;
  }
  const redirectUrl = getRedirectUrl();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: 'Login Successful', description: `Redirecting...` });
      router.push(redirectUrl);
    } catch (error: any) {
      console.error("Login attempt failed. Firebase error:", error);
      let description = 'Please check your credentials and try again.';
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        description = 'Invalid email or password. Please verify your credentials.';
      } else if (error.code === 'auth/invalid-api-key') {
        description = 'Firebase API Key is invalid. Please check configuration.';
      } else if (error.message) {
        description = error.message;
      }
      
      toast({
        title: 'Login Failed',
        description: description,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    document.title = `Admin Login - Digital Emporium`;
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <div className="absolute top-0 left-0 p-6">
        <Link href={`/${lang}/`} className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
          <CodeXml className="h-7 w-7" />
          <span className="font-semibold text-xl">Digital Emporium</span>
        </Link>
      </div>
      <Card className="w-full max-w-md shadow-2xl border-t-4 border-primary">
        <CardHeader className="text-center space-y-2">
          <ShieldAlert className="mx-auto h-12 w-12 text-primary" />
          <CardTitle className="text-3xl font-bold text-primary">Admin Portal</CardTitle>
          <CardDescription className="text-muted-foreground">
            Access the management dashboard. <br/>Please enter your credentials below.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-6 py-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base font-medium">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="text-base py-3 px-4 rounded-md"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-base font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="text-base py-3 px-4 rounded-md"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-2">
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6 rounded-md font-semibold" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <LogIn className="mr-2 h-5 w-5" />
              )}
              Secure Login
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Forgot your password? Contact support.
            </p>
          </CardFooter>
        </form>
      </Card>
       <p className="mt-8 text-sm text-muted-foreground max-w-md text-center">
        This area is restricted. Only authorized personnel should attempt to log in. All activities may be monitored.
      </p>
    </div>
  );
}


// The page component that wraps the form in a Suspense boundary
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
