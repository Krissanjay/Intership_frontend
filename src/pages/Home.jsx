import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../css/Home.css";
import Login from "./Login";
import AdminLogin from "./AdminLogin";

function Home() {
    const location = useLocation();
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

    useEffect(() => {
        if (location.state?.openLogin) {
            setIsLoginModalOpen(true);
        }
    }, [location.state]);

    return (
        <div className="home-container">
            <div className="home-content">
                <h1 className="home-title">Welcome to the Internship Portal</h1>
                <p className="home-subtitle">
                    Launch your career with the best internship opportunities or manage student applications seamlessly.
                </p>

                <div className="home-features">
                    <div className="feature-card">
                        <div className="feature-icon">🚀</div>
                        <h3>For Students</h3>
                        <p>Discover internships tailored to your skills, build your resume, and track applications easily.</p>
                        <button onClick={() => setIsLoginModalOpen(true)} className="home-btn student-btn" style={{ border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '1rem', width: '100%', boxSizing: 'border-box' }}>
                            Student Login
                        </button>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">💼</div>
                        <h3>For Administrators</h3>
                        <p>Post new opportunities, manage student profiles, and review applications efficiently.</p>
                        <button onClick={() => setIsAdminModalOpen(true)} className="home-btn admin-btn" style={{ border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '1rem', width: '100%', boxSizing: 'border-box' }}>
                            Admin Login
                        </button>
                    </div>
                </div>
            </div>
            
            {isLoginModalOpen && <Login onClose={() => setIsLoginModalOpen(false)} />}
            {isAdminModalOpen && <AdminLogin onClose={() => setIsAdminModalOpen(false)} />}
        </div>
    );
}

export default Home;
