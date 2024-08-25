'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import BannerCard from '@/components/banner-card';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useState, FormEvent, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/authProvider';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import Loading from '@/components/loading';

interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

interface UserResponse {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}
function SignInContent() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    try {
      const response = await axios.post<LoginResponse>(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/login`,
        formData,
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
      );

      const { access_token, refresh_token } = response.data;

      // Get user details
      const userResponse = await axios.get<UserResponse>(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/me`,
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );

      const {
        email: userEmail,
        first_name,
        last_name,
        role,
      } = userResponse.data;

      login(access_token, refresh_token, userEmail, first_name, last_name);
      toast.success('Sign In successful');
      router.push('/chat');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ detail: string }>;
        setError(
          axiosError.response?.data?.detail ||
            'An error occurred during sign in'
        );
      } else {
        setError('An unexpected error occurred');
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

export default function SignUp() {
  return (
    <Suspense fallback={<Loading />}>
      <SignInContent />
    </Suspense>
  );
}
