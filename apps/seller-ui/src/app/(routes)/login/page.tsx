"use client";

import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import "../../../../../user-ui/src/public/Login.css";
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

type FormData = {
    email: string;
    password: string;
};

const Login = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [rememberMe, setRememberMe] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>();

    const loginMutation = useMutation({
        mutationFn: async (data: FormData) => {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_SERVER_URI}/api/login-seller`,
                data,
                { withCredentials: true }
            );
            return response.data;
        },
        onSuccess: (data) => {
            setServerError(null);
            router.push("/");
        },
        onError: (error: AxiosError) => {
            const errorMessage =
                (error.response?.data as { message?: string })?.message || "Invalid credentials!"
            setServerError(errorMessage);
        },
    });

    const onSubmit = (data: FormData) => {
        loginMutation.mutate(data);
    };

    return (
        <div className="w-full py-10 min-h-screen bg-[#f1f1f1]">
            <h1 className="login-title">Login</h1>
            <p className="login-breadcrumb">Home . Login</p>

            <div className="login-container">
                <div className="login-card">
                    <h3 className="login-heading">Login to Eshop</h3>
                    <p className="login-subheading">
                        Don't have an account?{" "}
                        <Link href="/signup" className="signup-link">
                            Sign Up
                        </Link>
                    </p>

                    <div className="divider">
                        <div className="line" />
                        <span className="divider-text">or sign in with Email</span>
                        <div className="line" />
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
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

                        <div className="remember-wrapper">
                            <label className="remember-label">
                                <input
                                    type="checkbox"
                                    className="checkbox"
                                    checked={rememberMe}
                                    onChange={() => setRememberMe(!rememberMe)}
                                />
                                Remember me
                            </label>
                            <Link href="/forgot-password" className="forgot-password-link">
                                Forgot Password?
                            </Link>
                        </div>
                        <button
                            type="submit"
                            disabled={loginMutation.isPending}
                            className="submit-btn">
                            {loginMutation?.isPending ? "Loggin in..." : "Login"}
                        </button>

                        {serverError && (
                            <p className='text-red-500 text-sm mt-2'>{serverError}</p>
                        )}

                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;