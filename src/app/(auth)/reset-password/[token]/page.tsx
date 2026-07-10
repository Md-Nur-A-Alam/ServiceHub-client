"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Lock, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

const resetSchema = zod.object({
  password: zod.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: zod.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ResetFormValues = zod.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams();
  const token = params?.token as string;

  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async (values: ResetFormValues) => {
    if (!token) {
      setErrorMsg("Invalid or missing password reset token.");
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    try {
      const { data, error } = await authClient.resetPassword({
        newPassword: values.password,
        token: token,
      });

      if (error) {
        setErrorMsg(error.message || "Failed to reset password.");
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    } catch (err: any) {
      setErrorMsg("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center bg-background min-h-screen px-0 py-12 sm:px-6 lg:px-8">
      <div className="w-full sm:max-w-sm md:max-w-md bg-surface text-on-surface sm:rounded-xl sm:border border-outline-variant p-6 sm:p-8 md:p-10 shadow-sm transition-all duration-300">
        
        {success ? (
          /* Success state */
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/15 text-accent mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold font-display">Password Reset Success</h2>
            <p className="mt-3 text-sm text-on-surface/70 leading-relaxed">
              Your password has been successfully updated. You will be redirected to the sign in page shortly.
            </p>
            <div className="mt-8">
              <Link href="/login" className="w-full flex justify-center items-center py-2.5 px-4 rounded-lg bg-primary text-on-primary font-semibold text-sm hover:brightness-110 active:brightness-95 transition-all duration-200 cursor-pointer min-h-[44px]">
                Go to Sign In
              </Link>
            </div>
          </div>
        ) : (
          /* Form state */
          <div>
            {/* Header */}
            <div className="text-center mb-6">
              <Link href="/" className="text-2xl font-bold tracking-tight text-primary font-display">
                ServiceHub
              </Link>
              <h2 className="mt-4 text-xl font-bold font-display">Set New Password</h2>
              <p className="mt-2 text-sm text-on-surface/70">
                Please choose a new, secure password for your account
              </p>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="mb-6 p-4 rounded-lg bg-error/10 text-error flex items-start gap-3 border border-error/20">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span className="text-sm font-medium">{errorMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-on-surface/80" htmlFor="password">
                  New Password
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
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 rounded-lg bg-primary text-on-primary font-semibold text-sm hover:brightness-110 active:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer min-h-[44px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
