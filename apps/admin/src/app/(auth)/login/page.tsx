"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner";
import { EmailInput } from "@/components/ui/email-input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/check");
        if (response.ok) {
          router.push("/dashboard");
        }
      } catch (error) {
        // User is not authenticated, stay on login page
      }
    };
    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!email || !password) {
        throw new Error("All fields are required");
      }

      const response = await axios.post("/api/auth/login", {
        email,
        password,
      });

      if (response.status === 200) {
        toast.success("Login successful!");
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Login failed";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsResettingPassword(true);
    try {
      if (!email) {
        throw new Error("Email is required");
      }

      const response = await axios.post("/api/auth/forgot-password", {
        email,
      });

      if (response.status === 200) {
        toast.success("Password reset instructions sent to your email!");
        setShowForgotPassword(false);
      }
    } catch (error: any) {
      console.error("Password reset error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to send reset instructions";
      toast.error(errorMessage);
    } finally {
      setIsResettingPassword(false);
    }
  };

  if (showForgotPassword) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-[400px] bg-foreground rounded-lg shadow-md border border-border">
          <div className="p-4 sm:p-6 border-b border-border">
            <h2 className="text-xl sm:text-2xl font-bold text-copy">
              Reset Password
            </h2>
            <p className="text-xs sm:text-sm text-copy-light">
              Enter your email to receive reset instructions
            </p>
          </div>
          <div className="p-4 sm:p-6">
            <form
              onSubmit={handleForgotPassword}
              className="space-y-4 sm:space-y-6"
            >
              <EmailInput
                value={email}
                onChange={setEmail}
                required
                className="w-full px-3 py-2 bg-foreground border border-border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-dark text-copy text-sm sm:text-base"
              />

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={isResettingPassword}
                  className="flex-1 py-2 px-4 bg-primary hover:bg-primary-light text-primary-content font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {isResettingPassword ? "Sending..." : "Send Reset Link"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="flex-1 py-2 px-4 bg-background text-copy border border-border hover:bg-border rounded-md transition-colors text-sm sm:text-base"
                >
                  Back to Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-[400px] bg-foreground rounded-lg shadow-md border border-border">
        <div className="p-4 sm:p-6 border-b border-border">
          <h2 className="text-xl sm:text-2xl font-bold text-copy">Login</h2>
          <p className="text-xs sm:text-sm text-copy-light">
            Sign in to your account
          </p>
        </div>
        <div className="p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <EmailInput
              value={email}
              onChange={setEmail}
              required
              className="w-full px-3 py-2 bg-foreground border border-border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-dark text-copy text-sm sm:text-base"
            />

            <div className="space-y-2">
              <input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 bg-foreground border border-border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-dark text-copy text-sm sm:text-base"
              />
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-primary hover:text-primary-light transition-colors"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-primary hover:bg-primary-light text-primary-content font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Login"
              )}
            </button>
          </form>
          <div className="mt-4 text-center text-sm text-copy-light">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-primary hover:text-primary-light transition-colors"
            >
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
