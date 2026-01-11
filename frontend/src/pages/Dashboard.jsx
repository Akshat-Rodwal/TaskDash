import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "../api/axios";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import {
    Trash2,
    Edit2,
    Plus,
    X,
    CheckCircle,
    Clock,
    CircleDashed,
    Search,
    Filter,
    MoreVertical,
    Calendar,
    BarChart3,
    CheckSquare,
    AlertCircle,
    LayoutDashboard,
    Paperclip,
    User,
    ArrowRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import { toast } from "../components/ui/Toast";

const taskSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    status: z.enum(["pending", "in_progress", "completed"]),
});

const Dashboard = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            status: "pending",
        },
    });

    const fetchTasks = async () => {
        setIsLoading(true);
        try {
            const response = await api.get(`/tasks?page=${page}&limit=6`);
            setTasks(response.data.tasks);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            toast.error("Failed to load tasks");
            console.error("Error fetching tasks:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [page]);

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            if (editingTask) {
                const response = await api.put(
                    `/tasks/${editingTask._id}`,
                    data
                );
                setTasks(
                    tasks.map((t) =>
                        t._id === editingTask._id ? response.data : t
                    )
                );
                toast.success("Task updated successfully");
            } else {
                await api.post("/tasks", data);
                fetchTasks(); // Refetch to handle pagination correctly
                toast.success("Task created successfully");
            }
            closeModal();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to save task");
            console.error("Error saving task:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            try {
                await api.delete(`/tasks/${id}`);
                setTasks(tasks.filter((t) => t._id !== id));
                toast.success("Task deleted successfully");
            } catch (error) {
                toast.error("Failed to delete task");
                console.error("Error deleting task:", error);
            }
        }
    };

    const openModal = (task = null) => {
        if (task) {
            setEditingTask(task);
            setValue("title", task.title);
            setValue("description", task.description);
            setValue("status", task.status);
        } else {
            setEditingTask(null);
            reset({ title: "", description: "", status: "pending" });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingTask(null);
        reset();
    };

    const filteredTasks = tasks
        .filter((task) => {
            if (filter === "all") return true;
            return task.status === filter;
        })
        .filter(
            (task) =>
                task.title.toLowerCase().includes(search.toLowerCase()) ||
                task.description.toLowerCase().includes(search.toLowerCase())
        );

    const getStatusIcon = (status) => {
        switch (status) {
            case "completed":
                return <CheckCircle className="h-4 w-4" />;
            case "in_progress":
                return <Clock className="h-4 w-4" />;
            default:
                return <CircleDashed className="h-4 w-4" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "completed":
                return "bg-green-100 text-green-700 border-green-200";
            case "in_progress":
                return "bg-blue-100 text-blue-700 border-blue-200";
            default:
                return "bg-amber-100 text-amber-700 border-amber-200";
        }
    };

    // Calculate stats based on current view (or you could fetch real stats)
    const stats = [
        {
            label: "Total Tasks",
            value: tasks.length,
            icon: BarChart3,
            color: "text-blue-600",
            bg: "bg-blue-50",
        },
        {
            label: "Pending",
            value: tasks.filter((t) => t.status === "pending").length,
            icon: CircleDashed,
            color: "text-amber-600",
            bg: "bg-amber-50",
        },
        {
            label: "In Progress",
            value: tasks.filter((t) => t.status === "in_progress").length,
            icon: Clock,
            color: "text-blue-600",
            bg: "bg-blue-50",
        },
        {
            label: "Completed",
            value: tasks.filter((t) => t.status === "completed").length,
            icon: CheckCircle,
            color: "text-green-600",
            bg: "bg-green-50",
        },
    ];

    return (
        <div className="flex min-h-[calc(100vh-4rem)] bg-gray-50/50">
            <Sidebar />

            <main className="flex-1 p-6 lg:p-8 overflow-y-auto h-[calc(100vh-4rem)]">
                <div className="mx-auto max-w-6xl">
                    {/* Header Section */}
                    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                                Welcome back, {user?.name} 👋
                            </h1>
                            <p className="text-gray-500 mt-1">
                                Here's what's happening with your tasks today.
                            </p>
                        </div>
                        <Button
                            onClick={() => openModal()}
                            className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02]"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            New Task
                        </Button>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 group"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div
                                        className={`p-2 rounded-lg ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}
                                    >
                                        <stat.icon className="h-5 w-5" />
                                    </div>
                                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                                        +2.5%
                                    </span>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                                    {stat.value}
                                </h3>
                                <p className="text-sm text-gray-500 font-medium">
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Filters & Search */}
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
                        <div className="relative w-full sm:max-w-xs">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                            />
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                                <Filter className="h-4 w-4 text-gray-500" />
                                <select
                                    className="bg-transparent text-sm text-gray-700 outline-none cursor-pointer"
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                >
                                    <option value="all">All Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="in_progress">
                                        In Progress
                                    </option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>

                            <div className="flex border border-gray-200 rounded-lg p-1 bg-gray-50">
                                <button className="p-1.5 rounded bg-white shadow-sm text-gray-700">
                                    <LayoutDashboard className="h-4 w-4" />
                                </button>
                                <button className="p-1.5 rounded text-gray-400 hover:text-gray-700">
                                    <CheckSquare className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Task Grid */}
                    {isLoading ? (
                        <div className="flex justify-center py-20">
                            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                        </div>
                    ) : filteredTasks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
                            <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <CheckSquare className="h-8 w-8 text-gray-300" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">
                                No tasks found
                            </h3>
                            <p className="text-gray-500 text-sm mb-4">
                                Get started by creating your first task
                            </p>
                            <Button
                                onClick={() => openModal()}
                                variant="outline"
                                size="sm"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Create Task
                            </Button>
                        </div>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredTasks.map((task) => (
                                <div
                                    key={task._id}
                                    className="group flex flex-col rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-blue-100"
                                >
                                    <div className="mb-4 flex items-start justify-between">
                                        <div
                                            className={`flex items-center gap-2 px-2.5 py-1 rounded-full border text-xs font-medium ${getStatusColor(
                                                task.status
                                            )}`}
                                        >
                                            {getStatusIcon(task.status)}
                                            <span className="capitalize">
                                                {task.status.replace("_", " ")}
                                            </span>
                                        </div>
                                        <div className="relative opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600">
                                                <MoreVertical className="h-4 w-4" />
                                            </button>
                                            {/* Actions dropdown could go here, for now using direct buttons */}
                                        </div>
                                    </div>

                                    <h3 className="mb-2 text-lg font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
                                        {task.title}
                                    </h3>
                                    <p className="flex-1 text-sm text-gray-500 line-clamp-3 leading-relaxed">
                                        {task.description}
                                    </p>

                                    <div className="mt-5 pt-4 border-t border-gray-50 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                                            <Calendar className="h-3.5 w-3.5" />
                                            {new Date(
                                                task.updatedAt
                                            ).toLocaleDateString()}
                                        </div>

                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-200">
                                            <button
                                                onClick={() => openModal(task)}
                                                className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(task._id)
                                                }
                                                className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* MODAL */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 transition-all duration-300">
                        <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl transform transition-all scale-100 overflow-hidden ring-1 ring-black/5">
                            {/* Header */}
                            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white">
                                <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                                    {editingTask
                                        ? "Edit Task"
                                        : "Create New Task"}
                                </h2>
                                <button
                                    onClick={closeModal}
                                    className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all duration-200"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="flex flex-col"
                            >
                                {/* Body */}
                                <div className="p-6 space-y-6">
                                    {/* Task Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Task Name
                                        </label>
                                        <Input
                                            {...register("title")}
                                            className="w-full h-11 rounded-xl border-gray-200 bg-gray-50/50 text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all placeholder:text-gray-400"
                                            placeholder="e.g., Design System Update"
                                        />
                                        {errors.title && (
                                            <p className="mt-1.5 flex items-center text-xs text-red-600 font-medium">
                                                <AlertCircle className="h-3 w-3 mr-1" />
                                                {errors.title.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Status */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Status
                                        </label>
                                        <div className="relative">
                                            <select
                                                {...register("status")}
                                                className="block w-full appearance-none rounded-full border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-700 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer hover:bg-gray-50"
                                            >
                                                <option value="pending">
                                                    Pending
                                                </option>
                                                <option value="in_progress">
                                                    In Progress
                                                </option>
                                                <option value="completed">
                                                    Completed
                                                </option>
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                                <svg
                                                    className="h-4 w-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M19 9l-7 7-7-7"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            {...register("description")}
                                            rows={4}
                                            className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 p-4 text-sm text-gray-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all resize-none placeholder:text-gray-400"
                                            placeholder="Add task details, links, or context..."
                                        />
                                        {errors.description && (
                                            <p className="mt-1.5 flex items-center text-xs text-red-600 font-medium">
                                                <AlertCircle className="h-3 w-3 mr-1" />
                                                {errors.description.message}
                                            </p>
                                        )}
                                    </div>

                                   
                                </div>

                                {/* Footer */}
                                <div className="px-6 py-5 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        disabled={isSubmitting}
                                        className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors px-2"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                                    >
                                        {isSubmitting
                                            ? "Saving..."
                                            : "Save Task"}
                                        {!isSubmitting && (
                                            <ArrowRight className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
