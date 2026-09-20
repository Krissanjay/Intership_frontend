import { useEffect, useState } from "react";
import StudentNavbar from "../components/StudentNavbar";
import SkeletonLoader from "../components/SkeletonLoader";
import "../css/StudentMain.css";

function StudentDashboard() {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/dashboard`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (response.ok && data.success) {
                setDashboard(data);
            } else {
                setError(data.message || "Failed to load dashboard");
            }
        } catch (error) {
            setError("Unable to connect to backend");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="student-page">
                <StudentNavbar />
                <div className="student-content">
                    <h1 className="page-title">Student Dashboard</h1>
                    <SkeletonLoader type="grid" count={4} />
                    <SkeletonLoader type="list" count={3} />
                </div>
            </div>
        );
    }

    if (error) {
        return <h2 style={{ color: "red" }}>{error}</h2>;
    }

    const stats = dashboard.statistics;

    return (
        <div className="student-page">
            <StudentNavbar />
            <div className="student-content">
                <h1 className="page-title">Student Dashboard</h1>

                <h2>
                    Welcome, {dashboard.student.name}
                </h2>

                <p>
                    Email: {dashboard.student.email}
                </p>

                <hr />

                <h2 className="section-title">Dashboard Overview</h2>

                <div className="dashboard-grid">

                    <div className="dashboard-card">
                        <h3>Skills</h3>
                        <p>{stats.total_skills}</p>
                    </div>

                    <div className="dashboard-card">
                        <h3>Resume</h3>
                        <p>{stats.total_resumes}</p>
                    </div>

                    <div className="dashboard-card">
                        <h3>Recommendations</h3>
                        <p>{stats.total_recommendations}</p>
                    </div>

                    <div className="dashboard-card">
                        <h3>Saved Internships</h3>
                        <p>{stats.total_saved}</p>
                    </div>

                    <div className="dashboard-card">
                        <h3>Applications</h3>
                        <p>{stats.total_applications}</p>
                    </div>

                </div>

                <hr />

                <h2 className="section-title">Profile</h2>

                {dashboard.profile ? (
                    <div className="profile-card">
                        <p>
                            <strong>College:</strong>{" "}
                            {dashboard.profile.college}
                        </p>

                        <p>
                            <strong>Degree:</strong>{" "}
                            {dashboard.profile.degree}
                        </p>

                        <p>
                            <strong>Branch:</strong>{" "}
                            {dashboard.profile.branch}
                        </p>

                        <p>
                            <strong>CGPA:</strong>{" "}
                            {dashboard.profile.cgpa}
                        </p>

                        <p>
                            <strong>Graduation Year:</strong>{" "}
                            {dashboard.profile.graduation_year}
                        </p>

                        <p>
                            <strong>Preferred Location:</strong>{" "}
                            {dashboard.profile.preferred_location}
                        </p>
                    </div>
                ) : (
                    <p>Profile not completed yet.</p>
                )}

            </div>
        </div>
    );
}

export default StudentDashboard;