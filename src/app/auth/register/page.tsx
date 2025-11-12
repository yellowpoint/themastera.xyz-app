"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { generateVerifyEmailCallbackURL } from "@/utils/auth";
import { MagicCard } from "@/components/ui/magic-card";

type RegisterFormData = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export default function RegisterPage() {
  const { theme } = useTheme();
  const { signUp, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (field: keyof RegisterFormData, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name.trim()) {
      setError("Please enter your full name");
      return;
    }
    if (!formData.email.trim()) {
      setError("Please enter your email address");
      return;
    }
    if (!formData.password) {
      setError("Please enter your password");
      return;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await signUp({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        callbackURL: generateVerifyEmailCallbackURL(formData.email),
      });

      if (result?.error) {
        const msg =
          typeof result.error === "string"
            ? result.error
            : result.error?.message;
        setError(msg || "Registration failed, please try again later");
      } else {
        setSuccess(
          "Registration successful. Please check your email to verify your account."
        );
      }
    } catch (err) {
      setError("Registration failed, please try again later");
      // eslint-disable-next-line no-console
      console.error("Registration error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-full flex items-center justify-center">
      <div className="w-full max-w-md">
        <Card className="w-full max-w-sm border-none p-0 shadow-none">
          <MagicCard
            gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
            className="p-0"
          >
          <CardHeader className="border-border border-b p-4 [.border-b]:pb-4">
            <CardTitle>Create an account</CardTitle>
            <CardDescription>
              Enter your information below to create your account
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <form onSubmit={handleSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">Full Name</FieldLabel>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                  />
                  <FieldDescription>
                    We&apos;ll use this to contact you. We will not share your
                    email with anyone else.
                  </FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    required
                  />
                  <FieldDescription>
                    Must be at least 8 characters long.
                  </FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="confirm-password">
                    Confirm Password
                  </FieldLabel>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleChange("confirmPassword", e.target.value)
                    }
                    required
                  />
                  <FieldDescription>
                    Please confirm your password.
                  </FieldDescription>
                </Field>

                {error && (
                  <div className="text-destructive text-sm" role="alert">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="text-green-600 text-sm" role="status">
                    {success}
                  </div>
                )}

                <FieldGroup>
                  <Field>
                    <div className="flex gap-3">
                      <Button type="submit" disabled={isSubmitting || loading}>
                        {isSubmitting || loading
                          ? "Creating..."
                          : "Create Account"}
                      </Button>
                    </div>
                    <FieldDescription className="px-6 text-center">
                      Already have an account?{" "}
                      <Link href="/auth/login">Sign in</Link>
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </FieldGroup>
            </form>
          </CardContent>
          </MagicCard>
        </Card>
      </div>
    </div>
  );
}
