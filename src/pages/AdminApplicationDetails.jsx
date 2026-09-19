import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function AdminApplicationDetails() {

    const { applicationId } = useParams();
    const navigate = useNavigate();

    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const token = localStorage.getItem("adminToken");

    const fetchApplicationDetails = async () => {

        try {

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/admin/applications/${applicationId}`,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (response.ok && data.success) {

                setApplication(data.application);

            } else {

                setError(
                    data.message ||
                    "Failed to load application details"
                );

            }

        } catch (error) {

            console.error(
                "Error fetching application details:",
                error
            );

            setError(
                "Unable to connect to backend"
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {

        fetchApplicationDetails();

    }, [applicationId]);

    const updateStatus = async (status) => {

        try {

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/admin/applications/${applicationId}/status`,
                {
                    method: "PATCH",

                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        status: status
                    })
                }
            );

            const data = await response.json();

            if (response.ok && data.success) {

                alert("Status updated successfully");

                setApplication((previous) => ({
                    ...previous,
                    status: status
                }));

            } else {

                alert(
                    data.message ||
                    "Failed to update status"
                );

            }

        } catch (error) {

            console.error(error);

            alert(
                "Unable to connect to backend"
            );

        }
    };

    if (loading) {

        return (
            <div style={{
                padding: "40px",
                textAlign: "center"
            }}>
                <h2>Loading application details...</h2>
            </div>
        );

    }

    if (error) {

        return (
            <div style={{
                padding: "40px"
            }}>

                <h2>
                    Application Details
                </h2>

                <p style={{
                    color: "red"
                }}>
                    {error}
                </p>

                <button
                    onClick={() =>
                        navigate("/admin")
                    }
                    style={{
                        padding: "10px 20px",
                        cursor: "pointer"
                    }}
                >
                    Back to Applications
                </button>

            </div>
        );

    }

    if (!application) {
        return null;
    }

    return (

        <div style={{
            padding: "30px",
            maxWidth: "1100px",
            margin: "0 auto"
        }}>

            {/* Header */}

            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "30px"
            }}>

                <h1>
                    Application Details
                </h1>

                <button
                    onClick={() =>
                        navigate("/admin")
                    }
                    style={{
                        padding: "10px 18px",
                        border: "1px solid #ccc",
                        borderRadius: "6px",
                        background: "white",
                        cursor: "pointer"
                    }}
                >
                    ← Back to Applications
                </button>

            </div>


            {/* Application Information */}

            <div style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "25px",
                marginBottom: "25px"
            }}>

                <h2>
                    Application Information
                </h2>

                <div style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "20px",
                    marginTop: "20px"
                }}>

                    <div>
                        <strong>
                            Application ID
                        </strong>

                        <p>
                            #{application.application_id}
                        </p>
                    </div>

                    <div>
                        <strong>
                            Status
                        </strong>

                        <div style={{
                            marginTop: "8px"
                        }}>

                            <select
                                value={application.status}
                                onChange={(e) =>
                                    updateStatus(
                                        e.target.value
                                    )
                                }
                                style={{
                                    padding: "10px",
                                    borderRadius: "6px",
                                    border: "1px solid #ccc"
                                }}
                            >

                                <option value="Applied">
                                    Applied
                                </option>

                                <option value="Shortlisted">
                                    Shortlisted
                                </option>

                                <option value="Interview">
                                    Interview
                                </option>

                                <option value="Selected">
                                    Selected
                                </option>

                                <option value="Rejected">
                                    Rejected
                                </option>

                            </select>

                        </div>
                    </div>

                    <div>
                        <strong>
                            Applied At
                        </strong>

                        <p>
                            {application.applied_at
                                ? new Date(
                                    application.applied_at
                                ).toLocaleString()
                                : "N/A"}
                        </p>
                    </div>

                    <div>
                        <strong>
                            Last Updated
                        </strong>

                        <p>
                            {application.updated_at
                                ? new Date(
                                    application.updated_at
                                ).toLocaleString()
                                : "N/A"}
                        </p>
                    </div>

                </div>

            </div>


            {/* Student Information */}

            <div style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "25px",
                marginBottom: "25px"
            }}>

                <h2>
                    Student Information
                </h2>

                <div style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "20px",
                    marginTop: "20px"
                }}>

                    <div>
                        <strong>
                            Student ID
                        </strong>

                        <p>
                            {application.student_id}
                        </p>
                    </div>

                    <div>
                        <strong>
                            Name
                        </strong>

                        <p>
                            {application.student_name}
                        </p>
                    </div>

                    <div>
                        <strong>
                            Email
                        </strong>

                        <p>
                            {application.student_email}
                        </p>
                    </div>

                </div>

            </div>


            {/* Internship Information */}

            <div style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "25px",
                marginBottom: "25px"
            }}>

                <h2>
                    Internship Information
                </h2>

                <div style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "20px",
                    marginTop: "20px"
                }}>

                    <div>
                        <strong>
                            Internship ID
                        </strong>

                        <p>
                            {application.internship_id}
                        </p>
                    </div>

                    <div>
                        <strong>
                            Company
                        </strong>

                        <p>
                            {application.company_name}
                        </p>
                    </div>

                    <div>
                        <strong>
                            Role
                        </strong>

                        <p>
                            {application.role}
                        </p>
                    </div>

                    <div>
                        <strong>
                            Location
                        </strong>

                        <p>
                            {application.location || "N/A"}
                        </p>
                    </div>

                    <div>
                        <strong>
                            Duration
                        </strong>

                        <p>
                            {application.duration || "N/A"}
                        </p>
                    </div>

                    <div>
                        <strong>
                            Stipend
                        </strong>

                        <p>
                            {application.stipend !== null
                                ? `₹${application.stipend}`
                                : "N/A"}
                        </p>
                    </div>

                    <div>
                        <strong>
                            Minimum CGPA
                        </strong>

                        <p>
                            {application.minimum_cgpa || "N/A"}
                        </p>
                    </div>

                    <div>
                        <strong>
                            Eligible Degree
                        </strong>

                        <p>
                            {application.eligible_degree || "N/A"}
                        </p>
                    </div>

                    <div>
                        <strong>
                            Eligible Branch
                        </strong>

                        <p>
                            {application.eligible_branch || "N/A"}
                        </p>
                    </div>

                    <div>
                        <strong>
                            Application Deadline
                        </strong>

                        <p>
                            {application.application_deadline
                                ? new Date(
                                    application.application_deadline
                                ).toLocaleDateString()
                                : "N/A"}
                        </p>
                    </div>

                </div>

            </div>


            {/* Internship Description */}

            <div style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "25px"
            }}>

                <h2>
                    Internship Description
                </h2>

                <p style={{
                    marginTop: "15px",
                    lineHeight: "1.7"
                }}>
                    {application.description ||
                        "No description available."}
                </p>

            </div>

        </div>
    );
}

export default AdminApplicationDetails;