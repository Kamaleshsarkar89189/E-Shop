"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react';
import { useForm } from "react-hook-form";
// import "../../../public/Login.css";
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import toast from "react-hot-toast";

type FormData = {
    email: string;
    password: string;
};

const ForgotPassword = () => {
    const [step, setStep] = useState<"email" | "otp" | "reset">("email");
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [userEmail, setUserEmail] = useState<string | null>(null)
    const [canResend, setCanResend] = useState(true)
    const [timer, setTimer] = useState(60);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [serverError, setServerError] = useState<string | null>(null);
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

    const requestOtpMutation = useMutation({
        mutationFn: async ({ email }: { email: string }) => {
            console.log("Requesting OTP for email:", email);
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_SERVER_URI}/api/forgot-password-seller`,
                { email }
            );
            return response.data;
        },
        onSuccess: (data, { email }) => {
            console.log("OTP request successful:", data);
            setUserEmail(email);
            setStep("otp");
            setServerError(null);
            setCanResend(false);
            startResendTimer();
        },
        onError: (error: AxiosError) => {
            console.error("OTP request error:", error);
            const errorMessage =
                (error.response?.data as { message?: string })?.message || "Failed to send OTP. Try again!";
            setServerError(errorMessage);
        },
    });

    const verifyOtpMutation = useMutation({
        mutationFn: async () => {
            const otpString = otp.join("");
            console.log("Verifying OTP:", { email: userEmail, otp: otpString });
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_SERVER_URI}/api/verify-forgot-password-seller`,
                { email: userEmail, otp: otpString }
            );
            return response.data;
        },
        onSuccess: (data) => {
            console.log("OTP verification successful:", data);
            setStep("reset");
            setServerError(null);
        },
        onError: (error: AxiosError) => {
            console.error("OTP verification error:", error);
            const errorMessage = (error.response?.data as { message?: string })?.message;
            setServerError(errorMessage || "Invalid OTP. Try again!");
        },
    });

    const resetPasswordMutation = useMutation({
        mutationFn: async ({ password }: { password: string }) => {
            if (!password) return;
            console.log("Resetting password for email:", userEmail);
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_SERVER_URI}/api/reset-password-seller`,
                { email: userEmail, newPassword: password }
            )
            return response.data;
        },
        onSuccess: (data) => {
            console.log("Password reset successful:", data);
            setStep("email");
            toast.success(
                "Password reset successfully! Please login with your new password."
            );
            setServerError(null);
            router.push("/login");
        },
        onError: (error: AxiosError) => {
            console.error("Password reset error:", error);
            const errorMessage = (error.response?.data as { message?: string })?.message;
            setServerError(errorMessage || "Failed to reset password. Try again!");
        },
    });

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

    const onSubmitEmail = ({ email }: { email: string }) => {
        requestOtpMutation.mutate({ email });
    };

    const onSubmitPassword = ({ password }: { password: string }) => {
        resetPasswordMutation.mutate({ password });
    };

    return (
        // <div className="container">
        <div className="w-full py-10 min-h-[85vh] bg-gray-100 font-sans">
            <h1 className="heading">Forgot Password</h1>
            {/* <h1 className="text-4xl font-semibold text-black text-center">Forgot Password</h1> */}
            <p className="subheading">Home . Forgot Password</p>
            {/* <p className="text-center text-lg font-medium py-3 text-gray-600">Home . Forgot Password</p> */}

            <div className="flex justify-center">
                <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
                    {step === "email" && (
                        <>
                            <h3 className="login-heading">Forgot password</h3>
                            <p className="login-subheading">
                                Go back to login?{" "}
                                <Link href="/login" className="signup-link">
                                    Login
                                </Link>
                            </p>

                            <form onSubmit={handleSubmit(onSubmitEmail)}>
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

                                <button
                                    type="submit"
                                    disabled={requestOtpMutation.isPending}
                                    className="submit-btn mt-4">
                                    {requestOtpMutation?.isPending ? "Sending OTP..." : "Submit"}
                                </button>

                                {serverError && (
                                    <p className='server-error'>{serverError}</p>
                                    // <p className='text-red-500 text-sm mt-2'>{serverError}</p>
                                )}







                            </form>
                        </>
                    )}

                    {step === "otp" && (
                        <>
                            <h3 className='otp-heading'>
                                Enter OTP
                            </h3>
                            {/* <h3 className='text-xl font-semibold text-center mb-4'>
                                Enter OTP
                            </h3> */}
                            <div className="flex justify-center gap-6 mb-4">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => {
                                            if (el) inputRefs.current[index] = el;
                                        }}
                                        type="text"
                                        maxLength={1}
                                        className="w-12 h-12 text-center border border-gray-300 outline-none rounded text-lg font-semibold"
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                        placeholder="0"
                                    />
                                ))}
                            </div>
                            <button
                                onClick={() => verifyOtpMutation.mutate()}
                                className='w-full mt-4 text-lg cursor-pointer bg-black textwhite p-3 rounded disabled:opacity-50 disabled:cursor-not-allowed'
                                disabled={verifyOtpMutation.isPending || otp.some(digit => digit === "")}
                            >
                                {verifyOtpMutation.isPending ? "Verifying..." : "Verify OTP"}
                            </button>

                            {canResend ? (
                                <button
                                    // onClick={() => requestOtpMutation.mutate({ email: userEmail! })}
                                    // className='text-blue text-center mt-4 cursor-pointer'
                                    onClick={() => {
                                        setTimer(60);
                                        setCanResend(false);
                                        requestOtpMutation.mutate({ email: userEmail! });
                                        startResendTimer();
                                    }}
                                >
                                    Resend OTP
                                </button>
                            ) : (
                                <p className='textcenter text-sm mt-4'>
                                    Resend OTP in {timer}s
                                </p>
                            )}

                            {serverError && (
                                <p className='text-red textsm mt-2'>{serverError}</p>
                            )}
                        </>
                    )}

                    {step === "reset" && (
                        <>
                            <h3 className='textxl fontsemibold textcenter mb-4'>
                                Reset Password
                            </h3>
                            <form onSubmit={handleSubmit(onSubmitPassword)}>
                                <label className="block text-gray mb-1">New Password</label>
                                <input
                                    type="password"
                                    placeholder="Enter new password"
                                    className="w-full p-2 border border-gray-300 outline-0 rounded mb-2"
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: {
                                            value: 6,
                                            message: "Password must be at least 6 characters",
                                        },
                                    })}
                                />
                                {errors.password && (
                                    <p className='text-red textsm'>
                                        {String(errors.password.message)}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    className="w-full mt-4 textlg cursor-pointer bg-black textwhite p-3 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={resetPasswordMutation.isPending}
                                >
                                    {resetPasswordMutation.isPending ? "Resetting..." : "Reset Password"}
                                </button>

                                {serverError && (
                                    <p className="text-red text-sm mt-2">{serverError}</p>
                                )}

                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;