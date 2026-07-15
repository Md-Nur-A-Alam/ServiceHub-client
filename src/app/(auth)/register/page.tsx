"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { User, Mail, Lock, Loader2, AlertCircle } from "lucide-react";

const registerSchema = zod.object({
  name: zod.string().min(2, "Name must be at least 2 characters"),
  email: zod.string().email("Please enter a valid email address"),
  password: zod.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: zod.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormValues = zod.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<"customer" | "provider">("customer");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const { data, error } = await authClient.signUp.email({
        email: values.email,
        password: values.password,
        name: values.name,
        role: role,
        callbackURL: `${window.location.origin}/dashboard`,
      });

      if (error) {
        setErrorMsg(error.message || "Failed to create account.");
      } else {
        router.push("/dashboard");
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
        callbackURL: `${window.location.origin}/dashboard`,
      });
    } catch (err: any) {
      setErrorMsg("Failed to initialize Google Sign-in.");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center bg-background min-h-screen px-0 py-12 sm:px-6 lg:px-8">
      <div className="w-full sm:max-w-sm md:max-w-md bg-surface text-on-surface sm:rounded-xl sm:border border-outline-variant p-6 sm:p-8 md:p-10 shadow-sm transition-all duration-300">

        {/* Header */}
        <div className="text-center mb-6">
          <Link href="/" className="text-2xl font-bold tracking-tight text-primary font-display">
            ServiceHub
          </Link>
          <h2 className="mt-4 text-xl font-bold font-display">Create Account</h2>
          <p className="mt-2 text-sm text-on-surface/70">
            Join local providers and customers today
          </p>
        </div>

        {/* Role Segmented Control */}
        <div className="flex bg-surface-container rounded-lg p-1 mb-6 border border-outline-variant/50">
          <button
            type="button"
            onClick={() => setRole("customer")}
            className={`flex-1 text-center py-2 text-sm font-semibold rounded-md transition-all duration-200 cursor-pointer min-h-[40px] ${role === "customer"
                ? "bg-primary text-on-primary shadow-sm"
                : "text-on-surface/75 hover:bg-surface-container-high"
              }`}
          >
            I need services
          </button>
          <button
            type="button"
            onClick={() => setRole("provider")}
            className={`flex-1 text-center py-2 text-sm font-semibold rounded-md transition-all duration-200 cursor-pointer min-h-[40px] ${role === "provider"
                ? "bg-primary text-on-primary shadow-sm"
                : "text-on-surface/75 hover:bg-surface-container-high"
              }`}
          >
            I offer services
          </button>
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-lg bg-error/10 text-error flex items-start gap-3 border border-error/20">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span className="text-sm font-medium">{errorMsg}</span>
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-on-surface/80" htmlFor="name">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-on-surface/40">
                <User className="w-5 h-5" />
              </span>
              <input
                id="name"
                type="text"
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-outline-variant bg-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-sm min-h-[44px]"
                {...register("name")}
              />
            </div>
            {errors.name && (
              <span className="text-xs text-error block mt-1">{errors.name.message}</span>
            )}
          </div>

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
            <label className="text-sm font-medium text-on-surface/80" htmlFor="password">
              Password
            </label>
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

          <div className="space-y-1">
            <label className="text-sm font-medium text-on-surface/80" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-on-surface/40">
                <Lock className="w-5 h-5" />
              </span>
              <input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-outline-variant bg-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-sm min-h-[44px]"
                {...register("confirmPassword")}
              />
            </div>
            {errors.confirmPassword && (
              <span className="text-xs text-error block mt-1">{errors.confirmPassword.message}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full flex justify-center items-center py-3 px-4 rounded-lg bg-primary text-on-primary font-semibold text-sm hover:brightness-110 active:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer min-h-[44px]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating account...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-outline-variant"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-surface px-3 text-on-surface/50 font-medium">Or sign up with</span>
          </div>
        </div>

        {/* Social */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading || googleLoading}
          className="w-full flex justify-center items-center py-2.5 px-4 rounded-lg border border-outline-variant bg-surface hover:bg-surface-container-low text-on-surface font-semibold text-sm transition-all duration-200 cursor-pointer min-h-[44px]"
        >
          {googleLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
          )}
          Google
        </button>

        {/* Login Link */}
        <p className="mt-6 text-center text-sm text-on-surface/70">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
}
