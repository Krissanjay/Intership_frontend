import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StudentNavbar from "../components/StudentNavbar";
import LoadingOverlay from "../components/LoadingOverlay";
import "../css/StudentMain.css";

function AvailableInternshipDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isApplying, setIsApplying] = useState(false);

    // Retrieve the passed item from state
    const { item } = location.state || {};

    // If no item is passed, show error or redirect
    if (!item) {
        return (
            <div className="student-page">
                <StudentNavbar />
                <div className="student-content">
                    <h2 style={{ color: "red" }}>No details available.</h2>
                    <button className="btn-primary" onClick={() => navigate("/internships")}>
                        Back to Internships
                    </button>
                </div>
            </div>
        );
    }

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

    return (
        <div className="student-page">
            <StudentNavbar />
            <div className="student-content">
                <button 
                    onClick={() => navigate("/internships")} 
                    style={{ background: 'none', border: 'none', color: '#2b3674', cursor: 'pointer', marginBottom: '20px', fontWeight: 'bold' }}
                >
                    &larr; Back to Internships
                </button>

                <div className="app-card" style={{ maxWidth: '800px' }}>
                    <h2 className="app-title">{item.role}</h2>
                    <h3 className="app-company">{item.company_name}</h3>
                    <p className="app-detail">📍 {item.location}</p>
                    <p className="app-detail">⏱️ Duration: {item.duration}</p>
                    
                    {item.stipend !== null && item.stipend !== undefined && (
                        <p className="app-detail">💰 Stipend: ₹{item.stipend}</p>
                    )}

                    <hr />

                    <h3 style={{ color: "#2b3674", fontSize: "18px" }}>Description</h3>
                    <p style={{ color: "#4a5568", lineHeight: "1.6" }}>{item.description || "No description provided."}</p>

                    <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                        <button className="btn-primary" onClick={() => applyInternship(item.internship_id)}>
                            Apply Now
                        </button>
                    </div>
                </div>
            </div>
            {isApplying && <LoadingOverlay message="Submitting application..." />}
        </div>
    );
}

export default AvailableInternshipDetails;
