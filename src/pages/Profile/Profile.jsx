import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

function loadProfileName() {
  return localStorage.getItem("tara_profile_name") || "";
}

function countFavorites() {
  try {
    const stored = JSON.parse(localStorage.getItem("tara_favorites") || "{}");
    return Object.keys(stored).length;
  } catch {
    return 0;
  }
}

function loadActiveTrip() {
  try {
    return JSON.parse(localStorage.getItem("tara_active_trip") || "null");
  } catch {
    return null;
  }
}

function Profile() {
  const navigate = useNavigate();

  const [name, setName] = useState(loadProfileName);
  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState(name);

  const favoritesCount = countFavorites();
  const activeTrip = loadActiveTrip();

  function handleStartEdit() {
    setDraftName(name);
    setIsEditing(true);
  }

  function handleSaveName() {
    const trimmed = draftName.trim();
    setName(trimmed);
    if (trimmed) {
      localStorage.setItem("tara_profile_name", trimmed);
    } else {
      localStorage.removeItem("tara_profile_name");
    }
    setIsEditing(false);
  }

  function handleCancelEdit() {
    setIsEditing(false);
  }

  const menuItems = [
    { icon: "bi-star", label: "Favorites", path: "/favorites" },
    { icon: "bi-journal-text", label: "Trip Planner", path: "/trip-planner" },
    { icon: "bi-arrow-repeat", label: "Frequent Trips", path: "/frequent-trips" },
    { icon: "bi-gear", label: "Settings", path: "/settings" },
  ];

  return (
    <div className="profile-page">
      <header className="profile-header">
        <button
          className="profile-back-button"
          onClick={() => navigate("/")}
          aria-label="Go back"
        >
          <i className="bi bi-arrow-left" aria-hidden="true"></i>
          Back
        </button>
      </header>

      <main className="profile-content">
        <section className="profile-identity-card">
          <div className="profile-avatar">
            <i className="bi bi-person-fill" aria-hidden="true"></i>
          </div>

          {isEditing ? (
            <div className="profile-name-edit">
              <input
                type="text"
                value={draftName}
                onChange={(event) => setDraftName(event.target.value)}
                placeholder="Enter your name"
                autoFocus
              />

              <div className="profile-name-edit-actions">
                <button className="profile-name-save" onClick={handleSaveName}>
                  <i className="bi bi-check-lg" aria-hidden="true"></i>
                  Save
                </button>
                <button className="profile-name-cancel" onClick={handleCancelEdit}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="profile-name-display">
              <h1>{name || "TARA Commuter"}</h1>
              <button
                className="profile-edit-button"
                onClick={handleStartEdit}
                aria-label="Edit name"
              >
                <i className="bi bi-pencil" aria-hidden="true"></i>
                Edit name
              </button>
            </div>
          )}
        </section>

        <section className="profile-stats">
          <div className="profile-stat-card">
            <div className="profile-stat-icon">
              <i className="bi bi-star-fill" aria-hidden="true"></i>
            </div>
            <div>
              <span>Saved Routes</span>
              <strong>{favoritesCount}</strong>
            </div>
          </div>

          <div className="profile-stat-card">
            <div className="profile-stat-icon">
              <i
                className={`bi ${activeTrip ? "bi-broadcast-pin" : "bi-check-circle"}`}
                aria-hidden="true"
              ></i>
            </div>
            <div>
              <span>Trip Status</span>
              <strong>{activeTrip ? "In progress" : "No active trip"}</strong>
            </div>
          </div>
        </section>

        {activeTrip && (
          <section
            className="profile-active-trip-card"
            role="button"
            tabIndex={0}
            onClick={() => navigate("/map")}
            onKeyDown={(event) => {
              if (event.key === "Enter") navigate("/map");
            }}
          >
            <div className="profile-active-trip-icon">
              <i className="bi bi-bus-front-fill" aria-hidden="true"></i>
            </div>

            <div className="profile-active-trip-info">
              <span>ACTIVE TRIP</span>
              <strong>
                {activeTrip.from} → {activeTrip.to}
              </strong>
            </div>

            <i className="bi bi-arrow-right" aria-hidden="true"></i>
          </section>
        )}

        <section className="profile-menu">
          {menuItems.map((item) => (
            <button
              key={item.path}
              className="profile-menu-item"
              onClick={() => navigate(item.path)}
            >
              <div className="profile-menu-icon">
                <i className={`bi ${item.icon}`} aria-hidden="true"></i>
              </div>
              <span>{item.label}</span>
              <i className="bi bi-chevron-right" aria-hidden="true"></i>
            </button>
          ))}
        </section>
      </main>
    </div>
  );
}

export default Profile;