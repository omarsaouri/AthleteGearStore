"use client";

import { useState } from "react";
import axios from "axios";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Basic validation
      if (!email || !password || !name) {
        throw new Error("All fields are required");
      }

      const response = await axios.post("/api/auth/register", {
        email,
        password,
        name,
      });

      if (response.status === 201) {
        // Usually 201 for resource creation
        // Redirect to login page after successful registration
        window.location.href = "/login";
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      // You might want to show this error to the user using a toast or alert
      const errorMessage =
        error.response?.data?.message || error.message || "Registration failed";
      alert(errorMessage); // Replace with your preferred error display method
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-background ">
      <div className="w-[400px] bg-foreground rounded-lg shadow-md border border-border">
        <div className="p-6 border-b border-border">
          <h2 className="text-2xl font-bold text-copy">Register</h2>
          <p className="text-sm text-copy-light">Create a new account</p>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              id="name"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
              required
              className="w-full px-3 py-2 bg-foreground border border-border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-dark text-copy"
            />

            <input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              required
              className="w-full px-3 py-2 bg-foreground border border-border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-dark text-copy"
            />

            <input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              required
              className="w-full px-3 py-2 bg-foreground border border-border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-dark"
            />

            <button
              type="submit"
              className="w-full py-2 px-4 bg-primary hover:bg-primary-light text-primary-content font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
