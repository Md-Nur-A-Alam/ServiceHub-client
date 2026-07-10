"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Mail, Loader2, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";

const forgotSchema = zod.object({
  email: zod.string().email("Please enter a valid email address"),
});

type ForgotFormValues = zod.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: ForgotFormValues) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const { data, error } = await authClient.requestPasswordReset({
        email: values.email,
        redirectTo: "/reset-password",
      });

      if (error) {
        setErrorMsg(error.message || "Failed to send reset link.");
      } else {
        setSuccess(true);
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
        
        {/* Back Link */}
        <div className="mb-6">
          <Link href="/login" className="inline-flex items-center text-xs font-semibold text-on-surface/60 hover:text-primary transition-all duration-200">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to login
          </Link>
        </div>

        {success ? (
          /* Success state */
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/15 text-accent mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold font-display">Check your email</h2>
            <p className="mt-3 text-sm text-on-surface/70 leading-relaxed">
              We have sent a password reset link to your email address. Please follow the instructions in the email to reset your password.
            </p>
            <div className="mt-8">
              <Link href="/login" className="w-full flex justify-center items-center py-2.5 px-4 rounded-lg bg-primary text-on-primary font-semibold text-sm hover:brightness-110 active:brightness-95 transition-all duration-200 cursor-pointer min-h-[44px]">
                Return to Sign In
              </Link>
            </div>
          </div>
        ) : (
          /* Input state */
          <div>
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold font-display">Reset Password</h2>
              <p className="mt-2 text-sm text-on-surface/70">
                Enter your email address and we'll send you a link to reset your password
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

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 rounded-lg bg-primary text-on-primary font-semibold text-sm hover:brightness-110 active:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer min-h-[44px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
