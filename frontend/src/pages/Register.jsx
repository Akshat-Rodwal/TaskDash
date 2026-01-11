import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { toast } from "../components/ui/Toast";
import {
    LayoutDashboard,
    Eye,
    EyeOff,
    Github,
    CheckCircle,
    Clock,
    CircleDashed,
} from "lucide-react";

// Google Icon Component since it's not in Lucide
const GoogleIcon = ({ className }) => (
    <svg
        className={className}
        viewBox="0 0 24 24"
        width="24"
        height="24"
        xmlns="http://www.w3.org/2000/svg"
    >
        <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
            <path
                fill="#4285F4"
                d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
            />
            <path
                fill="#34A853"
                d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
            />
            <path
                fill="#FBBC05"
                d="M -21.484 53.529 C -21.734 52.769 -21.864 51.959 -21.864 51.129 C -21.864 50.299 -21.734 49.489 -21.484 48.729 L -21.484 45.639 L -25.464 45.639 C -26.274 47.249 -26.734 49.069 -26.734 51.129 C -26.734 53.189 -26.274 55.009 -25.464 56.619 L -21.484 53.529 Z"
            />
            <path
                fill="#EA4335"
                d="M -14.754 43.749 C -12.984 43.749 -11.404 44.359 -10.154 45.549 L -6.744 42.139 C -8.804 40.219 -11.514 39.009 -14.754 39.009 C -19.444 39.009 -23.494 41.709 -25.464 45.639 L -21.484 48.729 C -20.534 45.879 -17.884 43.749 -14.754 43.749 Z"
            />
        </g>
    </svg>
);

const registerSchema = z
    .object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.string().email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string(),
        terms: z.literal(true, {
            errorMap: () => ({
                message: "You must accept the terms and conditions",
            }),
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

const Register = () => {
    const { register: registerUser } = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            terms: false,
        },
    });

    const password = watch("password", "");

    const onSubmit = async (data) => {
        try {
            // Only send necessary fields to backend
            await registerUser(data.name, data.email, data.password);
            toast.success("Registration successful!");
            navigate("/dashboard");
        } catch (err) {
            const message =
                err.response?.data?.message || "Registration failed";
            toast.error(message);
        }
    };

    const getStrengthColor = (length) => {
        if (length === 0) return "bg-gray-200";
        if (length < 6) return "bg-red-500";
        if (length < 10) return "bg-yellow-500";
        return "bg-green-500";
    };

    return (
        <div className="flex min-h-screen bg-white">
            {/* Left Section - Hero (Desktop Only) */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-blue-600 overflow-hidden flex-col justify-between p-12 text-white">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-900 opacity-90" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

                {/* Decorative circles */}
                <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400 rounded-full blur-3xl opacity-30" />
                <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-indigo-400 rounded-full blur-3xl opacity-30" />

                <div className="relative z-10">
                    <div className="flex items-center gap-2 text-2xl font-bold">
                        <LayoutDashboard className="h-8 w-8" />
                        <span>TaskDash</span>
                    </div>
                </div>

                <div className="relative z-10 max-w-xl">
                    <h1 className="text-5xl font-bold leading-tight mb-6">
                        Turn your ideas into reality
                    </h1>
                    <p className="text-lg text-blue-100 mb-8">
                        Join thousands of developers and designers who use
                        TaskDash to manage their projects and boost
                        productivity.
                    </p>

                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-4">
                            {[1, 2, 3, 4].map((i) => (
                                <img
                                    key={i}
                                    className="w-10 h-10 rounded-full border-2 border-white"
                                    src={`https://i.pravatar.cc/150?u=${
                                        i + 10
                                    }`}
                                    alt={`User ${i}`}
                                />
                            ))}
                        </div>
                        <div className="text-sm font-medium">
                            <span className="block text-yellow-400">★★★★★</span>
                            <span>Trusted by 10k+ users</span>
                        </div>
                    </div>
                </div>

                <div className="relative z-10">
                    {/* Dashboard Preview Placeholder */}
                    <div className="bg-white/10 backdrop-blur-md rounded-t-xl border border-white/20 shadow-2xl translate-y-12 overflow-hidden">
                        {/* Window Header */}
                        <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/10">
                            <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                            <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                        </div>

                        {/* Window Content */}
                        <div className="flex h-64">
                            {/* Sidebar */}
                            <div className="w-16 border-r border-white/10 flex flex-col items-center py-4 gap-4 bg-white/5">
                                <div className="p-2 rounded-lg bg-blue-500/20">
                                    <LayoutDashboard className="h-5 w-5 text-blue-200" />
                                </div>
                                <div className="w-8 h-1 rounded bg-white/10" />
                                <div className="w-8 h-1 rounded bg-white/10" />
                                <div className="w-8 h-1 rounded bg-white/10" />
                            </div>

                            {/* Main Content */}
                            <div className="flex-1 p-4">
                                {/* Dashboard Header */}
                                <div className="flex justify-between items-center mb-4">
                                    <div className="h-4 w-24 bg-white/20 rounded" />
                                    <div className="h-6 w-20 bg-blue-500 rounded text-[10px] flex items-center justify-center font-medium">
                                        New Task
                                    </div>
                                </div>

                                {/* Task Grid */}
                                <div className="grid grid-cols-2 gap-3">
                                    {/* Task Card 1 */}
                                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="h-3 w-16 bg-white/20 rounded" />
                                            <Clock className="h-3 w-3 text-yellow-400" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="h-2 w-full bg-white/10 rounded" />
                                            <div className="h-2 w-2/3 bg-white/10 rounded" />
                                        </div>
                                    </div>

                                    {/* Task Card 2 */}
                                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="h-3 w-16 bg-white/20 rounded" />
                                            <CheckCircle className="h-3 w-3 text-green-400" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="h-2 w-full bg-white/10 rounded" />
                                            <div className="h-2 w-2/3 bg-white/10 rounded" />
                                        </div>
                                    </div>

                                    {/* Task Card 3 */}
                                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="h-3 w-16 bg-white/20 rounded" />
                                            <CircleDashed className="h-3 w-3 text-gray-400" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="h-2 w-full bg-white/10 rounded" />
                                            <div className="h-2 w-2/3 bg-white/10 rounded" />
                                        </div>
                                    </div>

                                    {/* Task Card 4 */}
                                    <div className="p-3 rounded-lg bg-white/5 border border-white/10 opacity-50">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="h-3 w-16 bg-white/20 rounded" />
                                            <div className="h-3 w-3 rounded-full bg-white/10" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="h-2 w-full bg-white/10 rounded" />
                                            <div className="h-2 w-2/3 bg-white/10 rounded" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Section - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
                <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">
                            Get started for free
                        </h2>
                        <p className="mt-2 text-gray-600">
                            Free forever. No credit card needed.
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-5"
                    >
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">
                                Full Name
                            </label>
                            <Input
                                type="text"
                                {...register("name")}
                                placeholder="John Doe"
                                className={
                                    errors.name
                                        ? "border-red-500 focus:ring-red-500"
                                        : ""
                                }
                            />
                            {errors.name && (
                                <p className="text-xs text-red-500">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <Input
                                type="email"
                                {...register("email")}
                                placeholder="you@company.com"
                                className={
                                    errors.email
                                        ? "border-red-500 focus:ring-red-500"
                                        : ""
                                }
                            />
                            {errors.email && (
                                <p className="text-xs text-red-500">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    {...register("password")}
                                    placeholder="••••••••"
                                    className={
                                        errors.password
                                            ? "border-red-500 focus:ring-red-500 pr-10"
                                            : "pr-10"
                                    }
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-xs text-red-500">
                                    {errors.password.message}
                                </p>
                            )}

                            {/* Password Strength Indicator */}
                            <div className="flex gap-1 mt-2 h-1">
                                <div
                                    className={`flex-1 rounded-full transition-colors ${getStrengthColor(
                                        password.length
                                    )}`}
                                />
                                <div
                                    className={`flex-1 rounded-full transition-colors ${
                                        password.length > 6
                                            ? getStrengthColor(password.length)
                                            : "bg-gray-200"
                                    }`}
                                />
                                <div
                                    className={`flex-1 rounded-full transition-colors ${
                                        password.length >= 10
                                            ? getStrengthColor(password.length)
                                            : "bg-gray-200"
                                    }`}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Input
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    {...register("confirmPassword")}
                                    placeholder="••••••••"
                                    className={
                                        errors.confirmPassword
                                            ? "border-red-500 focus:ring-red-500 pr-10"
                                            : "pr-10"
                                    }
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-xs text-red-500">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>

                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="terms"
                                    type="checkbox"
                                    {...register("terms")}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label
                                    htmlFor="terms"
                                    className="font-medium text-gray-700"
                                >
                                    I agree to the{" "}
                                    <a
                                        href="#"
                                        className="text-blue-600 hover:text-blue-500"
                                    >
                                        Terms of Service
                                    </a>{" "}
                                    and{" "}
                                    <a
                                        href="#"
                                        className="text-blue-600 hover:text-blue-500"
                                    >
                                        Privacy Policy
                                    </a>
                                </label>
                                {errors.terms && (
                                    <p className="text-xs text-red-500 mt-1">
                                        {errors.terms.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30"
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? "Creating account..."
                                : "Create Account"}
                        </Button>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-white px-2 text-gray-500">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                variant="outline"
                                type="button"
                                className="w-full gap-2"
                            >
                                <GoogleIcon className="w-5 h-5" />
                                <span className="text-gray-700">Google</span>
                            </Button>
                            <Button
                                variant="outline"
                                type="button"
                                className="w-full gap-2"
                            >
                                <Github className="w-5 h-5" />
                                <span className="text-gray-700">GitHub</span>
                            </Button>
                        </div>
                    </form>

                    <div className="mt-8 text-center text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
                        >
                            Log in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
