'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import BannerCard from '@/components/banner-card';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/authProvider';
import axios from 'axios';
import { toast } from 'sonner';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post(
        // `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/signin`,
        `https://glowing-yodel-gxw569jxvxr2ww44-8000.app.github.dev/api/auth/signin`,
        {
          username: email, // Using email as username
          password,
        },
        { withCredentials: true }
      );

      const userResponse = await axios.get(
        `https://glowing-yodel-gxw569jxvxr2ww44-8000.app.github.dev/api/auth/user`,
        { withCredentials: true }
      );
      login(
        userResponse.data.email,
        userResponse.data.first_name,
        userResponse.data.last_name
      );
      toast.success('User Sign In successful');
      router.push('/dashboard');
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.detail) {
        // Handle structured error response
        if (Array.isArray(error.response.data.detail)) {
          const errorMessages = error.response.data.detail.map(
            (err: any) => err.msg
          );
          setError(errorMessages.join(', '));
        } else {
          setError(error.response.data.detail);
        }
      } else {
        setError('An error occurred during sign in');
      }
      toast.error('Sign In failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full w-full flex-col lg:flex-row">
      <div className="flex flex-1 items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-[400px] space-y-6">
          <Button variant="ghost" className="mb-4" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-sm underline">
                  Forgot your password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  Signing In...
                  <Loader2 className="h-4 w-4 animate-spin ml-4" />
                </>
              ) : (
                'Login'
              )}
            </Button>
          </form>
          <div className="text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden flex-1 lg:flex justify-center items-center bg-muted">
        <BannerCard />
      </div>
    </div>
  );
}
