import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentNavbar from "../components/StudentNavbar";
import SkeletonLoader from "../components/SkeletonLoader";
import LoadingOverlay from "../components/LoadingOverlay";
import "../css/StudentMain.css";

function Recommendations() {
    const navigate = useNavigate();
    const [recommendations, setRecommendations] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [isApplying, setIsApplying] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchRecommendations();
    }, []);

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
                    <h1 className="page-title">AI Recommendations</h1>
                    <SkeletonLoader type="list" count={5} />
                </div>
                <LoadingOverlay message="Finding best matches..." />
            </div>
        );
    }

    if (error) {
        return <h2>{error}</h2>;
    }

    const filteredRecommendations = recommendations.filter(item => {
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
                <h1 className="page-title">AI Internship Recommendations</h1>
                <p>Internships ranked according to your profile, skills and resume.</p>

                <div className="form-group" style={{ marginBottom: '30px' }}>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Search internships by role, company, or location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

            {filteredRecommendations.length === 0 ? (
                <div className="item-card">
                    <p>No internships found.</p>
                </div>
            ) : (
                filteredRecommendations.map((item) => (
                    <div key={item.recommendation_id} className="app-card">
                        <h2 className="app-title">{item.role}</h2>
                        <h3 className="app-company">{item.company_name}</h3>
                        <p className="app-detail">📍 {item.location}</p>
                        <p className="app-detail">⏱️ Duration: {item.duration}</p>
                        <p className="app-detail">💰 Stipend: ₹{item.stipend}</p>

                        <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                            <button className="btn-primary" onClick={() => applyInternship(item.internship_id)}>
                                Apply Now
                            </button>
                            <button className="btn-primary" style={{ background: '#e0e5f2', color: '#2b3674' }} onClick={() => navigate(`/recommendations/${item.recommendation_id}`, { state: { item } })}>
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

export default Recommendations;