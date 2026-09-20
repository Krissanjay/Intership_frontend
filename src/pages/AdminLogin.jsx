import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/AdminLogin.css";
import LoadingOverlay from "../components/LoadingOverlay";

function AdminLogin({ onClose }) {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/admin/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );

            const data = await response.json();

            if (response.ok && data.success) {
                // Save admin login information
                localStorage.setItem("adminToken", data.token);
                localStorage.setItem("admin", JSON.stringify(data.admin));

                // Open dashboard
                navigate("/admin-dashboard");
            } else {
                setError(data.message || "Invalid admin credentials");
            }

        } catch (err) {
            setError("Unable to connect to the backend.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="admin-modal-overlay" onClick={onClose}>
            <div className="admin-login-card" onClick={(e) => e.stopPropagation()}>
                <button className="admin-close-btn" onClick={onClose}>&times;</button>
                <h1 className="admin-login-title">Admin Login</h1>

                {error && (
                    <div className="admin-error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div className="admin-form-group">
                        <label className="admin-form-label">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter admin email"
                            required
                            className="admin-form-input"
                        />
                    </div>

                    <div className="admin-form-group">
                        <label className="admin-form-label">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter admin password"
                            required
                            className="admin-form-input"
                        />
                    </div>

                    <button
                        type="submit"
                        className="admin-login-button"
                    >
                        Login as Admin
                    </button>
                </form>

            </div>
            {isLoading && <LoadingOverlay message="Logging in as Admin..." />}
        </div>
    );
}

export default AdminLogin;