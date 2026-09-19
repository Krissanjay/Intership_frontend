import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
        <div
            style={{
                width: "400px",
                margin: "100px auto",
                padding: "30px",
                border: "1px solid #ddd",
                borderRadius: "10px"
            }}
        >
            <h1>Admin Login</h1>

            {error && (
                <p style={{ color: "red" }}>
                    {error}
                </p>
            )}

            <form onSubmit={handleLogin}>

                <div style={{ marginBottom: "15px" }}>
                    <label>Email</label>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter admin email"
                        required
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginTop: "5px"
                        }}
                    />
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label>Password</label>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter admin password"
                        required
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginTop: "5px"
                        }}
                    />
                </div>

                <button
                    type="submit"
                    style={{
                        width: "100%",
                        padding: "12px",
                        cursor: "pointer"
                    }}
                >
                    Login as Admin
                </button>

            </form>
        </div>
    );
}

export default AdminLogin;