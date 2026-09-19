import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Profile from "./pages/Profile";
import Home from "./pages/Home";
import Resume from "./pages/Resume";
import StudentDashboard from "./pages/StudentDashboard";
import Recommendations from "./pages/Recommendations";
import Applications from "./pages/Applications";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Skills from "./pages/Skills";
import AddInternship from "./pages/AddInternship";
import AdminApplicationDetails from "./pages/AdminApplicationDetails";
import AdminInternships from "./pages/AdminInternships";
import EditInternship from "./pages/EditInternship";

const PrivateRoute = ({ children }) => {

    const token = localStorage.getItem("token");

    return token ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {

    const token = localStorage.getItem("token");

    return !token ? children : <Navigate to="/dashboard" />;
};

const AdminPrivateRoute = ({ children }) => {

    const adminToken = localStorage.getItem("adminToken");

    return adminToken ? children : <Navigate to="/admin" />;
};

const AdminPublicRoute = ({ children }) => {

    const adminToken = localStorage.getItem("adminToken");

    return !adminToken ? children : <Navigate to="/admin-dashboard" />;
};

function App() {

    return (
        <BrowserRouter>

            <Routes>

                {/* Public Routes */}

                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    }
                />

                <Route
                    path="/register"
                    element={
                        <PublicRoute>
                            <Register />
                        </PublicRoute>
                    }
                />


                {/* Student Routes */}

                <Route
                    path="/"
                    element={
                        <PublicRoute>
                            <Home />
                        </PublicRoute>
                    }
                />

                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <StudentDashboard />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/profile"
                    element={
                        <PrivateRoute>
                            <Profile />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/resume"
                    element={
                        <PrivateRoute>
                            <Resume />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/skills"
                    element={
                        <PrivateRoute>
                            <Skills />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/recommendations"
                    element={
                        <PrivateRoute>
                            <Recommendations />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/applications"
                    element={
                        <PrivateRoute>
                            <Applications />
                        </PrivateRoute>
                    }
                />


                {/* Admin Routes */}

                <Route
                    path="/admin"
                    element={
                        <AdminPublicRoute>
                            <AdminLogin />
                        </AdminPublicRoute>
                    }
                />

                <Route
                    path="/admin-dashboard"
                    element={
                        <AdminPrivateRoute>
                            <AdminDashboard />
                        </AdminPrivateRoute>
                    }
                />

                <Route
                    path="/admin/internships/add"
                    element={
                        <AdminPrivateRoute>
                            <AddInternship />
                        </AdminPrivateRoute>
                    }
                />

                <Route
                    path="/admin/applications/:applicationId"
                    element={
                        <AdminPrivateRoute>
                            <AdminApplicationDetails />
                        </AdminPrivateRoute>
                    }
                />

                <Route
                    path="/admin/internships"
                    element={
                        <AdminPrivateRoute>
                            <AdminInternships />
                        </AdminPrivateRoute>
                    }
                />
                <Route
    path="/admin/internships/:internship_id/edit"
    element={
        <AdminPrivateRoute>
            <EditInternship />
        </AdminPrivateRoute>
    }
/>

            </Routes>

        </BrowserRouter>
    );
}

export default App;