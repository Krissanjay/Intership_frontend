import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StudentNavbar from "../components/StudentNavbar";
import LoadingOverlay from "../components/LoadingOverlay";
import "../css/StudentMain.css";

function RecommendationDetails() {
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
                    <button className="btn-primary" onClick={() => navigate("/recommendations")}>
                        Back to Recommendations
                    </button>
                </div>
            </div>
        );
    }

    const applyInternship = async (internshipId) => {
        const token = localStorage.getItem("token");

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
                    onClick={() => navigate("/recommendations")} 
                    style={{ background: 'none', border: 'none', color: '#2b3674', cursor: 'pointer', marginBottom: '20px', fontWeight: 'bold' }}
                >
                    &larr; Back to Recommendations
                </button>

                <div className="app-card" style={{ maxWidth: '800px' }}>
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

                    <h3 style={{ color: "#2b3674", fontSize: "18px", marginTop: "20px" }}>Skill Gap</h3>
                    {(() => {
                        let missingSkillsList = item.missing_skills;
                        if (!missingSkillsList && item.skill_gap && item.skill_gap.startsWith("Skills to improve: ")) {
                            const skillsStr = item.skill_gap.replace("Skills to improve: ", "").replace(".", "");
                            missingSkillsList = skillsStr.split(",").map(s => ({ skill_name: s.trim() })).filter(s => s.skill_name);
                        }

                        if (missingSkillsList && missingSkillsList.length > 0) {
                            return (
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "10px" }}>
                                    {missingSkillsList.map((skill, index) => (
                                        <div key={skill.skill_id || index} style={{ display: "flex", alignItems: "center", background: "#f1f3f9", padding: "8px 12px", borderRadius: "20px" }}>
                                            <span style={{ marginRight: "10px", color: "#4a5568" }}>{skill.skill_name}</span>
                                            <button 
                                                style={{ background: "#2b3674", color: "#fff", border: "none", borderRadius: "10px", padding: "4px 8px", cursor: "pointer", fontSize: "12px" }}
                                                onClick={async (e) => {
                                                    const btn = e.target;
                                                    btn.disabled = true;
                                                    btn.innerText = "Adding...";
                                                    const token = localStorage.getItem("token");
                                                    try {
                                                        const payload = skill.skill_id ? { skill_id: skill.skill_id } : { skill_name: skill.skill_name };
                                                        payload.proficiency_level = "Beginner";
                                                        
                                                        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/student-skills/add`, {
                                                            method: "POST",
                                                            headers: {
                                                                "Content-Type": "application/json",
                                                                "Authorization": `Bearer ${token}`
                                                            },
                                                            body: JSON.stringify(payload)
                                                        });
                                                        if (res.ok) {
                                                            btn.innerText = "Added ✓";
                                                            btn.style.background = "green";
                                                        } else {
                                                            btn.innerText = "Error";
                                                            btn.disabled = false;
                                                        }
                                                    } catch (err) {
                                                        btn.innerText = "Error";
                                                        btn.disabled = false;
                                                    }
                                                }}
                                            >
                                                Add Skill
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            );
                        }
                        
                        return <p style={{ color: "#4a5568", lineHeight: "1.6" }}>{item.skill_gap}</p>;
                    })()}

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

export default RecommendationDetails;
