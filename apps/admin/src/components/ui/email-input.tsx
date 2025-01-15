// use in input validation

"use client";

import { useState } from "react";

interface EmailInputProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  className?: string;
}

export function EmailInput({
  value,
  onChange,
  required = false,
  placeholder = "Email",
  className = "",
}: EmailInputProps) {
  const [isValid, setIsValid] = useState(true);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setIsValid(newValue === "" || validateEmail(newValue));
  };

  return (
    <div className="relative">
      <input
        type="email"
        value={value}
        onChange={handleChange}
        required={required}
        placeholder={placeholder}
        className={`${className} ${
          !isValid ? "border-error focus:ring-error" : ""
        }`}
      />
      {!isValid && (
        <p className="absolute text-xs text-error mt-1">
          Please enter a valid email address
        </p>
      )}
    </div>
  );
}
