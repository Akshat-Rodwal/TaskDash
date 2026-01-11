import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { LayoutDashboard } from "lucide-react";
import { cn } from "../utils/cn";

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            await login(data.email, data.password);
            if (rememberMe) {
                localStorage.setItem("rememberMe", "true");
            }
            navigate("/dashboard");
        } catch (err) {
            const message = err.response?.data?.message || "Login failed";
            console.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSocialLogin = (provider) => {
        console.log(`Logging in with ${provider}`);
        // Implement social login logic here
    };

    return (
        <div className="flex min-h-screen bg-white">
            {/* Left Side - Branding (visible on medium screens and up) */}
            <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 to-blue-400 p-12 items-center justify-center relative overflow-hidden">
                {/* Abstract pattern overlay */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full opacity-20"></div>
                    <div className="absolute bottom-32 right-32 w-24 h-24 bg-white rounded-full opacity-15"></div>
                    <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white rounded-full opacity-25"></div>
                </div>

                <div className="relative z-10 text-center text-white max-w-md">
                    {/* Logo placeholder */}
                    <div className="mb-8">
                        <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <LayoutDashboard className="h-10 w-10 text-blue-600" />
                        </div>
                        <h1
                            className="text-4xl font-bold mb-4"
                            style={{ fontFamily: "Inter, sans-serif" }}
                        >
                            TaskDash
                        </h1>
                        <p
                            className="text-lg opacity-90 mb-8"
                            style={{ fontFamily: "Inter, sans-serif" }}
                        >
                            Streamline your workflow with intelligent task
                            management
                        </p>
                    </div>

                    {/* Team avatars placeholder */}
                    <div className="flex justify-center -space-x-4 mb-6">
                        <img
                            src="https://i.pravatar.cc/150?u=1"
                            alt="Team Member 1"
                            className="w-10 h-10 rounded-full border-2 border-white object-cover"
                        />
                        <img
                            src="https://i.pravatar.cc/150?u=2"
                            alt="Team Member 2"
                            className="w-10 h-10 rounded-full border-2 border-white object-cover"
                        />
                        <img
                            src="https://i.pravatar.cc/150?u=3"
                            alt="Team Member 3"
                            className="w-10 h-10 rounded-full border-2 border-white object-cover"
                        />
                        <img
                            src="https://i.pravatar.cc/150?u=4"
                            alt="Team Member 4"
                            className="w-10 h-10 rounded-full border-2 border-white object-cover"
                        />
                    </div>

                    <p
                        className="text-sm opacity-75"
                        style={{ fontFamily: "Inter, sans-serif" }}
                    >
                        Join thousands of teams already using TaskDash
                    </p>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-gray-50">
                <div className="w-full max-w-[500px] mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 w-full">
                        <div className="text-center mb-8">
                            <h2
                                className="text-4xl font-bold text-gray-900 mb-2"
                                style={{ fontFamily: "Inter, sans-serif" }}
                            >
                                Welcome back
                            </h2>
                            <p
                                className="text-lg text-gray-600"
                                style={{ fontFamily: "Inter, sans-serif" }}
                            >
                                Sign in to your account to continue
                            </p>
                        </div>

                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                    style={{ fontFamily: "Inter, sans-serif" }}
                                >
                                    Email address
                                </label>
                                <div className="relative">
                                    <input
                                        id="email"
                                        type="email"
                                        {...register("email")}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="you@example.com"
                                        style={{
                                            fontFamily: "Inter, sans-serif",
                                        }}
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg
                                            className="h-5 w-5 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                                            />
                                        </svg>
                                    </div>
                                </div>
                                {errors.email && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                    style={{ fontFamily: "Inter, sans-serif" }}
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        {...register("password")}
                                        className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="••••••••"
                                        style={{
                                            fontFamily: "Inter, sans-serif",
                                        }}
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg
                                            className="h-5 w-5 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                            />
                                        </svg>
                                    </div>
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                    >
                                        <svg
                                            className="h-5 w-5 text-gray-400 hover:text-gray-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            {showPassword ? (
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 001.243-.389m-4.565-4.565a3 3 0 00-1.243.389m7.434 7.434L15 12m-6 6v.01M12 15v.01M12 12v.01M12 9v.01M6 12v.01M18 12v.01M15 12v.01"
                                                />
                                            ) : (
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                />
                                            )}
                                        </svg>
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) =>
                                            setRememberMe(e.target.checked)
                                        }
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label
                                        htmlFor="remember-me"
                                        className="ml-2 block text-sm text-gray-700"
                                        style={{
                                            fontFamily: "Inter, sans-serif",
                                        }}
                                    >
                                        Remember me
                                    </label>
                                </div>
                                <div className="text-sm">
                                    <a
                                        href="#"
                                        className="font-medium text-blue-600 hover:text-blue-500"
                                        style={{
                                            fontFamily: "Inter, sans-serif",
                                        }}
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-4 px-6 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    style={{ fontFamily: "Inter, sans-serif" }}
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center justify-center space-x-2">
                                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                            <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-100"></div>
                                            <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-200"></div>
                                        </div>
                                    ) : (
                                        "Sign in"
                                    )}
                                </button>
                            </div>
                        </form>

                        <div className="mt-8">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span
                                        className="px-2 bg-white text-gray-500"
                                        style={{
                                            fontFamily: "Inter, sans-serif",
                                        }}
                                    >
                                        Or continue with
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => handleSocialLogin("google")}
                                    className="w-full inline-flex justify-center py-3 px-4 rounded-full shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                    style={{ fontFamily: "Inter, sans-serif" }}
                                >
                                    <svg
                                        className="w-5 h-5"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            fill="#4285F4"
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        />
                                        <path
                                            fill="#34A853"
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        />
                                        <path
                                            fill="#FBBC05"
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        />
                                        <path
                                            fill="#EA4335"
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        />
                                    </svg>
                                    <span className="ml-3">Google</span>
                                </button>

                                <button
                                    onClick={() => handleSocialLogin("github")}
                                    className="w-full inline-flex justify-center py-3 px-4 rounded-full shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                    style={{ fontFamily: "Inter, sans-serif" }}
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <span className="ml-3">GitHub</span>
                                </button>
                            </div>
                        </div>

                        <div className="text-center text-sm mt-6">
                            <span
                                className="text-gray-500"
                                style={{ fontFamily: "Inter, sans-serif" }}
                            >
                                Don't have an account?{" "}
                            </span>
                            <Link
                                to="/register"
                                className="font-medium text-blue-600 hover:text-blue-500"
                                style={{ fontFamily: "Inter, sans-serif" }}
                            >
                                Register here
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
