import { useEffect, useState } from "react";
import StudentNavbar from "../components/StudentNavbar";
import "../css/StudentMain.css";

function Applications() {

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {

        try {

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/applications`,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                const text = await response.text();
                setError(`Server Error (${response.status}): The backend returned an error.`);
                console.error("Backend Error Response:", text);
                return;
            }

            const data = await response.json();

            if (data.success) {
                setApplications(data.applications);
            } else {
                setError(data.message || "Failed to load applications");
            }

        } catch (error) {
            setError("Unable to connect to backend");
        } finally {
            setLoading(false);
        }
    };

    const getStatusClass = (status) => {

        switch (status) {
            case "Applied":
                return "status applied";

            case "Shortlisted":
                return "status shortlisted";

            case "Interview":
                return "status interview";

            case "Selected":
                return "status selected";

            case "Rejected":
                return "status rejected";

            default:
                return "status";
        }
    };

    if (loading) {
        return <h2>Loading applications...</h2>;
    }

    return (
        <div className="student-page">
            <StudentNavbar />
            <div className="student-content">
                <h1 className="page-title">My Applications</h1>

            {error && (
                <p className="message error">
                    {error}
                </p>
            )}

            {!error && applications.length === 0 && (
                <div className="item-card">
                    <p>You have not applied for any internships yet.</p>
                </div>
            )}

            <div className="applications-list">
                {applications.map((application) => (
                    <div key={application.application_id} className="app-card">
                        <h2 className="app-title">{application.role}</h2>
                        <h3 className="app-company">{application.company_name}</h3>
                        <p className="app-detail">📍 {application.location}</p>
                        <p className="app-detail">💰 Stipend: ₹{application.stipend}</p>
                        <p className="app-detail">
                            📅 Applied on: {new Date(application.applied_at).toLocaleDateString()}
                        </p>
                        <p style={{ marginTop: "15px" }}>
                            <span className={getStatusClass(application.status)}>
                                {application.status}
                            </span>
                        </p>
                    </div>
                ))}
            </div>
        </div>
        </div>
    );
}

export default Applications;