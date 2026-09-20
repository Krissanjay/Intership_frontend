
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SkeletonLoader from "../components/SkeletonLoader";
import "../css/AdminDashboard.css";

function AdminDashboard() {
    const navigate = useNavigate();

    const [applications, setApplications] = useState([]);
    const [stats, setStats] = useState({});
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const token = localStorage.getItem("adminToken");

    useEffect(() => {
        if (!token) {
            navigate("/");
            return;
        }

        fetchApplications();
        fetchStats();
    }, []);

    const logout = () => {
        localStorage.removeItem("adminToken");
        navigate("/");
    };

    const fetchStats = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/admin/application-stats`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (data.success) {
                setStats(data.stats);
            }
        } catch (error) {
            console.error("Stats error:", error);
        }
    };

    const fetchApplications = async () => {
        try {
            setLoading(true);

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/admin/applications`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to fetch applications"
                );
            }

            setApplications(data.applications || []);
            setError("");
        } catch (error) {
            console.error("Applications error:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (applicationId, newStatus) => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/admin/applications/${applicationId}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        status: newStatus
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Failed to update status");
                return;
            }

            setApplications((previousApplications) =>
                previousApplications.map((application) =>
                    application.application_id === applicationId
                        ? {
                            ...application,
                            status: newStatus
                        }
                        : application
                )
            );

            fetchStats();
        } catch (error) {
            console.error("Status update error:", error);
            alert("Failed to update application status");
        }
    };

    const filteredApplications = applications.filter((application) => {
        const searchText = search.toLowerCase();

        const matchesSearch =
            application.student_name
                ?.toLowerCase()
                .includes(searchText) ||
            application.company_name
                ?.toLowerCase()
                .includes(searchText) ||
            application.role
                ?.toLowerCase()
                .includes(searchText);

        const matchesStatus =
            !statusFilter || application.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusClass = (status) => {
        switch (status) {
            case "Applied":
                return "status-applied";

            case "Shortlisted":
                return "status-shortlisted";

            case "Interview":
                return "status-interview";

            case "Selected":
                return "status-selected";

            case "Rejected":
                return "status-rejected";

            default:
                return "";
        }
    };

    if (loading) {
        return (
            <div className="admin-dashboard">
                <div className="admin-header">
                    <div>
                        <h1>Admin Dashboard</h1>
                        <p>Loading statistics...</p>
                    </div>
                </div>
                <SkeletonLoader type="card" count={4} />
                <div style={{ marginTop: "30px" }}>
                    <SkeletonLoader type="list" count={3} />
                </div>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">

            {/* Header */}
            <header className="admin-header">
                <div>
                    <h1>Admin Dashboard</h1>
                    <p>Manage internships and student applications</p>
                </div>

                <div className="admin-header-actions">
                    <button
                        className="manage-internships-btn"
                        onClick={() => navigate("/admin/internships")}
                    >
                        Manage Internships
                    </button>

                    <button
                        className="logout-btn"
                        onClick={logout}
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* Statistics */}
            <section className="stats-section">

                <div className="stat-card">
                    <div className="stat-icon">📋</div>
                    <div>
                        <p>Total Applications</p>
                        <h2>{stats.total_applications || 0}</h2>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">📝</div>
                    <div>
                        <p>Applied</p>
                        <h2>{stats.applied || 0}</h2>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">⭐</div>
                    <div>
                        <p>Shortlisted</p>
                        <h2>{stats.shortlisted || 0}</h2>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">🎤</div>
                    <div>
                        <p>Interview</p>
                        <h2>{stats.interview || 0}</h2>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">✅</div>
                    <div>
                        <p>Selected</p>
                        <h2>{stats.selected || 0}</h2>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">❌</div>
                    <div>
                        <p>Rejected</p>
                        <h2>{stats.rejected || 0}</h2>
                    </div>
                </div>

            </section>

            {/* Applications */}
            <section className="applications-section">

                <div className="section-heading">
                    <div>
                        <h2>Application Management</h2>
                        <p>
                            Review and manage student internship applications
                        </p>
                    </div>

                    <span className="application-count">
                        {filteredApplications.length} Applications
                    </span>
                </div>

                {/* Search / Filter */}
                <div className="filter-box">

                    <input
                        type="text"
                        placeholder="Search student, company or role..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        <option value="Applied">Applied</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Interview">Interview</option>
                        <option value="Selected">Selected</option>
                        <option value="Rejected">Rejected</option>
                    </select>

                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {/* Application Cards */}
                <div className="applications-list">

                    {filteredApplications.length === 0 ? (
                        <div className="no-applications">
                            <div>📭</div>
                            <h3>No applications found</h3>
                            <p>
                                Try changing your search or filter.
                            </p>
                        </div>
                    ) : (
                        filteredApplications.map((application) => (

                            <div
                                className="application-card"
                                key={application.application_id}
                            >

                                <div className="application-main">

                                    <div className="student-avatar">
                                        {application.student_name
                                            ?.charAt(0)
                                            .toUpperCase()}
                                    </div>

                                    <div className="application-info">

                                        <div className="application-title-row">
                                            <h3>
                                                {application.student_name}
                                            </h3>

                                            <span
                                                className={`status-badge ${getStatusClass(
                                                    application.status
                                                )}`}
                                            >
                                                {application.status}
                                            </span>
                                        </div>

                                        <p className="student-email">
                                            {application.student_email}
                                        </p>

                                        <div className="internship-info">

                                            <div>
                                                <span className="info-label">
                                                    Company
                                                </span>
                                                <strong>
                                                    {application.company_name}
                                                </strong>
                                            </div>

                                            <div>
                                                <span className="info-label">
                                                    Role
                                                </span>
                                                <strong>
                                                    {application.role}
                                                </strong>
                                            </div>

                                            <div>
                                                <span className="info-label">
                                                    Location
                                                </span>
                                                <strong>
                                                    {application.location || "N/A"}
                                                </strong>
                                            </div>

                                        </div>

                                    </div>

                                </div>

                                <div className="application-actions">

                                    <select
                                        value={application.status}
                                        onChange={(e) =>
                                            updateStatus(
                                                application.application_id,
                                                e.target.value
                                            )
                                        }
                                        className="status-select"
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

                                    <button
                                        className="view-details-btn"
                                        onClick={() =>
                                            navigate(
                                                `/admin/applications/${application.application_id}`
                                            )
                                        }
                                    >
                                        View Details
                                    </button>

                                </div>

                            </div>

                        ))
                    )}

                </div>

            </section>

        </div>
    );
}

export default AdminDashboard;

