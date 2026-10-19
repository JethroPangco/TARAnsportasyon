import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import "./Home.css";

const commuteOptions = [
  {
    path: "/route-input",
    icon: "bi-signpost-2",
    title: "Help me find a route",
    description: "We'll suggest routes and PUVs based on where you're going.",
    variant: "primary",
  },
  {
    path: "/city-filter",
    icon: "bi-bus-front",
    title: "I know what to ride",
    description: "Choose your city, transportation mode, and route manually.",
    variant: "secondary",
  },
];

const quickAccessItems = [
  { path: "/favorites", icon: "bi-star", label: "Favorites" },
  { path: "/trip-planner", icon: "bi-journal-text", label: "Trip Planner" },
  { path: "/frequent-trips", icon: "bi-arrow-repeat", label: "Frequent Trips" },
];

const bottomNavItems = [
  { path: "/", icon: "bi-house-fill", label: "Home" },
  { path: "/map", icon: "bi-map", label: "Map" },
  { path: "/favorites", icon: "bi-star", label: "Favorites" },
  { path: "/trip-planner", icon: "bi-journal-text", label: "Trips" },
  { path: "/profile", icon: "bi-person", label: "Profile" },
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function handleMapNav(navigate) {
  const hasActiveTrip = localStorage.getItem("tara_active_trip");
  navigate(hasActiveTrip ? "/map" : "/route-input");
}

function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="home-page">
      <Navbar />

      <main className="home-content">
        <section className="welcome-section">
          <h1>
            {getGreeting()}! <span aria-hidden="true"></span>
          </h1>

          <p className="welcome-subtitle">
            How would you like to commute today?
          </p>
        </section>

        <section className="commute-options">
          {commuteOptions.map((option) => (
            <button
              key={option.path}
              className={`commute-card commute-card--${option.variant}`}
              onClick={() => navigate(option.path)}
            >
              <div className="commute-icon">
                <i className={`bi ${option.icon}`} aria-hidden="true"></i>
              </div>

              <div className="commute-information">
                <div className="commute-title-row">
                  <h2>{option.title}</h2>
                  <i className="bi bi-arrow-right" aria-hidden="true"></i>
                </div>

                <p>{option.description}</p>
              </div>
            </button>
          ))}
        </section>

        <section className="quick-access">
          <div className="section-heading">
            <h2>Quick Access</h2>
            <p>Get back to your frequently used trips.</p>
          </div>

          <div className="quick-grid">
            {quickAccessItems.map((item) => (
              <button
                key={item.path}
                className="quick-card"
                onClick={() => navigate(item.path)}
              >
                <div className="quick-icon">
                  <i className={`bi ${item.icon}`} aria-hidden="true"></i>
                </div>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </section>
      </main>

      <nav className="bottom-navbar" aria-label="Primary">
        {bottomNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              className={`bottom-nav-item ${isActive ? "active" : ""}`}
              onClick={() =>
                item.path === "/map"
                  ? handleMapNav(navigate)
                  : navigate(item.path)
              }
              aria-current={isActive ? "page" : undefined}
            >
              <i className={`bi ${item.icon}`} aria-hidden="true"></i>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export default Home;