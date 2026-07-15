"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Mail, Lock, Loader2, AlertCircle } from "lucide-react";

const loginSchema = zod.object({
  email: zod.string().email("Please enter a valid email address"),
  password: zod.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = zod.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const { data, error } = await authClient.signIn.email({
        email: values.email,
        password: values.password,
      });

      if (error) {
        setErrorMsg(error.message || "Invalid credentials.");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setErrorMsg("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setErrorMsg(null);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}/`,
      });
    } catch (err: any) {
      setErrorMsg("Failed to initialize Google Sign-in.");
      setGoogleLoading(false);
    }
  };

  const handleDemoLogin = () => {
    // Pre-fill fields and submit
    setValue("email", "customer@servicehub.com");
    setValue("password", "password123");
    // Directly invoke submit handler
    onSubmit({ email: "customer@servicehub.com", password: "password123" });
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center bg-background min-h-screen px-0 py-12 sm:px-6 lg:px-8">
      <div className="w-full sm:max-w-sm md:max-w-md bg-surface text-on-surface sm:rounded-xl sm:border border-outline-variant p-6 sm:p-8 md:p-10 shadow-sm transition-all duration-300">
        
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold tracking-tight text-primary font-display">
            ServiceHub
          </Link>
          <h2 className="mt-4 text-xl font-bold font-display">Welcome Back</h2>
          <p className="mt-2 text-sm text-on-surface/70">
            Sign in to access your services and bookings
          </p>
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-lg bg-error/10 text-error flex items-start gap-3 border border-error/20">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span className="text-sm font-medium">{errorMsg}</span>
          </div>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1">
            <label className="text-sm font-medium text-on-surface/80" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-on-surface/40">
                <Mail className="w-5 h-5" />
              </span>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-outline-variant bg-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-sm min-h-[44px]"
                {...register("email")}
              />
            </div>
            {errors.email && (
              <span className="text-xs text-error block mt-1">{errors.email.message}</span>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-on-surface/80" htmlFor="password">
                Password
              </label>
              <Link href="/forgot-password" className="text-xs font-semibold text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-on-surface/40">
                <Lock className="w-5 h-5" />
              </span>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-outline-variant bg-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-sm min-h-[44px]"
                {...register("password")}
              />
            </div>
            {errors.password && (
              <span className="text-xs text-error block mt-1">{errors.password.message}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full flex justify-center items-center py-3 px-4 rounded-lg bg-primary text-on-primary font-semibold text-sm hover:brightness-110 active:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer min-h-[44px]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-outline-variant"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-surface px-3 text-on-surface/50 font-medium">Or continue with</span>
          </div>
        </div>

        {/* Social & Demo Controls */}
        <div className="space-y-3">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading || googleLoading}
            className="w-full flex justify-center items-center py-2.5 px-4 rounded-lg border border-outline-variant bg-surface hover:bg-surface-container-low text-on-surface font-semibold text-sm transition-all duration-200 cursor-pointer min-h-[44px]"
          >
            {googleLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            Google
          </button>

          <button
            onClick={handleDemoLogin}
            disabled={loading || googleLoading}
            className="w-full flex justify-center items-center py-2.5 px-4 rounded-lg bg-secondary text-on-primary font-semibold text-sm hover:brightness-110 active:brightness-95 transition-all duration-200 cursor-pointer min-h-[44px]"
          >
            Try Demo Account
          </button>
        </div>

        {/* Register Link */}
        <p className="mt-8 text-center text-sm text-on-surface/70">
          Don't have an account?{" "}
          <Link href="/register" className="font-semibold text-primary hover:underline">
            Sign up now
          </Link>
        </p>

      </div>
    </div>
  );
}
