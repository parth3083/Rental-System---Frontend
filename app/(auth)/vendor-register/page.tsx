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
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { authService } from "@/services/auth.service";
import { toast } from "sonner";

const vendorRegisterSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    companyName: z.string().min(1, "Company name is required"),
    productCategory: z.string().min(1, "Product category is required"),
    gstNumber: z
      .string()
      .length(15, "GST Number must be 15 characters")
      .regex(
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
        "Invalid GST Number format",
      ),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(12, "Password must be at most 12 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$&_]).*$/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one special character (@, $, &, _)",
      ),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type VendorRegisterFormValues = z.infer<typeof vendorRegisterSchema>;

export default function VendorRegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<VendorRegisterFormValues>({
    resolver: zodResolver(vendorRegisterSchema),
  });

  const onSubmit = async (data: VendorRegisterFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        role: "VENDOR" as const,
        companyName: data.companyName,
        productCategory: data.productCategory,
        gstNumber: data.gstNumber,
      };
      const response = await authService.register(payload);

      toast.success("Vendor registration successful!");

      if (typeof window !== "undefined") {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      router.push("/admin/orders");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Registration failed");
        toast.error(err.message || "Registration failed");
      } else {
        setError("Registration failed");
        toast.error("Registration failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl">Vendor Sign Up</CardTitle>
        <CardDescription>
          Join as a vendor to list rental products
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
              {error}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="Jane"
                {...register("firstName")}
              />
              {errors.firstName && (
                <span className="text-xs text-red-500">
                  {errors.firstName.message}
                </span>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Smith"
                {...register("lastName")}
              />
              {errors.lastName && (
                <span className="text-xs text-red-500">
                  {errors.lastName.message}
                </span>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                placeholder="Acme Rentals"
                {...register("companyName")}
              />
              {errors.companyName && (
                <span className="text-xs text-red-500">
                  {errors.companyName.message}
                </span>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="productCategory">Product Category</Label>
              <Input
                id="productCategory"
                placeholder="Electronics"
                {...register("productCategory")}
              />
              {errors.productCategory && (
                <span className="text-xs text-red-500">
                  {errors.productCategory.message}
                </span>
              )}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="gstNumber">GST No</Label>
            <Input
              id="gstNumber"
              placeholder="22AAAAA0000A1Z5"
              {...register("gstNumber")}
            />
            {errors.gstNumber && (
              <span className="text-xs text-red-500">
                {errors.gstNumber.message}
              </span>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email ID</Label>
            <Input
              id="email"
              type="email"
              placeholder="vendor@example.com"
              {...register("email")}
            />
            {errors.email && (
              <span className="text-xs text-red-500">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...register("password")} />
              {errors.password && (
                <span className="text-xs text-red-500">
                  {errors.password.message}
                </span>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <span className="text-xs text-red-500">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "creating account..." : "Register Vendor"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
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
