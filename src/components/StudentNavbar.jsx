import { NavLink, useNavigate } from "react-router-dom";
import "../css/StudentNavbar.css";
import { useEffect, useState } from "react";

function StudentNavbar() {

    const navigate = useNavigate();

    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);

    let studentId = null;
    try {
        const studentStr = localStorage.getItem("student");
        if (studentStr && studentStr !== "undefined") {
            const student = JSON.parse(studentStr);
            studentId = student?.student_id || student?.id;
        }

        // Fallback: try to decode JWT token to get student_id
        if (!studentId) {
            const token = localStorage.getItem("token");
            if (token) {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                const decoded = JSON.parse(jsonPayload);
                studentId = decoded.sub; // Flask-JWT-Extended uses 'sub' for identity
            }
        }
    } catch (e) {
        console.error("Error getting student ID:", e);
    }

    // Fetch unread count
    useEffect(() => {

        if (!studentId) {
            console.log("No studentId found, skipping fetchUnreadCount");
            return;
        }

        const fetchUnreadCount = async () => {

            try {

                const token = localStorage.getItem("token");

                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/notifications/${studentId}/unread-count`,
                    {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                );

                const data = await response.json();

                if (data.success) {
                    setUnreadCount(data.unread_count);
                }

            } catch (error) {

                console.error(
                    "Error fetching notification count:",
                    error
                );

            }
        };

        fetchUnreadCount();

    }, [studentId]);


    // Fetch all notifications
    const fetchNotifications = async () => {

        if (!studentId) {
            return;
        }

        try {

            const token = localStorage.getItem("token");

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/notifications/${studentId}`,
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            const data = await response.json();

            if (data.success) {
                setNotifications(data.notifications);
            }

        } catch (error) {

            console.error(
                "Error fetching notifications:",
                error
            );

        }
    };


    // Notification bell click
    const handleNotificationClick = () => {

        const newState = !showNotifications;

        setShowNotifications(newState);

        if (newState) {
            fetchNotifications();
        }
    };


    // Mark notification as read
    const markAsRead = async (notificationId) => {

        try {

            const token = localStorage.getItem("token");

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/notifications/${notificationId}/read`,

                {
                    method: "PUT",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            const data = await response.json();

            if (data.success) {

                // Update notification in frontend
                setNotifications((previousNotifications) =>
                    previousNotifications.map((notification) =>
                        notification.id === notificationId
                            ? {
                                ...notification,
                                is_read: 1
                            }
                            : notification
                    )
                );

                // Reduce unread count
                setUnreadCount((previousCount) =>
                    previousCount > 0
                        ? previousCount - 1
                        : 0
                );
            }

        } catch (error) {

            console.error(
                "Error marking notification as read:",
                error
            );

        }
    };


    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("student");

        navigate("/login");
    };


    return (

        <nav className="student-navbar">

            <h2 className="student-navbar-brand">
                PM Internship Engine
            </h2>

            <div className="student-navbar-links">

                {/* Notification */}
                <div className="notification-container">

                    <button
                        className="notification-button"
                        type="button"
                        onClick={handleNotificationClick}
                    >
                        🔔

                        {unreadCount > 0 && (
                            <span className="notification-badge">
                                {unreadCount}
                            </span>
                        )}
                    </button>


                    {/* Notification Dropdown */}
                    {showNotifications && (

                        <div className="notification-dropdown">

                            <div className="notification-header">
                                Notifications
                            </div>


                            {notifications.length === 0 ? (

                                <div className="no-notifications">
                                    No notifications
                                </div>

                            ) : (

                                notifications.map((notification) => (

                                    <div
                                        key={notification.id}
                                        className={
                                            notification.is_read
                                                ? "notification-item read"
                                                : "notification-item unread"
                                        }
                                        onClick={() =>
                                            markAsRead(notification.id)
                                        }
                                    >

                                        <div className="notification-title">
                                            {notification.title}
                                        </div>

                                        <div className="notification-message">
                                            {notification.message}
                                        </div>

                                        <div className="notification-date">
                                            {new Date(
                                                notification.created_at
                                            ).toLocaleString()}
                                        </div>

                                    </div>

                                ))

                            )}

                        </div>

                    )}

                </div>


                <NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}>
                    Dashboard
                </NavLink>

                <NavLink to="/recommendations" className={({ isActive }) => isActive ? "active" : ""}>
                    Recommendations
                </NavLink>

                <NavLink to="/applications" className={({ isActive }) => isActive ? "active" : ""}>
                    Applications
                </NavLink>

                <NavLink to="/profile" className={({ isActive }) => isActive ? "active" : ""}>
                    Profile
                </NavLink>

                <NavLink to="/resume" className={({ isActive }) => isActive ? "active" : ""}>
                    Resume
                </NavLink>

                <button onClick={logout}>
                    Logout
                </button>

            </div>

        </nav>
    );
}

export default StudentNavbar;

