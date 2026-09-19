import { Link } from "react-router-dom";
import "../css/Home.css";

function Home() {
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
                        <Link to="/login" className="home-btn student-btn">
                            Student Login
                        </Link>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">💼</div>
                        <h3>For Administrators</h3>
                        <p>Post new opportunities, manage student profiles, and review applications efficiently.</p>
                        <Link to="/admin" className="home-btn admin-btn">
                            Admin Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
