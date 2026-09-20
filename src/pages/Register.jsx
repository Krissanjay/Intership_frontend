import { useState } from "react";
import { Link } from "react-router-dom";
import "../css/Register.css";

function Register() {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: ""
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
                `${import.meta.env.VITE_API_URL}/api/register`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                }
            );

            const data = await response.json();

            setMessage(data.message);

        } catch (error) {

            console.error(error);

            setMessage("Unable to connect to server");
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h1 className="register-title">Student Registration</h1>

                <form onSubmit={handleSubmit} className="register-form">
                    <div className="input-group">
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            className="register-input"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="register-input"
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
                            className="register-input"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <input
                            type="text"
                            name="phone"
                            placeholder="Phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="register-input"
                            required
                        />
                    </div>

                    <button type="submit" className="register-button">
                        Register
                    </button>
                </form>

                {message && (
                    <p className={`register-message ${message === "Registration successful" ? "success" : "error"}`}>
                        {message}
                    </p>
                )}
                
                <p style={{ marginTop: "20px", color: "#666", fontSize: "14px" }}>
                    Already have an account? <Link to="/" state={{ openLogin: true }} style={{ color: "#43e97b", textDecoration: "none", fontWeight: "600" }}>Login here</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;