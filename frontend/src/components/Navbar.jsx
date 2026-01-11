import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/Button";
import {
    LogOut,
    LayoutDashboard,
    User,
    Settings,
    Bell,
    Search,
} from "lucide-react";
import { useState } from "react";
import ProfileModal from "./ProfileModal";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <>
            <nav className="sticky top-0 z-50 border-b border-gray-200/50 bg-white/80 backdrop-blur-md transition-all duration-300">
                <div className="mx-auto flex h-16  items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-8">
                        <Link
                            to="/"
                            className="flex items-center gap-2 text-xl font-bold text-blue-600 transition-opacity hover:opacity-80"
                        >
                            <LayoutDashboard className="h-6 w-6" />
                            <span>TaskDash</span>
                        </Link>

                        {user && (
                            <div className="hidden md:flex items-center relative">
                                <Search className="absolute left-3 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="h-9 w-64 rounded-full border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                <button className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100 transition-colors">
                                    <Bell className="h-5 w-5" />
                                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border-2 border-white"></span>
                                </button>

                                <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>

                                <div className="hidden items-center gap-3 text-sm sm:flex">
                                    <div className="flex flex-col items-end">
                                        <span className="font-medium text-gray-700">
                                            {user.name}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            Admin
                                        </span>
                                    </div>
                                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                </div>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsProfileOpen(true)}
                                    className="text-gray-500 hover:text-blue-600"
                                >
                                    <Settings className="h-5 w-5" />
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleLogout}
                                    className="text-gray-500 hover:text-red-600"
                                >
                                    <LogOut className="h-5 w-5" />
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link to="/login">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="font-medium"
                                    >
                                        Login
                                    </Button>
                                </Link>
                                <Link to="/register">
                                    <Button
                                        size="sm"
                                        className="bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20"
                                    >
                                        Register
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>
            <ProfileModal
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
            />
        </>
    );
};

export default Navbar;
