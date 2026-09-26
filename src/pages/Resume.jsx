import { useEffect, useState } from "react";
import StudentNavbar from "../components/StudentNavbar";
import SkeletonLoader from "../components/SkeletonLoader";
import "../css/StudentMain.css";

function Resume() {
    const [file, setFile] = useState(null);
    const [resume, setResume] = useState(null);
    const [skills, setSkills] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    const token = localStorage.getItem("token");

    const loadResume = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/resume`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (data.success) {
                setResume(data.resume);
            }
        } catch (error) {
            console.log("Failed to load resume");
        }
    };

    const loadSkills = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/resume/extract-skills`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (data.success) {
                setSkills(data.detected_skills || []);
            }
        } catch (error) {
            console.log("Failed to load skills");
        }
    };

    useEffect(() => {
        const fetchAll = async () => {
            setIsFetching(true);
            await Promise.all([loadResume(), loadSkills()]);
            setIsFetching(false);
        };
        fetchAll();
    }, []);

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!file) {
            setMessage("Please select a PDF or DOCX resume.");
            return;
        }

        const formData = new FormData();
        formData.append("resume", file);

        setLoading(true);
        setMessage("");

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/resume/upload`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: formData
                }
            );

            const data = await response.json();

            if (response.ok) {
                setMessage("Resume uploaded successfully!");
                setFile(null);

                await loadResume();
                await loadSkills();
            } else {
                setMessage(data.message || "Resume upload failed.");
            }
        } catch (error) {
            setMessage("Server error while uploading resume.");
        }

        setLoading(false);
    };

    if (isFetching) {
        return (
            <div className="student-page">
                <StudentNavbar />
                <div className="student-content">
                    <h1 className="page-title">Resume</h1>
                    <SkeletonLoader type="list" count={3} />
                </div>
            </div>
        );
    }

    return (
        <div className="student-page">
            <StudentNavbar />

            <div className="student-content">
                <h1 className="page-title">Resume</h1>

                <p style={{ marginBottom: '20px' }}>
                    Upload your resume to automatically extract skills and improve internship recommendations.
                </p>

                <div className="item-card">
                    <form onSubmit={handleUpload}>
                        <div className="form-group">
                            <input
                                type="file"
                                accept=".pdf,.docx"
                                onChange={(e) => setFile(e.target.files[0])}
                                className="form-input"
                                style={{ padding: '10px' }}
                            />
                        </div>

                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? "Uploading..." : "Upload Resume"}
                        </button>
                    </form>

                    {message && (
                        <p className={`message ${message.includes("successfully") ? "success" : "error"}`} style={{ marginTop: '20px' }}>
                            {message}
                        </p>
                    )}
                </div>

                <h2 className="section-title">Uploaded Resume</h2>

                {resume ? (
                    <div className="item-card">
                        <p><strong>File:</strong> {resume.file_name}</p>
                        <p><strong>Uploaded:</strong> {resume.uploaded_at}</p>
                    </div>
                ) : (
                    <div className="item-card">
                        <p>No resume uploaded yet.</p>
                    </div>
                )}

                <h2 className="section-title">Detected Skills</h2>

                {skills.length > 0 ? (
                    <div className="item-card">
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {skills.map((skill, index) => (
                                <span key={index} style={{ background: '#4318FF', color: 'white', padding: '8px 15px', borderRadius: '20px', fontSize: '14px', fontWeight: '500' }}>
                                    {skill.skill_name}
                                </span>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="item-card">
                        <p>No skills detected yet. Upload a resume containing technical skills.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Resume;