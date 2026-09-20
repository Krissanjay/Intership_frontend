import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/AdminLogin.css";

function AdminLogin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

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

        } catch (error) {
            setError("Unable to connect to backend");
        }
    };

    return (
        <div className="admin-login-container">
            <div className="admin-login-card">
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

                <button 
                    type="button" 
                    className="admin-login-button" 
                    onClick={() => navigate("/")}
                    style={{ marginTop: '15px', backgroundColor: '#6c757d' }}
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
}

export default AdminLogin;