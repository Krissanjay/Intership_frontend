import { useEffect, useState } from "react";
import StudentNavbar from "../components/StudentNavbar";
import SkeletonLoader from "../components/SkeletonLoader";
import "../css/StudentMain.css";

function Recommendations() {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchRecommendations();
    }, []);
    const applyInternship = async (internshipId) => {

        const token = localStorage.getItem("token");

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

        }
    };

    const fetchRecommendations = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setError("Please login first.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/recommendations/saved`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                console.log("Backend response:", data);

                setError(
                    data.message ||
                    data.msg ||
                    `Server returned ${response.status}`
                );

                return;
            }

            setRecommendations(data.recommendations || []);

        } catch (err) {
            console.error("Recommendation error:", err);
            setError("Could not connect to backend.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="student-page">
                <StudentNavbar />
                <div className="student-content">
                    <h1 className="page-title">Internship Recommendations</h1>
                    <SkeletonLoader type="list" count={5} />
                </div>
            </div>
        );
    }

    if (error) {
        return <h2>{error}</h2>;
    }

    return (
        <div className="student-page">
            <StudentNavbar />
            <div className="student-content">
                <h1 className="page-title">AI Internship Recommendations</h1>
                <p>Internships ranked according to your profile, skills and resume.</p>

            {recommendations.length === 0 ? (
                <div className="item-card">
                    <p>No recommendations available.</p>
                </div>
            ) : (
                recommendations.map((item) => (
                    <div key={item.recommendation_id} className="app-card">
                        <h2 className="app-title">{item.role}</h2>
                        <h3 className="app-company">{item.company_name}</h3>
                        <p className="app-detail">📍 {item.location}</p>
                        <p className="app-detail">⏱️ Duration: {item.duration}</p>
                        <p className="app-detail">💰 Stipend: ₹{item.stipend}</p>

                        <hr />

                        <h3 className="section-title" style={{ marginTop: '0', fontSize: '18px' }}>Recommendation Score</h3>
                        <div className="dashboard-grid" style={{ marginTop: '10px', marginBottom: '20px' }}>
                            <div className="stat-card" style={{ padding: '15px' }}>
                                <h3>Overall Score</h3>
                                <p style={{ fontSize: '24px' }}>{item.overall_score}%</p>
                            </div>
                            <div className="stat-card" style={{ padding: '15px' }}>
                                <h3>Skill Match</h3>
                                <p style={{ fontSize: '24px' }}>{item.skill_match_score}%</p>
                            </div>
                            <div className="stat-card" style={{ padding: '15px' }}>
                                <h3>Resume Match</h3>
                                <p style={{ fontSize: '24px' }}>{item.semantic_score}%</p>
                            </div>
                        </div>

                        <p><strong>Profile Match:</strong> {item.profile_match_score || "N/A"}%</p>

                        <hr />

                        <h3 style={{ color: "#2b3674", fontSize: "18px" }}>Why this internship?</h3>
                        <p style={{ color: "#4a5568", lineHeight: "1.6" }}>{item.explanation}</p>

                        <h3 style={{ color: "#2b3674", fontSize: "18px" }}>Skill Gap</h3>
                        <p style={{ color: "#4a5568", lineHeight: "1.6" }}>{item.skill_gap}</p>

                        <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                            <button className="btn-primary" onClick={() => applyInternship(item.internship_id)}>
                                Apply Now
                            </button>
                            <button className="btn-primary" style={{ background: '#e0e5f2', color: '#2b3674' }}>
                                View Internship
                            </button>
                        </div>
                    </div>
                ))
            )}
            </div>
        </div>
    );
}

export default Recommendations;