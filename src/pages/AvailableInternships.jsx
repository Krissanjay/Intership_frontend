import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentNavbar from "../components/StudentNavbar";
import SkeletonLoader from "../components/SkeletonLoader";
import LoadingOverlay from "../components/LoadingOverlay";
import "../css/StudentMain.css";

function AvailableInternships() {
    const navigate = useNavigate();
    const [internships, setInternships] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [isApplying, setIsApplying] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchInternships();
    }, []);

    const fetchInternships = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/internships`, {
                method: "GET"
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Failed to fetch internships");
                return;
            }

            // Only show active internships
            const activeInternships = (data.internships || []).filter(
                (internship) => Number(internship.is_active) === 1
            );

            setInternships(activeInternships);
        } catch (err) {
            console.error("Fetch internships error:", err);
            setError("Could not connect to backend.");
        } finally {
            setLoading(false);
        }
    };

    const applyInternship = async (internshipId) => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Please login to apply.");
            return;
        }

        setIsApplying(true);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/applications`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        internship_id: internshipId
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {
                alert("Application submitted successfully!");
            } else {
                alert(data.message || "Application failed");
            }
        } catch (error) {
            alert("Unable to connect to backend");
        } finally {
            setIsApplying(false);
        }
    };

    if (loading) {
        return (
            <div className="student-page">
                <StudentNavbar />
                <div className="student-content">
                    <h1 className="page-title">Available Internships</h1>
                    <SkeletonLoader type="list" count={5} />
                </div>
                <LoadingOverlay message="Loading internships..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="student-page">
                <StudentNavbar />
                <div className="student-content">
                    <h2 style={{ color: "red" }}>{error}</h2>
                </div>
            </div>
        );
    }

    const filteredInternships = internships.filter(item => {
        const search = searchTerm.toLowerCase();
        return (
            item.role?.toLowerCase().includes(search) ||
            item.company_name?.toLowerCase().includes(search) ||
            item.location?.toLowerCase().includes(search)
        );
    });

    return (
        <div className="student-page">
            <StudentNavbar />
            <div className="student-content">
                <h1 className="page-title">Available Internships</h1>
                <p>Browse and apply for the latest internship opportunities.</p>

                <div className="form-group" style={{ marginBottom: '30px' }}>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Search internships by role, company, or location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {filteredInternships.length === 0 ? (
                    <div className="item-card">
                        <p>No internships found.</p>
                    </div>
                ) : (
                    filteredInternships.map((item) => (
                        <div key={item.internship_id} className="app-card">
                            <h2 className="app-title">{item.role}</h2>
                            <h3 className="app-company">{item.company_name}</h3>
                            <p className="app-detail">📍 {item.location}</p>
                            <p className="app-detail">⏱️ Duration: {item.duration}</p>

                            {item.stipend !== null && item.stipend !== undefined && (
                                <p className="app-detail">💰 Stipend: ₹{item.stipend}</p>
                            )}

                            {item.required_skills && (
                                <p className="app-detail" style={{ marginTop: '10px' }}>
                                    <strong>Required Skills:</strong> {item.required_skills}
                                </p>
                            )}

                            <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                                <button className="btn-primary" onClick={() => applyInternship(item.internship_id)}>
                                    Apply Now
                                </button>
                                <button className="btn-primary" style={{ background: '#e0e5f2', color: '#2b3674' }} onClick={() => navigate(`/internships/${item.internship_id}`, { state: { item } })}>
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
            {isApplying && <LoadingOverlay message="Submitting application..." />}
        </div>
    );
}

export default AvailableInternships;
