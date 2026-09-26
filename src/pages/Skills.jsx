import { useEffect, useState } from "react";
import StudentNavbar from "../components/StudentNavbar";
import "../css/StudentMain.css";

function Skills() {

    const [skills, setSkills] = useState([]);
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [message, setMessage] = useState("");
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {

        const token = localStorage.getItem("token");

        try {

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/resume/extract-skills`,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (data.success) {
                const rawExtracted = data.detected_skills || [];
                
                // Normalize for older backend that returns strings instead of objects
                const extracted = rawExtracted.map((item, idx) => {
                    if (typeof item === 'string') {
                        return { skill_id: `temp_${idx}`, skill_name: item };
                    }
                    return item;
                });
                
                setSkills(extracted);
                
                // Automatically select the extracted skills
                setSelectedSkills(prev => {
                    const updated = [...prev];
                    extracted.forEach(skill => {
                        if (!updated.find(s => s.skill_id === skill.skill_id)) {
                            updated.push({
                                skill_id: skill.skill_id,
                                skill_name: skill.skill_name,
                                proficiency_level: "Beginner"
                            });
                        }
                    });
                    return updated;
                });
            } else {
                setSkills([]);
            }

        } catch (error) {
            console.error(error);
        }
    };

    const handleSkillChange = (skill) => {

        const exists = selectedSkills.find(
            item => item.skill_id === skill.skill_id
        );

        if (exists) {

            setSelectedSkills(
                selectedSkills.filter(
                    item => item.skill_id !== skill.skill_id
                )
            );

        } else {

            setSelectedSkills([
                ...selectedSkills,
                {
                    skill_id: skill.skill_id,
                    skill_name: skill.skill_name,
                    proficiency_level: "Beginner"
                }
            ]);
        }
    };

    const handleProficiencyChange = (skillId, level) => {

        setSelectedSkills(
            selectedSkills.map(skill =>
                skill.skill_id === skillId
                    ? {
                        ...skill,
                        proficiency_level: level
                    }
                    : skill
            )
        );
    };

    const saveSkills = async () => {

        const token = localStorage.getItem("token");

        try {
            // First, silently fetch their existing custom skills so we don't overwrite them
            const existingRes = await fetch(`${import.meta.env.VITE_API_URL}/api/student-skills`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const existingData = await existingRes.json();
            const existingSkills = existingData.success ? existingData.skills : [];

            // We keep existing skills unless they are part of the resume extraction but unchecked
            const resumeSkillIds = skills.map(s => s.skill_id);
            const mergedSkillsMap = new Map();
            
            // Add all existing skills that are NOT part of the resume extraction
            existingSkills.forEach(skill => {
                if (!resumeSkillIds.includes(skill.skill_id)) {
                    mergedSkillsMap.set(skill.skill_id, skill);
                }
            });
            
            // Add all checked resume skills
            selectedSkills.forEach(skill => {
                mergedSkillsMap.set(skill.skill_id, skill);
            });
            
            const finalSkillsToSave = Array.from(mergedSkillsMap.values());

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/student-skills`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        skills: finalSkillsToSave
                    })
                }
            );

            const data = await response.json();

            setMessage(data.message);
            if (data.success) {
                fetchRecommendations();
            }

        } catch (error) {

            console.error(error);
            setMessage("Unable to save skills");

        }
    };

    const fetchRecommendations = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/recommendations`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setRecommendations(data.recommendations || []);
            }
        } catch (err) {
            console.error("Failed to fetch recommendations:", err);
        }
    };

    return (
        <div className="student-page">
            <StudentNavbar />

            <div className="student-content">
                <h1 className="page-title">My Skills</h1>
                <p style={{ marginBottom: "20px" }}>Select the skills you have.</p>

                <div className="item-card" style={{ maxWidth: "600px", marginBottom: "30px" }}>
                    <h3>Add Custom Skill</h3>
                    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                        <input
                            type="text"
                            placeholder="Enter skill name..."
                            className="form-input"
                            style={{ margin: 0, flex: 1 }}
                            id="customSkillInput"
                        />
                        <button 
                            className="btn-primary" 
                            onClick={async () => {
                                const input = document.getElementById("customSkillInput");
                                if (!input.value) return;
                                
                                const token = localStorage.getItem("token");
                                try {
                                    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/student-skills/add`, {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                            "Authorization": `Bearer ${token}`
                                        },
                                        body: JSON.stringify({ skill_name: input.value, proficiency_level: "Beginner" })
                                    });
                                    if (res.ok) {
                                        input.value = "";
                                        await fetchSkills();
                                        setMessage("Skill added successfully!");
                                    } else {
                                        const data = await res.json();
                                        setMessage(data.message || "Failed to add skill");
                                    }
                                } catch (e) {
                                    setMessage("Error adding skill");
                                }
                            }}
                        >
                            Add Skill
                        </button>
                    </div>
                </div>

                <div className="item-card" style={{ maxWidth: "600px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                        {skills.map(skill => {
                                const selected = selectedSkills.find(
                                    item => item.skill_id === skill.skill_id
                                );

                                return (
                                    <div key={skill.skill_id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px", background: "#f8f9fa", borderRadius: "10px", border: "1px solid #e0e5f2" }}>
                                    <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontWeight: "500", color: "#2b3674" }}>
                                        <input
                                            type="checkbox"
                                            checked={!!selected}
                                            onChange={() => handleSkillChange(skill)}
                                            style={{ width: "18px", height: "18px", cursor: "pointer" }}
                                        />
                                        {skill.skill_name}
                                    </label>

                                    {selected && (
                                        <select
                                            value={selected.proficiency_level}
                                            onChange={(e) => handleProficiencyChange(skill.skill_id, e.target.value)}
                                            className="form-input"
                                            style={{ width: "150px", padding: "8px", margin: "0" }}
                                        >
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                        </select>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <button className="btn-primary" onClick={saveSkills} style={{ marginTop: "30px" }}>
                        Save Skills
                    </button>

                    {message && (
                        <p className={`message ${message.includes("success") ? "success" : "error"}`} style={{ marginTop: "20px" }}>
                            {message}
                        </p>
                    )}

                    {recommendations.length > 0 && (
                        <div style={{ marginTop: "40px" }}>
                            <h2 className="section-title">Recommended Internships</h2>
                            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                                {recommendations.map(rec => (
                                    <div key={rec.internship_id} className="item-card" style={{ padding: "20px", background: "#f8f9fa", borderRadius: "10px", border: "1px solid #e0e5f2" }}>
                                        <h3 style={{ margin: "0 0 10px 0", color: "#2b3674" }}>{rec.role}</h3>
                                        <p style={{ margin: "0 0 5px 0", color: "#4318FF", fontWeight: "600" }}>{rec.company_name}</p>
                                        <p style={{ margin: "0 0 10px 0", fontSize: "14px", color: "#a3aed0" }}>Match Score: {rec.overall_score}%</p>
                                        <a href={`/recommendations/${rec.internship_id}`} className="btn-primary" style={{ display: "inline-block", textDecoration: "none", marginTop: "10px" }}>View Details</a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Skills;