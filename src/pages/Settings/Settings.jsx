import { useNavigate } from "react-router-dom";
import "./Settings.css";

const settingsLinks = [
  {
    path: "/profile",
    icon: "bi-person",
    title: "Profile",
    description: "Personalize the name shown in your account.",
  },
  {
    path: "/favorites",
    icon: "bi-star",
    title: "Saved routes",
    description: "View and manage routes you have saved.",
  },
  {
    path: "/frequent-trips",
    icon: "bi-arrow-repeat",
    title: "Frequent trips",
    description: "Quickly revisit trips you have started before.",
  },
  {
    path: "/trip-planner",
    icon: "bi-journal-text",
    title: "Trip planner",
    description: "Manage your planned trips and transfer notes.",
  },
];

function Settings() {
  const navigate = useNavigate();

  return (
    <div className="settings-page">
      <header className="settings-header">
        <button className="settings-back-button" onClick={() => navigate("/")}>
          <i className="bi bi-arrow-left" aria-hidden="true"></i>
          Home
        </button>

        <div className="settings-title">
          <div className="settings-title-icon">
            <i className="bi bi-gear-fill" aria-hidden="true"></i>
          </div>
          <div>
            <p>YOUR APP</p>
            <h1>Settings</h1>
          </div>
        </div>
      </header>

      <main className="settings-content">
        <section className="settings-section">
          <h2>Account and trips</h2>
          <div className="settings-links">
            {settingsLinks.map((item) => (
              <button
                className="settings-link"
                key={item.path}
                onClick={() => navigate(item.path)}
              >
                <span className="settings-link-icon">
                  <i className={`bi ${item.icon}`} aria-hidden="true"></i>
                </span>
                <span className="settings-link-copy">
                  <strong>{item.title}</strong>
                  <small>{item.description}</small>
                </span>
                <i className="bi bi-chevron-right" aria-hidden="true"></i>
              </button>
            ))}
          </div>
        </section>

        <p className="settings-note">
          <i className="bi bi-info-circle" aria-hidden="true"></i>
          Your profile, saved routes, and trip plans are stored on this device.
        </p>
      </main>
    </div>
  );
}

export default Settings;
