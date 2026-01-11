import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import { Button } from "../components/ui/Button";
import ProfileModal from "../components/ProfileModal";
import api from "../api/axios";
import {
    User,
    Mail,
    Shield,
    Key,
    Activity,
    Calendar,
    Briefcase,
    Building2,
    Globe,
    Lock,
    LogOut,
    Trash2,
    Share2,
    Edit3,
    CheckCircle2,
    AlertCircle,
    TrendingUp,
    Layout,
    CheckSquare,
    Clock,
} from "lucide-react";

const Profile = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await api.get("/tasks?limit=1000"); // Fetch all tasks to calculate stats
                if (response.data && response.data.tasks) {
                    setTasks(response.data.tasks);
                }
            } catch (error) {
                console.error("Failed to fetch tasks for profile stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    // Calculate real stats
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === "completed").length;
    const pendingTasks = tasks.filter(
        (t) => t.status === "pending" || t.status === "in_progress"
    ).length;

    // Real stats data
    const stats = [
        {
            label: "Total Tasks",
            value: totalTasks,
            icon: Layout,
            color: "text-blue-600",
            bg: "bg-blue-50",
        },
        {
            label: "Completed",
            value: completedTasks,
            icon: CheckSquare,
            color: "text-green-600",
            bg: "bg-green-50",
        },
        {
            label: "Pending",
            value: pendingTasks,
            icon: Clock,
            color: "text-amber-600",
            bg: "bg-amber-50",
        },
    ];

    return (
        <div className="flex min-h-[calc(100vh-4rem)] bg-gray-50/50">
            <Sidebar />

            <main className="flex-1 p-6 lg:p-8 overflow-y-auto h-[calc(100vh-4rem)]">
                <div className="mx-auto max-w-4xl space-y-8">
                    {/* 1. Profile Header Card */}
                    <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100">
                        {/* Thin gradient bar */}
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

                        <div className="p-8">
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                                {/* Avatar */}
                                <div className="relative">
                                    <div className="h-24 w-24 rounded-full p-1 bg-gradient-to-br from-blue-100 to-indigo-100 ring-4 ring-white shadow-lg">
                                        <div className="h-full w-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                                            {/* Use user avatar or fallback */}
                                            <div className="h-full w-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-3xl">
                                                {user?.name?.charAt(0) || "U"}
                                            </div>
                                        </div>
                                    </div>
                                    {/* Online Status */}
                                    <div className="absolute bottom-1 right-1 h-5 w-5 rounded-full bg-white flex items-center justify-center">
                                        <div className="h-3 w-3 rounded-full bg-green-500 ring-2 ring-white animate-pulse" />
                                    </div>
                                </div>

                                {/* User Info */}
                                <div className="flex-1 text-center md:text-left space-y-2 pt-2">
                                    <div className="flex flex-col md:flex-row items-center md:items-baseline gap-3">
                                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                                            {user?.name || "User Name"}
                                        </h1>
                                        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100 uppercase tracking-wide">
                                            User
                                        </span>
                                    </div>

                                    <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-gray-500">
                                        <div className="flex items-center gap-1.5">
                                            <Mail className="h-4 w-4" />
                                            {user?.email || "user@example.com"}
                                        </div>
                                        <div className="hidden md:block w-1 h-1 rounded-full bg-gray-300" />
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="h-4 w-4" />
                                            Member since{" "}
                                            {user?.createdAt
                                                ? new Date(
                                                      user.createdAt
                                                  ).toLocaleDateString()
                                                : "Recently"}
                                        </div>
                                    </div>
                                </div>

                                {/* Header Actions */}
                                <div className="flex items-center gap-3 pt-4 md:pt-2">
                                    <Button
                                        onClick={() => setIsEditModalOpen(true)}
                                        className="gap-2 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20"
                                    >
                                        <Edit3 className="h-4 w-4" />
                                        Edit Profile
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Stats Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div
                                        className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}
                                    >
                                        <stat.icon className="h-5 w-5" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-500">
                                        {stat.label}
                                    </p>
                                    <h3 className="text-2xl font-bold text-gray-900">
                                        {stat.value}
                                    </h3>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 3. Main Content Grid */}
                    <div className="grid grid-cols-1 gap-8">
                        {/* A. Personal Information */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                    <User className="h-4 w-4 text-blue-500" />
                                    Personal Information
                                </h3>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Full Name
                                        </label>
                                        <div className="text-sm font-medium text-gray-900 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                            {user?.name || "User Name"}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email Address
                                        </label>
                                        <div className="text-sm font-medium text-gray-900 p-3 bg-gray-50 rounded-lg border border-gray-100 flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-gray-400" />
                                            {user?.email || "user@example.com"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* B. Account Security */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                    <Shield className="h-4 w-4 text-indigo-500" />
                                    Account Security
                                </h3>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="flex items-center justify-between pt-2">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-gray-900">
                                            Password
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Update your password to keep your
                                            account secure
                                        </p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-2"
                                    >
                                        <Key className="h-4 w-4" />
                                        Change Password
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* C. Danger Zone */}
                        <div className="bg-red-50/50 rounded-xl border border-red-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-red-100 flex items-center justify-between bg-red-50">
                                <h3 className="font-semibold text-red-900 flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4 text-red-600" />
                                    Danger Zone
                                </h3>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                                    <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 hover:border-red-300 transition-all text-sm font-medium shadow-sm">
                                        <Trash2 className="h-4 w-4" />
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <ProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
            />
        </div>
    );
};

export default Profile;
