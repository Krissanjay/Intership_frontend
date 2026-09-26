import { useEffect, useState } from "react";
import StudentNavbar from "../components/StudentNavbar";
import "../css/StudentMain.css";

function Skills() {

    const [skills, setSkills] = useState([]);
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchSkills();
        fetchStudentSkills();
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
                setSkills(data.detected_skills || []);
            } else {
                setSkills([]);
            }

        } catch (error) {
            console.error(error);
        }
    };

    const fetchStudentSkills = async () => {

        const token = localStorage.getItem("token");

        try {

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/student-skills`,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (data.success) {
                setSelectedSkills(data.skills);
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

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/student-skills`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        skills: selectedSkills
                    })
                }
            );

            const data = await response.json();

            setMessage(data.message);

        } catch (error) {

            console.error(error);
            setMessage("Unable to save skills");

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
                                        fetchSkills();
                                        fetchStudentSkills();
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
                </div>
            </div>
        </div>
    );
}

export default Skills;