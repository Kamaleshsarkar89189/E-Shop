"use client";

import GoogleButton from 'apps/user-ui/src/shared/components/google-button';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react';
import { useForm } from "react-hook-form";
import "../../../public/Login.css";
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from "axios";

type FormData = {
  name: string;
  email: string;
  password: string;
};

const Signup = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [timer, setTimer] = useState(60);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [userData, setUserData] = useState<FormData | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const startResendTimer = () => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000)
  };

  const signupMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/user-registration`,
        data
      );
      return response.data;
    },
    onSuccess: (_, formData) => {
      setUserData(formData);
      setShowOtp(true);
      setCanResend(false);
      setTimer(60);
      startResendTimer();
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      if (!userData) return;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/verify-user`,
        {
          ...userData,
          otp: otp.join(""),
        }
      );

      return response.data;
    },
    onSuccess: (data) => {
      router.push("/login");
    },
    onError: (error) => {
      console.error("OTP verification failed:", error);
    },
  });

  const onSubmit = (data: FormData) => {
    signupMutation.mutate(data);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const resendOtp = () => {
    if (userData) {
      signupMutation.mutate(userData);
    }
  };

  return (
    <div className="login-page">
      <h1 className="login-title">Sign Up</h1>
      <p className="login-breadcrumb">Home . Signup</p>

      <div className="login-container">
        <div className="login-card">
          <h3 className="login-heading">Signup to Eshop</h3>
          <p className="login-subheading">
            Already have an account?{" "}
            <Link href="/login" className="signup-link">
              Login
            </Link>
          </p>

          <GoogleButton />

          <div className="divider">
            <div className="line" />
            <span className="divider-text">or sign in with Email</span>
            <div className="line" />
          </div>

          {!showOtp ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              <label className="form-label">Name</label>
              <input
                type="text"
                placeholder="kamaleshsarkar"
                className="form-input"
                {...register("name", {
                  required: "Name is required",
                })}
              />
              {errors.name && (
                <p className="error-text">{String(errors.name.message)}</p>
              )}
              <label className="form-label">Email</label>
              <input
                type="email"
                placeholder="support@kamalesh.com"
                className="form-input"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="error-text">{String(errors.email.message)}</p>
              )}

              <label className="form-label">Password</label>
              <div className="password-wrapper">
                <input
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  className="form-input"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="password-toggle"
                >
                  {passwordVisible ? <Eye /> : <EyeOff />}
                </button>
              </div>
              {errors.password && (
                <p className="error-text">{String(errors.password.message)}</p>
              )}

              <button
                type="submit"
                disabled={signupMutation.isPending}
                className="submit-btn mt-4">
                {signupMutation.isPending ? "Signing up..." : "Signup"}
              </button>
              {signupMutation.isError &&
                signupMutation.error instanceof AxiosError && (
                <p className="signup-error">
                    {signupMutation.error.response?.data?.message ||
                      signupMutation.error.message}
                  </p>
                )}
            </form>
          ) : (
            <div>
              <h3 className='text-xl font-semibold text-center mb-4'>
                Enter OTP
              </h3>
              <div className="flex justify-center gap-6">
                {otp?.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    ref={(el) => {
                      if (el) inputRefs.current[index] = el;
                    }}
                    maxLength={1}
                    className="w-12 h-12 text-center border border-gray-300 outline-none !rounded"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  />
                ))}
              </div>
              <button
                className='w-full mt-4 text-lg cursor-pointer bg-blue-500 text-white py-2 rounded-lg'
                disabled={verifyOtpMutation.isPending}
                onClick={() => verifyOtpMutation.mutate()}
              >
                {verifyOtpMutation.isPending ? "Verifying..." : "Verify OTP"}
              </button>
              <p className='text-center text-sm mt-4'>
                {canResend ? (
                  <button
                    onClick={resendOtp}
                    className='text-blue-500 cursor-pointer'
                  >Resend OTP</button>
                ) : (
                  `Resend OTP in ${timer}s`
                )}
              </p>
              {verifyOtpMutation?.isError &&
                verifyOtpMutation.error instanceof AxiosError && (
                  <p className='text-red-500 text-sm mt-2'>
                    {verifyOtpMutation.error.response?.data?.message || verifyOtpMutation.error.message}
                  </p>
                )
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;