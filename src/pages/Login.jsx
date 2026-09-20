import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../css/Login.css";

function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                }
            );

            const data = await response.json();

            if (data.success) {
                localStorage.setItem("token", data.token);
                localStorage.setItem(
                    "student",
                    JSON.stringify(data.student)
                );

                setMessage("Login successful!");
                navigate("/dashboard"); // Redirect to dashboard

                console.log("Logged in:", data.student);
            } else {
                setMessage(data.message);
            }

        } catch (error) {
            console.error(error);
            setMessage("Unable to connect to server");
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1 className="login-title">Student Login</h1>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="input-group">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="login-input"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="login-input"
                            required
                        />
                    </div>

                    <button type="submit" className="login-button">
                        Login
                    </button>
                </form>

                {message && (
                    <p className={`login-message ${message === "Login successful!" ? "success" : "error"}`}>
                        {message}
                    </p>
                )}

                <p className="register-text">
                    Don't have an account? <Link to="/register" className="register-link">Register here</Link>
                </p>

                <button 
                    type="button" 
                    className="login-button" 
                    onClick={() => navigate("/")}
                    style={{ marginTop: '15px', backgroundColor: '#6c757d' }}
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
}

export default Login;