"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isCheckingVerification, setIsCheckingVerification] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/check");
        if (response.ok) {
          router.push("/dashboard");
        }
      } catch (error) {
        // User is not authenticated, stay on register page
      }
    };
    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!email || !password || !name) {
        throw new Error("All fields are required");
      }

      const response = await axios.post("/api/auth/register", {
        email,
        password,
        name,
      });

      if (response.status === 201) {
        setIsRegistered(true);
        toast.success("Registration submitted successfully!");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Registration failed";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckVerification = async () => {
    try {
      setIsCheckingVerification(true);
      const response = await axios.post("/api/auth/check-verification", {
        email,
      });

      if (response.data.verified) {
        toast.success(response.data.message);
        setTimeout(() => router.push("/login"), 2000);
      } else {
        toast.info(response.data.message);
      }
    } catch (error: any) {
      if (error.response?.status === 429) {
        toast.error(
          "Too many attempts. Please wait a minute before trying again."
        );
      } else {
        toast.error(
          error.response?.data?.message || "Failed to check verification status"
        );
      }
    } finally {
      setIsCheckingVerification(false);
    }
  };

  if (isRegistered) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-[400px] p-4 sm:p-6 bg-foreground rounded-lg shadow-md border border-border text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-copy mb-4">
            Registration Submitted
          </h2>
          <div className="mb-6">
            <p className="text-sm sm:text-base text-copy-light mb-4">
              Thank you for registering, <strong>{name}</strong>!
            </p>
            <p className="text-sm sm:text-base text-copy-light mb-4">
              Your registration is being reviewed by our admin team.
            </p>
          </div>
          <div className="space-y-4 text-xs sm:text-sm text-copy-light">
            <div className="p-3 sm:p-4 bg-background rounded-lg">
              <h3 className="font-semibold mb-2">What happens next?</h3>
              <ol className="text-left space-y-2">
                <li>1. Our admin team will review your registration</li>
                <li>2. Once approved, you'll be able to log in</li>
                <li>3. You can check your verification status below</li>
              </ol>
            </div>
            <div className="mt-6">
              <button
                onClick={handleCheckVerification}
                disabled={isCheckingVerification}
                className="w-full py-2 px-4 bg-primary hover:bg-primary-light text-primary-content font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {isCheckingVerification
                  ? "Checking..."
                  : "Check Verification Status"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-[400px] bg-foreground rounded-lg shadow-md border border-border">
        <div className="p-4 sm:p-6 border-b border-border">
          <h2 className="text-xl sm:text-2xl font-bold text-copy">Register</h2>
          <p className="text-xs sm:text-sm text-copy-light">
            Create a new account
          </p>
        </div>
        <div className="p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <input
              id="name"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 bg-foreground border border-border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-dark text-copy text-base"
              style={{ fontSize: "16px" }}
            />

            <input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 bg-foreground border border-border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-dark text-copy text-base"
              style={{ fontSize: "16px" }}
            />

            <input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 bg-foreground border border-border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-dark text-copy text-base"
              style={{ fontSize: "16px" }}
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-primary hover:bg-primary-light text-primary-content font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
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
                  Creating account...
                </span>
              ) : (
                "Register"
              )}
            </button>
          </form>
          <div className="mt-4 text-center text-sm text-copy-light">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary hover:text-primary-light transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
