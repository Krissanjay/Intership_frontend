
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/InternshipForm.css";

function AddInternship() {
    const navigate = useNavigate();

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

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const token = localStorage.getItem("adminToken");

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
            setLoading(true);
            setError("");

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/admin/internships`,
                {
                    method: "POST",
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
                    data.message || "Failed to add internship"
                );
            }

            alert("Internship added successfully");

            navigate("/admin/internships");
        } catch (error) {
            console.error("Add internship error:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="internship-form-page">

            <header className="form-header">

                <div>
                    <h1>Add Internship</h1>

                    <p>
                        Create a new internship opportunity
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
                            Enter the company and internship details.
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
                                placeholder="e.g. ABC Technologies"
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
                                placeholder="e.g. Frontend Developer Intern"
                                required
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Description</label>

                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe the internship role, responsibilities and requirements..."
                                rows="5"
                            />
                        </div>

                    </div>

                </div>

                <div className="form-section">

                    <div className="form-section-heading">
                        <h2>Internship Details</h2>
                        <p>
                            Provide information about the internship.
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
                                placeholder="e.g. Kochi"
                            />
                        </div>

                        <div className="form-group">
                            <label>Duration</label>

                            <input
                                type="text"
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                placeholder="e.g. 6 Months"
                            />
                        </div>

                        <div className="form-group">
                            <label>Stipend</label>

                            <input
                                type="number"
                                name="stipend"
                                value={formData.stipend}
                                onChange={handleChange}
                                placeholder="e.g. 15000"
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
                                placeholder="e.g. 7.5"
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
                            Specify who can apply for this internship.
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
                                placeholder="e.g. B.Tech, BCA"
                            />
                        </div>

                        <div className="form-group">
                            <label>Eligible Branch</label>

                            <input
                                type="text"
                                name="eligible_branch"
                                value={formData.eligible_branch}
                                onChange={handleChange}
                                placeholder="e.g. CSE, IT"
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
                        disabled={loading}
                    >
                        {loading
                            ? "Adding Internship..."
                            : "Add Internship"}
                    </button>

                </div>

            </form>

        </div>
    );
}

export default AddInternship;
