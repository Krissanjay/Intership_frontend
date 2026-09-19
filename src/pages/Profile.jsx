import { useEffect, useState } from "react";
import StudentNavbar from "../components/StudentNavbar";
import SkeletonLoader from "../components/SkeletonLoader";
import "../css/StudentMain.css";

function Profile() {
    const [form, setForm] = useState({
        college: "",
        degree: "",
        branch: "",
        cgpa: "",
        graduation_year: "",
        location: "",
        preferred_location: "",
        career_interest: ""
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success && data.profile) {
                    setForm({
                        college: data.profile.college || "",
                        degree: data.profile.degree || "",
                        branch: data.profile.branch || "",
                        cgpa: data.profile.cgpa || "",
                        graduation_year: data.profile.graduation_year || "",
                        location: data.profile.location || "",
                        preferred_location: data.profile.preferred_location || "",
                        career_interest: data.profile.career_interest || ""
                    });
                }

                setLoading(false);
            })
            .catch(() => {
                setMessage("Failed to load profile");
                setLoading(false);
            });
    }, [token]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/profile`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(form)
                }
            );

            const data = await response.json();

            if (response.ok) {
                setMessage("Profile saved successfully!");
            } else {
                setMessage(data.message || "Failed to save profile");
            }
        } catch (error) {
            setMessage("Server error");
        }
    };

    if (loading) {
        return (
            <div className="student-page">
                <StudentNavbar />
                <div className="student-content">
                    <h1 className="page-title">Student Profile</h1>
                    <SkeletonLoader type="form" />
                </div>
            </div>
        );
    }

    return (
        <div className="student-page">
            <StudentNavbar />

            <div className="student-content">
                <h1 className="page-title">Student Profile</h1>
                <p>Complete your profile to improve internship recommendations.</p>

                {message && (
                    <p className={`message ${message === "Profile saved successfully!" ? "success" : "error"}`}>
                        {message}
                    </p>
                )}

                <div className="profile-card">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">College</label>
                            <input
                                type="text"
                                name="college"
                                value={form.college}
                                onChange={handleChange}
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Degree</label>
                            <input
                                type="text"
                                name="degree"
                                value={form.degree}
                                onChange={handleChange}
                                placeholder="Example: B.Tech"
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Branch</label>
                            <input
                                type="text"
                                name="branch"
                                value={form.branch}
                                onChange={handleChange}
                                placeholder="Example: Computer Science"
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">CGPA</label>
                            <input
                                type="number"
                                name="cgpa"
                                value={form.cgpa}
                                onChange={handleChange}
                                min="0"
                                max="10"
                                step="0.01"
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Graduation Year</label>
                            <input
                                type="number"
                                name="graduation_year"
                                value={form.graduation_year}
                                onChange={handleChange}
                                placeholder="Example: 2027"
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Current Location</label>
                            <input
                                type="text"
                                name="location"
                                value={form.location}
                                onChange={handleChange}
                                placeholder="Example: Thrissur"
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Preferred Internship Location</label>
                            <input
                                type="text"
                                name="preferred_location"
                                value={form.preferred_location}
                                onChange={handleChange}
                                placeholder="Example: Kochi"
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Career Interest</label>
                            <input
                                type="text"
                                name="career_interest"
                                value={form.career_interest}
                                onChange={handleChange}
                                placeholder="Example: AI, Data Science"
                                className="form-input"
                            />
                        </div>

                        <button type="submit" className="btn-primary">
                            Save Profile
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Profile;