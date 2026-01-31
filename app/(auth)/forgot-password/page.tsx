"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { authService } from "@/services/auth.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Schemas
const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const otpSchema = z.object({
  code: z
    .string()
    .length(6, "Code must be 6 digits")
    .regex(/^\d+$/, "Code must be numbers only"),
});

const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(12, "Password must be at most 12 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$&_]).*$/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one special character (@, $, &, _)",
      ),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type EmailFormValues = z.infer<typeof emailSchema>;
type OtpFormValues = z.infer<typeof otpSchema>;
type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState<string>("");
  const [resetCode, setResetCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // Forms
  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
  });

  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
  });

  const passwordForm = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  // Handlers
  const onEmailSubmit = async (data: EmailFormValues) => {
    setIsLoading(true);
    try {
      await authService.forgotPassword(data.email);
      setEmail(data.email);
      setStep(2);
      toast.success("Verification code sent to your email");
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || "Failed to send code");
      } else {
        toast.error("Failed to send code");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onOtpSubmit = async (data: OtpFormValues) => {
    setIsLoading(true);
    try {
      await authService.verifyResetCode(email, data.code);
      setResetCode(data.code);
      setStep(3);
      toast.success("Code verified successfully");
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || "Invalid code");
      } else {
        toast.error("Invalid code");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onPasswordSubmit = async (data: ResetPasswordFormValues) => {
    setIsLoading(true);
    try {
      await authService.resetPassword({
        email,
        code: resetCode,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      toast.success("Password reset successfully. Please login.");
      router.push("/login");
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || "Failed to reset password");
      } else {
        toast.error("Failed to reset password");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl">
          {step === 1 && "Reset Password"}
          {step === 2 && "Verify Code"}
          {step === 3 && "New Password"}
        </CardTitle>
        <CardDescription>
          {step === 1 && "Enter your email to receive a password reset code"}
          {step === 2 && `Enter the 6-digit code sent to ${email}`}
          {step === 3 && "Create a new password for your account"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === 1 && (
          <form
            onSubmit={emailForm.handleSubmit(onEmailSubmit)}
            className="grid gap-4"
          >
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                {...emailForm.register("email")}
              />
              {emailForm.formState.errors.email && (
                <span className="text-xs text-red-500">
                  {emailForm.formState.errors.email.message}
                </span>
              )}
            </div>
            <Button className="w-full" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Verification Code"}
            </Button>
          </form>
        )}

        {step === 2 && (
          <form
            onSubmit={otpForm.handleSubmit(onOtpSubmit)}
            className="grid gap-4"
          >
            <div className="grid gap-2">
              <Label htmlFor="code">Verification Code</Label>
              <Input
                id="code"
                placeholder="123456"
                maxLength={6}
                {...otpForm.register("code")}
              />
              {otpForm.formState.errors.code && (
                <span className="text-xs text-red-500">
                  {otpForm.formState.errors.code.message}
                </span>
              )}
            </div>
            <Button className="w-full" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Verify Code"}
            </Button>
            <div className="text-center">
              <Button
                variant="link"
                type="button"
                onClick={() => setStep(1)}
                className="text-sm text-muted-foreground"
              >
                Back to Email
              </Button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form
            onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
            className="grid gap-4"
          >
            <div className="grid gap-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                {...passwordForm.register("newPassword")}
              />
              {passwordForm.formState.errors.newPassword && (
                <span className="text-xs text-red-500">
                  {passwordForm.formState.errors.newPassword.message}
                </span>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...passwordForm.register("confirmPassword")}
              />
              {passwordForm.formState.errors.confirmPassword && (
                <span className="text-xs text-red-500">
                  {passwordForm.formState.errors.confirmPassword.message}
                </span>
              )}
            </div>
            <Button className="w-full" disabled={isLoading}>
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <div className="text-center text-sm text-muted-foreground">
          Remember your password?{" "}
          <Link
            href="/login"
            className="text-primary hover:underline font-medium"
          >
            Sign in
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
