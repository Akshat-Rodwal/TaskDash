import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MyTasks from "./pages/MyTasks";
import { ToastContainer } from "./components/ui/Toast";

function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="min-h-screen bg-gray-50">
                    <ToastContainer />
                    <Navbar />
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        <Route element={<ProtectedRoute />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/tasks" element={<MyTasks />} />
                        </Route>

                        <Route
                            path="/"
                            element={<Navigate to="/dashboard" replace />}
                        />
                    </Routes>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;
