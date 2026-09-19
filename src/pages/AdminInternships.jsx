
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/AdminInternships.css";

const AdminInternships = () => {

    const navigate = useNavigate();

    const [internships, setInternships] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ============================================
    // FETCH ALL INTERNSHIPS
    // ============================================

    const fetchInternships = async () => {

        try {

            setLoading(true);
            setError("");

            const token = localStorage.getItem("adminToken");

            if (!token) {
                navigate("/admin");
                return;
            }

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/admin/internships`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {

                if (response.status === 401) {
                    localStorage.removeItem("adminToken");
                    navigate("/admin");
                    return;
                }

                throw new Error(
                    data.message || "Failed to fetch internships"
                );
            }

            // Convert is_active to number
            // This prevents "0" from being treated as true.
            const formattedInternships =
                (data.internships || []).map((internship) => ({
                    ...internship,
                    is_active: Number(internship.is_active)
                }));

            setInternships(formattedInternships);

        } catch (error) {

            console.error(
                "Fetch internships error:",
                error
            );

            setError(
                error.message ||
                "Unable to load internships."
            );

        } finally {

            setLoading(false);
        }
    };

    // ============================================
    // LOAD DATA
    // ============================================

    useEffect(() => {
        fetchInternships();
    }, []);

    // ============================================
    // DELETE INTERNSHIP
    // ============================================

    const deleteInternship = async (internshipId) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this internship?\n\n" +
            "If students have already applied, the internship cannot be deleted."
        );

        if (!confirmDelete) {
            return;
        }

        try {

            const token = localStorage.getItem("adminToken");

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/admin/internships/${internshipId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            console.log("Delete internship response:", data);

            if (!response.ok) {

                if (response.status === 401) {
                    localStorage.removeItem("adminToken");
                    navigate("/admin");
                    return;
                }

                if (data.application_count > 0) {

                    alert(
                        `${data.message}\n\n` +
                        `Existing applications: ${data.application_count}`
                    );

                } else {

                    alert(
                        data.message ||
                        "Failed to delete internship"
                    );
                }

                return;
            }

            alert(
                data.message ||
                "Internship deleted successfully"
            );

            // Remove internship from current state
            setInternships((previousInternships) =>
                previousInternships.filter(
                    (internship) =>
                        internship.internship_id !== internshipId
                )
            );

        } catch (error) {

            console.error(
                "Delete internship error:",
                error
            );

            alert(
                "Unable to delete internship. Please check the server."
            );
        }
    };

    // ============================================
    // ARCHIVE / ACTIVATE INTERNSHIP
    // ============================================

    const updateInternshipStatus = async (
        internshipId,
        newStatus
    ) => {

        const action =
            newStatus === 1
                ? "activate"
                : "archive";

        const confirmAction = window.confirm(
            `Are you sure you want to ${action} this internship?`
        );

        if (!confirmAction) {
            return;
        }

        try {

            const token = localStorage.getItem("adminToken");

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/admin/internships/${internshipId}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        is_active: newStatus
                    })
                }
            );

            const data = await response.json();

            console.log(
                "Status API response:",
                response.status
            );

            console.log(
                "Status API data:",
                data
            );

            if (!response.ok) {

                if (response.status === 401) {
                    localStorage.removeItem("adminToken");
                    navigate("/admin");
                    return;
                }

                alert(
                    data.message ||
                    "Failed to update internship status"
                );

                return;
            }

            // Update internship in React state
            setInternships((previousInternships) =>
                previousInternships.map((internship) =>
                    internship.internship_id === internshipId
                        ? {
                            ...internship,
                            is_active: Number(
                                data.is_active
                            )
                        }
                        : internship
                )
            );

            alert(
                data.message ||
                "Internship status updated successfully"
            );

        } catch (error) {

            console.error(
                "Update internship status error:",
                error
            );

            alert(
                "Frontend error: " +
                error.message
            );
        }
    };

    // ============================================
    // LOGOUT
    // ============================================

    const handleLogout = () => {

        localStorage.removeItem("adminToken");

        navigate("/admin");
    };

    // ============================================
    // FILTER INTERNSHIPS
    // ============================================

    const filteredInternships = internships.filter(
        (internship) => {

            const search =
                searchTerm.toLowerCase().trim();

            const matchesSearch =
                internship.company_name
                    ?.toLowerCase()
                    .includes(search) ||

                internship.role
                    ?.toLowerCase()
                    .includes(search) ||

                internship.location
                    ?.toLowerCase()
                    .includes(search);

            const isActive =
                Number(internship.is_active) === 1;

            const matchesStatus =
                statusFilter === "all" ||

                (
                    statusFilter === "active" &&
                    isActive
                ) ||

                (
                    statusFilter === "archived" &&
                    !isActive
                );

            return (
                matchesSearch &&
                matchesStatus
            );
        }
    );

    // ============================================
    // COUNTS
    // ============================================

    const totalInternships =
        internships.length;

    const activeInternships =
        internships.filter(
            (internship) =>
                Number(internship.is_active) === 1
        ).length;

    const archivedInternships =
        internships.filter(
            (internship) =>
                Number(internship.is_active) === 0
        ).length;

    const locations = new Set(
        internships
            .map((internship) => internship.location)
            .filter(Boolean)
    ).size;

    // ============================================
    // LOADING
    // ============================================

    if (loading) {

        return (
            <div className="admin-internships-page">

                <div className="admin-loading">

                    <div className="loading-spinner"></div>

                    <p>
                        Loading internships...
                    </p>

                </div>

            </div>
        );
    }

    // ============================================
    // PAGE
    // ============================================

    return (
        <div className="admin-internships-page">

            {/* ========================================
                HEADER
            ======================================== */}

            <div className="admin-internships-header">

                <div>

                    <h1>
                        Manage Internships
                    </h1>

                    <p>
                        Add, edit, archive and manage
                        internship opportunities.
                    </p>

                </div>

                <div className="admin-header-actions">

                    <button
                        className="btn-dashboard"
                        onClick={() =>
                            navigate("/admin-dashboard")
                        }
                    >
                        Dashboard
                    </button>

                    <button
                        className="btn-add-internship"
                        onClick={() =>
                            navigate("/admin/internships/add")
                        }
                    >
                        + Add Internship
                    </button>

                    <button
                        className="btn-logout"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </div>


            {/* ========================================
                ERROR
            ======================================== */}

            {error && (

                <div className="admin-error">

                    <strong>
                        Error:
                    </strong>{" "}

                    {error}

                    <button
                        onClick={fetchInternships}
                    >
                        Try Again
                    </button>

                </div>

            )}


            {/* ========================================
                SUMMARY CARDS
            ======================================== */}

            <div className="internship-summary">

                <div className="summary-card">

                    <div className="summary-label">
                        Total Internships
                    </div>

                    <div className="summary-value">
                        {totalInternships}
                    </div>

                </div>


                <div className="summary-card">

                    <div className="summary-label">
                        Active
                    </div>

                    <div className="summary-value active-count">
                        {activeInternships}
                    </div>

                </div>


                <div className="summary-card">

                    <div className="summary-label">
                        Archived
                    </div>

                    <div className="summary-value archived-count">
                        {archivedInternships}
                    </div>

                </div>


                <div className="summary-card">

                    <div className="summary-label">
                        Locations
                    </div>

                    <div className="summary-value">
                        {locations}
                    </div>

                </div>


                <div className="summary-card">

                    <div className="summary-label">
                        Showing
                    </div>

                    <div className="summary-value">
                        {filteredInternships.length}
                    </div>

                </div>

            </div>


            {/* ========================================
                SEARCH + FILTER
            ======================================== */}

            <div className="internship-controls">

                <div className="search-box">

                    <input
                        type="text"
                        placeholder="Search by company, role or location..."
                        value={searchTerm}
                        onChange={(event) =>
                            setSearchTerm(
                                event.target.value
                            )
                        }
                    />

                </div>


                <div className="status-filter">

                    <button
                        className={
                            statusFilter === "all"
                                ? "filter-btn active"
                                : "filter-btn"
                        }
                        onClick={() =>
                            setStatusFilter("all")
                        }
                    >
                        All
                    </button>

                    <button
                        className={
                            statusFilter === "active"
                                ? "filter-btn active"
                                : "filter-btn"
                        }
                        onClick={() =>
                            setStatusFilter("active")
                        }
                    >
                        Active
                    </button>

                    <button
                        className={
                            statusFilter === "archived"
                                ? "filter-btn active"
                                : "filter-btn"
                        }
                        onClick={() =>
                            setStatusFilter("archived")
                        }
                    >
                        Archived
                    </button>

                </div>

            </div>


            {/* ========================================
                NO RESULTS
            ======================================== */}

            {filteredInternships.length === 0 ? (

                <div className="no-internships">

                    <h2>
                        No internships found
                    </h2>

                    <p>
                        {searchTerm
                            ? "Try a different search term."
                            : "There are currently no internships."
                        }
                    </p>

                    {!searchTerm && (
                        <button
                            className="btn-add-internship"
                            onClick={() =>
                                navigate(
                                    "/admin/internships/add"
                                )
                            }
                        >
                            + Add Internship
                        </button>
                    )}

                </div>

            ) : (

                /* ========================================
                   INTERNSHIP GRID
                ======================================== */

                <div className="internship-grid">

                    {filteredInternships.map(
                        (internship) => {

                            const isActive =
                                Number(
                                    internship.is_active
                                ) === 1;

                            return (

                                <div
                                    className={
                                        isActive
                                            ? "internship-card"
                                            : "internship-card archived-card"
                                    }
                                    key={
                                        internship.internship_id
                                    }
                                >

                                    {/* CARD HEADER */}

                                    <div className="internship-card-header">

                                        <div>

                                            <span className="internship-role">
                                                {internship.role}
                                            </span>

                                            <h2>
                                                {
                                                    internship.company_name
                                                }
                                            </h2>

                                        </div>

                                        <span
                                            className={
                                                isActive
                                                    ? "internship-status active"
                                                    : "internship-status archived"
                                            }
                                        >
                                            {isActive
                                                ? "Active"
                                                : "Archived"}
                                        </span>

                                    </div>


                                    {/* ID */}

                                    <div className="internship-id">

                                        Internship ID:{" "}

                                        <strong>
                                            {
                                                internship.internship_id
                                            }
                                        </strong>

                                    </div>


                                    {/* DESCRIPTION */}

                                    {internship.description && (

                                        <p className="internship-description">

                                            {
                                                internship.description
                                            }

                                        </p>

                                    )}


                                    {/* DETAILS */}

                                    <div className="internship-details">

                                        {internship.location && (

                                            <div className="detail-item">

                                                <span className="detail-label">
                                                    Location
                                                </span>

                                                <span className="detail-value">
                                                    {
                                                        internship.location
                                                    }
                                                </span>

                                            </div>

                                        )}


                                        {internship.duration && (

                                            <div className="detail-item">

                                                <span className="detail-label">
                                                    Duration
                                                </span>

                                                <span className="detail-value">
                                                    {
                                                        internship.duration
                                                    }
                                                </span>

                                            </div>

                                        )}


                                        {internship.stipend !== null &&
                                            internship.stipend !== undefined && (

                                                <div className="detail-item">

                                                    <span className="detail-label">
                                                        Stipend
                                                    </span>

                                                    <span className="detail-value">
                                                        ₹
                                                        {
                                                            Number(
                                                                internship.stipend
                                                            ).toLocaleString(
                                                                "en-IN"
                                                            )
                                                        }
                                                    </span>

                                                </div>

                                            )}


                                        {internship.minimum_cgpa !== null &&
                                            internship.minimum_cgpa !== undefined && (

                                                <div className="detail-item">

                                                    <span className="detail-label">
                                                        Minimum CGPA
                                                    </span>

                                                    <span className="detail-value">
                                                        {
                                                            internship.minimum_cgpa
                                                        }
                                                    </span>

                                                </div>

                                            )}


                                        {internship.eligible_degree && (

                                            <div className="detail-item">

                                                <span className="detail-label">
                                                    Degree
                                                </span>

                                                <span className="detail-value">
                                                    {
                                                        internship.eligible_degree
                                                    }
                                                </span>

                                            </div>

                                        )}


                                        {internship.eligible_branch && (

                                            <div className="detail-item">

                                                <span className="detail-label">
                                                    Branch
                                                </span>

                                                <span className="detail-value">
                                                    {
                                                        internship.eligible_branch
                                                    }
                                                </span>

                                            </div>

                                        )}


                                        {internship.application_deadline && (

                                            <div className="detail-item">

                                                <span className="detail-label">
                                                    Application Deadline
                                                </span>

                                                <span className="detail-value">
                                                    {
                                                        internship.application_deadline
                                                    }
                                                </span>

                                            </div>

                                        )}

                                    </div>


                                    {/* ACTIONS */}

                                    <div className="internship-actions">

                                        <button
                                            className="btn-edit"
                                            onClick={() =>
                                                navigate(
                                                    `/admin/internships/${internship.internship_id}/edit`
                                                )
                                            }
                                        >
                                            Edit
                                        </button>


                                        <button
                                            className={
                                                isActive
                                                    ? "btn-archive"
                                                    : "btn-activate"
                                            }
                                            onClick={() =>
                                                updateInternshipStatus(
                                                    internship.internship_id,
                                                    isActive
                                                        ? 0
                                                        : 1
                                                )
                                            }
                                        >
                                            {isActive
                                                ? "Archive"
                                                : "Activate"}
                                        </button>


                                        <button
                                            className="btn-delete"
                                            onClick={() =>
                                                deleteInternship(
                                                    internship.internship_id
                                                )
                                            }
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </div>

                            );
                        }
                    )}

                </div>

            )}

        </div>
    );
};

export default AdminInternships;

