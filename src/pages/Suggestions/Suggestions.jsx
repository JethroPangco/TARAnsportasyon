import { useLocation, useNavigate } from "react-router-dom";
import "./Suggestions.css";

function Suggestions() {
  const navigate = useNavigate();
  const location = useLocation();

  const { from, to, city, flow = "home" } = location.state || {};

  if (!from || !to) {
    return (
      <div className="suggestions-page">
        <div className="suggestions-error">
          <div className="error-icon">
            <i className="bi bi-exclamation-circle" aria-hidden="true"></i>
          </div>

          <h2>Route information not found</h2>

          <p>Please enter your starting location first.</p>

          <button
            className="primary-button"
            onClick={() => navigate("/route-input")}
          >
            <i className="bi bi-arrow-left" aria-hidden="true"></i>
            Go to Route Input
          </button>
        </div>
      </div>
    );
  }

  const suggestedRoutes = [
    {
      id: 1,
      type: "Recommended",
      typeIcon: "bi-lightning-charge-fill",
      title: "Option 1",
      mode: "Bus",
      modeIcon: "bi-bus-front-fill",
      route: `${from} → Cubao → ${to}`,
      time: "35–45 min",
      fare: "₱25–₱35",
      description: "Faster option with fewer transfers.",
      tag: "Fastest",
    },
    {
      id: 2,
      type: "Lower Cost",
      typeIcon: "bi-wallet2",
      title: "Option 2",
      mode: "Jeepney",
      modeIcon: "bi-truck-front-fill",
      route: `${from} → Cubao → ${to}`,
      time: "45–55 min",
      fare: "₱15–₱25",
      description: "More affordable option with slightly longer travel time.",
      tag: "Cheaper",
    },
  ];

  function handleBack() {
    navigate("/route-input", {
      state: { from, to, city, flow },
    });
  }

  function handleSelectRoute(selectedRoute) {
    navigate("/map", {
      state: {
        from,
        to,
        city,
        mode: selectedRoute.mode,
        selectedRoute,
        flow,
      },
    });
  }

  return (
    <div className="suggestions-page">
      <header className="suggestions-header">
        <button className="back-button" onClick={handleBack} aria-label="Go back">
          <i className="bi bi-arrow-left" aria-hidden="true"></i>
          Back
        </button>

        <div className="header-title">
          <div className="header-icon">
            <i className="bi bi-signpost-2-fill" aria-hidden="true"></i>
          </div>

          <div>
            <p className="header-label">TARA SUGGESTIONS</p>
            <h1>Suggested Routes</h1>
          </div>
        </div>
      </header>

      <main className="suggestions-content">
        <section className="trip-overview">
          <p className="overview-label">YOUR TRIP</p>

          <div className="location-row">
            <div className="location-marker from-marker">
              <i className="bi bi-circle-fill" aria-hidden="true"></i>
            </div>

            <div className="location-information">
              <span>From</span>
              <strong>{from}</strong>
            </div>
          </div>

          <div className="overview-line"></div>

          <div className="location-row">
            <div className="location-marker to-marker">
              <i className="bi bi-geo-alt-fill" aria-hidden="true"></i>
            </div>

            <div className="location-information">
              <span>To</span>
              <strong>{to}</strong>
            </div>
          </div>
        </section>

        <section className="suggestions-introduction">
          <div>
            <h2>How would you like to go?</h2>
            <p>Here are some possible routes based on your trip.</p>
          </div>

          <div className="suggestion-count">
            <span>{suggestedRoutes.length}</span>
            options
          </div>
        </section>

        <section className="route-suggestions">
          {suggestedRoutes.map((route) => (
            <article className="suggestion-card" key={route.id}>
              <div className="suggestion-card-header">
                <div className={`route-type route-type-${route.id}`}>
                  <i className={`bi ${route.typeIcon}`} aria-hidden="true"></i>
                  <span>{route.type}</span>
                </div>

                <span className="route-tag">{route.tag}</span>
              </div>

              <div className="transportation-info">
                <div className="transportation-icon">
                  <i className={`bi ${route.modeIcon}`} aria-hidden="true"></i>
                </div>

                <div className="transportation-name">
                  <span>Transportation Mode</span>
                  <h3>{route.mode}</h3>
                </div>
              </div>

              <div className="route-path">
                <i className="bi bi-signpost-2" aria-hidden="true"></i>
                <div>
                  <span>Route</span>
                  <p>{route.route}</p>
                </div>
              </div>

              <div className="route-details">
                <div className="route-detail">
                  <i className="bi bi-clock" aria-hidden="true"></i>
                  <div>
                    <span>Estimated Time</span>
                    <strong>{route.time}</strong>
                  </div>
                </div>

                <div className="route-detail">
                  <i className="bi bi-cash-stack" aria-hidden="true"></i>
                  <div>
                    <span>Estimated Fare</span>
                    <strong>{route.fare}</strong>
                  </div>
                </div>
              </div>

              <p className="route-description">{route.description}</p>

              <button
                className="select-route-button"
                onClick={() => handleSelectRoute(route)}
              >
                <span>Choose this route</span>
                <i className="bi bi-arrow-right" aria-hidden="true"></i>
              </button>
            </article>
          ))}
        </section>

        <section className="manual-option">
          <div className="manual-option-icon">
            <i className="bi bi-sliders" aria-hidden="true"></i>
          </div>

          <div className="manual-option-information">
            <h3>Want to choose your own route?</h3>
            <p>Select the city, transportation mode, and route manually.</p>
          </div>

          <button
            className="manual-option-button"
            onClick={() => navigate("/city-filter")}
            aria-label="Choose route manually"
          >
            <i className="bi bi-arrow-right" aria-hidden="true"></i>
          </button>
        </section>

        <section className="fare-disclaimer">
          <i className="bi bi-info-circle-fill" aria-hidden="true"></i>
          <div>
            <strong>About these estimates</strong>
            <p>
              Travel times, fares, and vehicle availability are estimates and
              may vary depending on traffic, waiting time, route conditions,
              and other factors.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Suggestions;