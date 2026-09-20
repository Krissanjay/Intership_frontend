import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SkeletonLoader from "../components/SkeletonLoader";
import "../css/InternshipForm.css";

function EditInternship() {
    const navigate = useNavigate();
    const { internship_id } = useParams();

    const [formData, setFormData] = useState({
        company_name: "",
        role: "",
        description: "",
        location: "",
        duration: "",
        stipend: "",
        minimum_cgpa: "",
        eligible_degree: "",
        eligible_branch: "",
        application_deadline: ""
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const token = localStorage.getItem("adminToken");

    useEffect(() => {
        if (!token) {
            navigate("/");
            return;
        }

        fetchInternship();
    }, [internship_id]);

    const fetchInternship = async () => {
        try {
            setLoading(true);

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/admin/internships/${internship_id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to fetch internship"
                );
            }

            const internship = data.internship;

            setFormData({
                company_name: internship.company_name || "",
                role: internship.role || "",
                description: internship.description || "",
                location: internship.location || "",
                duration: internship.duration || "",
                stipend:
                    internship.stipend !== null &&
                        internship.stipend !== undefined
                        ? internship.stipend
                        : "",
                minimum_cgpa:
                    internship.minimum_cgpa !== null &&
                        internship.minimum_cgpa !== undefined
                        ? internship.minimum_cgpa
                        : "",
                eligible_degree:
                    internship.eligible_degree || "",
                eligible_branch:
                    internship.eligible_branch || "",
                application_deadline:
                    internship.application_deadline || ""
            });

            setError("");
        } catch (error) {
            console.error("Fetch internship error:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.company_name || !formData.role) {
            setError("Company name and role are required.");
            return;
        }

        try {
            setSaving(true);
            setError("");

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/admin/internships/${internship_id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        ...formData,
                        stipend:
                            formData.stipend === ""
                                ? null
                                : Number(formData.stipend),
                        minimum_cgpa:
                            formData.minimum_cgpa === ""
                                ? null
                                : Number(formData.minimum_cgpa)
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to update internship"
                );
            }

            alert("Internship updated successfully");

            navigate("/admin/internships");
        } catch (error) {
            console.error("Update internship error:", error);
            setError(error.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="internship-form-page">
                <div className="form-header">
                    <h1>Edit Internship</h1>
                </div>
                <SkeletonLoader type="form" />
            </div>
        );
    }

    return (
        <div className="internship-form-page">

            <header className="form-header">

                <div>
                    <h1>Edit Internship</h1>

                    <p>
                        Update internship #{internship_id}
                    </p>
                </div>

                <button
                    type="button"
                    className="form-back-btn"
                    onClick={() =>
                        navigate("/admin/internships")
                    }
                >
                    ← Back to Internships
                </button>

            </header>

            <form
                className="internship-form"
                onSubmit={handleSubmit}
            >

                <div className="form-section">

                    <div className="form-section-heading">
                        <h2>Basic Information</h2>
                        <p>
                            Update the company and internship details.
                        </p>
                    </div>

                    <div className="form-grid">

                        <div className="form-group">
                            <label>
                                Company Name <span>*</span>
                            </label>

                            <input
                                type="text"
                                name="company_name"
                                value={formData.company_name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                Role <span>*</span>
                            </label>

                            <input
                                type="text"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Description</label>

                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe the internship..."
                                rows="5"
                            />
                        </div>

                    </div>

                </div>

                <div className="form-section">

                    <div className="form-section-heading">
                        <h2>Internship Details</h2>
                        <p>
                            Update internship information.
                        </p>
                    </div>

                    <div className="form-grid">

                        <div className="form-group">
                            <label>Location</label>

                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Duration</label>

                            <input
                                type="text"
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Stipend</label>

                            <input
                                type="number"
                                name="stipend"
                                value={formData.stipend}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                            />
                        </div>

                        <div className="form-group">
                            <label>Minimum CGPA</label>

                            <input
                                type="number"
                                name="minimum_cgpa"
                                value={formData.minimum_cgpa}
                                onChange={handleChange}
                                min="0"
                                max="10"
                                step="0.01"
                            />
                        </div>

                    </div>

                </div>

                <div className="form-section">

                    <div className="form-section-heading">
                        <h2>Eligibility</h2>
                        <p>
                            Update eligibility requirements.
                        </p>
                    </div>

                    <div className="form-grid">

                        <div className="form-group">
                            <label>Eligible Degree</label>

                            <input
                                type="text"
                                name="eligible_degree"
                                value={formData.eligible_degree}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Eligible Branch</label>

                            <input
                                type="text"
                                name="eligible_branch"
                                value={formData.eligible_branch}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Application Deadline</label>

                            <input
                                type="date"
                                name="application_deadline"
                                value={formData.application_deadline}
                                onChange={handleChange}
                            />
                        </div>

                    </div>

                </div>

                {error && (
                    <div className="form-error">
                        {error}
                    </div>
                )}

                <div className="form-actions">

                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={() =>
                            navigate("/admin/internships")
                        }
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="save-btn"
                        disabled={saving}
                    >
                        {saving
                            ? "Saving Changes..."
                            : "Save Changes"}
                    </button>

                </div>

            </form>

        </div>
    );
}

export default EditInternship;

