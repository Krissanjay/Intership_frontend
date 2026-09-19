import React from "react";
import "../css/SkeletonLoader.css";

const SkeletonLoader = ({ type = "card", count = 1 }) => {
    const renderSkeleton = () => {
        switch (type) {
            case "form":
                return (
                    <div className="skeleton-form">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} style={{ marginBottom: "20px" }}>
                                <div className="skeleton-item skeleton-label"></div>
                                <div className="skeleton-item skeleton-input"></div>
                            </div>
                        ))}
                        <div className="skeleton-item skeleton-button"></div>
                    </div>
                );
            case "list":
                return (
                    <div className="skeleton-wrapper">
                        {[...Array(count)].map((_, i) => (
                            <div key={i} className="skeleton-list-item">
                                <div className="skeleton-text-group">
                                    <div className="skeleton-item skeleton-title" style={{ width: "30%" }}></div>
                                    <div className="skeleton-item skeleton-text" style={{ width: "60%" }}></div>
                                </div>
                                <div className="skeleton-item skeleton-badge"></div>
                            </div>
                        ))}
                    </div>
                );
            case "card":
            default:
                return (
                    <div className="dashboard-grid">
                        {[...Array(count)].map((_, i) => (
                            <div key={i} className="skeleton-card">
                                <div className="skeleton-item skeleton-title"></div>
                                <div className="skeleton-item skeleton-text"></div>
                                <div className="skeleton-item skeleton-text short"></div>
                            </div>
                        ))}
                    </div>
                );
        }
    };

    return <>{renderSkeleton()}</>;
};

export default SkeletonLoader;
