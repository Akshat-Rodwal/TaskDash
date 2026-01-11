import {
    LayoutDashboard,
    FolderKanban,
    CheckSquare,
    Settings,
    Users,
    User,
    PieChart,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
    const location = useLocation();

    const navItems = [
        { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
        // { icon: FolderKanban, label: "Projects", path: "/projects" },
        { icon: CheckSquare, label: "My Tasks", path: "/tasks" },
        { icon: User, label: "Profile", path: "/profile" },
        // { icon: Users, label: "Team", path: "/team" },
        // { icon: PieChart, label: "Analytics", path: "/analytics" },
    ];

    return (
        <aside className="hidden lg:flex flex-col w-64 h-[calc(100vh-4rem)] sticky top-16 border-r border-gray-200/50 bg-white/50 backdrop-blur-sm p-4">
            <div className="space-y-1">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                isActive
                                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            }`}
                        >
                            <item.icon
                                className={`h-5 w-5 ${
                                    isActive ? "text-white" : "text-gray-400"
                                }`}
                            />
                            {item.label}
                        </Link>
                    );
                })}
            </div>

            <div className="mt-auto pt-4 border-t border-gray-100">
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
                    <h4 className="text-sm font-semibold text-blue-900">
                        Pro Plan
                    </h4>
                    <p className="text-xs text-blue-600 mt-1 mb-3">
                        Get access to all features
                    </p>
                    <button className="w-full py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                        Upgrade Now
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
