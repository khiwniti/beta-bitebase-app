"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Checkbox } from "../../../components/ui/checkbox";
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import BiteBaseLogo from "../../../components/BiteBaseLogo";
import { useAuth } from "../../../contexts/AuthContext";

// Form schema
const registerSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .refine(
      (password) => /[A-Z]/.test(password),
      "Password must contain at least one uppercase letter"
    )
    .refine(
      (password) => /[0-9]/.test(password),
      "Password must contain at least one number"
    ),
  restaurantName: z
    .string()
    .min(2, { message: "Restaurant name must be at least 2 characters" }),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
  acceptMarketing: z.boolean().optional(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [registrationError, setRegistrationError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "Demo",
      lastName: "User",
      email: "demo@bitebase.ai",
      password: "Demo123456",
      restaurantName: "Demo Restaurant",
      acceptTerms: false,
      acceptMarketing: false,
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setRegistrationError("");

    try {
      console.log("Registration data:", data);
      
      // Call the actual signup API
      await signUp(data.email, data.password, {
        name: `${data.firstName} ${data.lastName}`,
        firstName: data.firstName,
        lastName: data.lastName,
        restaurantName: data.restaurantName,
        acceptMarketing: data.acceptMarketing
      });

      // Redirect to dashboard after successful registration
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Registration error:", error);
      setRegistrationError(
        error.message || "An error occurred during registration. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6 text-center">
        <Link href="/">
          <BiteBaseLogo size="md" className="mx-auto" showText={false} />
        </Link>
        <h2 className="mt-4 text-2xl font-bold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Join thousands of restaurants using BiteBase
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="shadow-lg border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Sign Up</CardTitle>
            <CardDescription className="text-sm">
              Enter your information to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {registrationError && (
              <div className="mb-3 p-2.5 bg-red-50 border border-red-200 text-red-800 rounded-md text-xs">
                {registrationError}
              </div>
            )}
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName" className="text-xs">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    {...register("firstName")}
                    className={`text-sm ${errors.firstName ? "border-red-500" : ""}`}
                    disabled={isLoading}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-0.5">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="lastName" className="text-xs">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    {...register("lastName")}
                    className={`text-sm ${errors.lastName ? "border-red-500" : ""}`}
                    disabled={isLoading}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-xs mt-0.5">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs">Email Address</Label>
                <Input
                  id="email"
                  placeholder="john.doe@example.com"
                  type="email"
                  autoComplete="email"
                  {...register("email")}
                  className={`text-sm ${errors.email ? "border-red-500" : ""}`}
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-0.5">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    {...register("password")}
                    className={`text-sm ${errors.password ? "border-red-500 pr-10" : "pr-10"}`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-0.5">
                    {errors.password.message}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-0.5">
                  Password must be at least 8 characters with one uppercase letter and one number.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="restaurantName" className="text-xs">Restaurant Name</Label>
                <Input
                  id="restaurantName"
                  placeholder="Your Restaurant"
                  {...register("restaurantName")}
                  className={`text-sm ${errors.restaurantName ? "border-red-500" : ""}`}
                  disabled={isLoading}
                />
                {errors.restaurantName && (
                  <p className="text-red-500 text-xs mt-0.5">
                    {errors.restaurantName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2 pt-1">
                <div className="flex items-start">
                  <div className="flex items-center h-4">
                    <Checkbox
                      id="acceptTerms"
                      {...register("acceptTerms")}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="ml-2 text-xs">
                    <Label
                      htmlFor="acceptTerms"
                      className={`font-medium ${
                        errors.acceptTerms ? "text-red-500" : "text-gray-700"
                      }`}
                    >
                      I accept the{" "}
                      <Link
                        href="/terms"
                        className="text-primary-600 hover:text-primary-500 hover:underline"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy"
                        className="text-primary-600 hover:text-primary-500 hover:underline"
                      >
                        Privacy Policy
                      </Link>
                    </Label>
                    {errors.acceptTerms && (
                      <p className="text-red-500 text-xs mt-0.5">
                        {errors.acceptTerms.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-4">
                    <Checkbox
                      id="acceptMarketing"
                      {...register("acceptMarketing")}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="ml-2 text-xs">
                    <Label htmlFor="acceptMarketing" className="font-medium text-gray-700">
                      I'd like to receive product updates and marketing communications
                    </Label>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700 text-white text-sm py-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-4">
            <p className="text-xs text-gray-600">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="font-medium text-primary-600 hover:text-primary-500 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 