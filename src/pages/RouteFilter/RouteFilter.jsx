import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StepProgress from "../../components/StepProgress/StepProgress";
import "./RouteFilter.css";

const routes = [
  { id: 1, name: "Route A", mode: "fx", description: "A prototype FX route serving passengers within the selected city.", stops: "Origin → Route A Stops → Destination" },
  { id: 2, name: "Route A", mode: "jeepney", description: "A prototype jeepney route serving passengers within the selected city.", stops: "Origin → Route A Stops → Destination" },
  { id: 3, name: "Route B", mode: "jeepney", description: "An alternative jeepney route serving passengers within the selected city.", stops: "Origin → Route B Stops → Destination" },
  { id: 4, name: "Route A", mode: "ejeep", description: "A prototype e-jeepney route serving passengers within the selected city.", stops: "Origin → Route A Stops → Destination" },
  { id: 5, name: "Route B", mode: "ejeep", description: "An alternative e-jeepney route serving passengers within the selected city.", stops: "Origin → Route B Stops → Destination" },
];

function RouteFilter() {
  const navigate = useNavigate();
  const location = useLocation();
  const { city, mode } = location.state || {};
  const [selectedRoute, setSelectedRoute] = useState("");

  if (!city || !mode) {
    return (
      <div className="route-filter-page">
        <div className="route-filter-error">
          <div className="route-filter-error-icon">
            <i className="bi bi-exclamation-circle" aria-hidden="true"></i>
          </div>

          <h2>Route information not found</h2>

          <p>Please select a city and transportation mode first.</p>

          <button className="route-filter-primary-button" onClick={() => navigate("/city-filter")}>
            <i className="bi bi-arrow-left" aria-hidden="true"></i>
            Start Manual Selection
          </button>
        </div>
      </div>
    );
  }

  const availableRoutes = routes.filter((route) => route.mode === mode);
  const selectedRouteData = availableRoutes.find((route) => route.name === selectedRoute);

  function handleContinue() {
    if (!selectedRouteData) return;
    navigate("/map", {
      state: { city, mode, selectedRoute: selectedRouteData, flow: "manual" },
    });
  }

  function handleBack() {
    navigate("/mode-filter", { state: { city } });
  }

  function handleChangeMode() {
    navigate("/mode-filter", { state: { city } });
  }

  function handleSuggestedRoutes() {
    navigate("/route-input", { state: { city } });
  }

  return (
    <div className="route-filter-page">
      <header className="route-filter-header">
        <button className="route-filter-back-button" onClick={handleBack} aria-label="Go back">
          <i className="bi bi-arrow-left" aria-hidden="true"></i>
        </button>

        <div className="route-filter-header-info">
          <span>MANUAL ROUTE SELECTION</span>
          <h1>Select a Route</h1>
        </div>
      </header>

      <div className="route-filter-progress-wrapper">
        <StepProgress currentStep={3} />
      </div>

      <main className="route-filter-content">
        <section className="selected-filters">
          <div className="selected-filter">
            <span>City</span>
            <strong>{city}</strong>
          </div>

          <div className="selected-filter">
            <span>Transportation</span>
            <strong>{mode}</strong>
          </div>
        </section>

        <section className="route-filter-introduction">
          <div className="route-filter-icon">
            <i className="bi bi-signpost-2-fill" aria-hidden="true"></i>
          </div>

          <div>
            <h2>Which route will you take?</h2>
            <p>Search and select a route available for your chosen transportation mode.</p>
          </div>
        </section>

        <section className="route-selector-section">
          <label htmlFor="route-select">
            <i className="bi bi-signpost" aria-hidden="true"></i>
            Route
          </label>

          <div className="route-select-wrapper">
            <i className="bi bi-search" aria-hidden="true"></i>

            <select
              id="route-select"
              value={selectedRoute}
              onChange={(event) => setSelectedRoute(event.target.value)}
              disabled={availableRoutes.length === 0}
            >
              <option value="">Search or select a route</option>
              {availableRoutes.map((route) => (
                <option key={route.id} value={route.name}>
                  {route.name}
                </option>
              ))}
            </select>

            <i className="bi bi-chevron-down" aria-hidden="true"></i>
          </div>
        </section>

        {availableRoutes.length === 0 && (
          <section className="no-routes-card">
            <div className="no-routes-icon">
              <i className="bi bi-signpost-2" aria-hidden="true"></i>
            </div>

            <div className="no-routes-body">
              <h3>No routes found</h3>
              <p>There are currently no routes available for {mode} in {city}.</p>

              <div className="no-routes-actions">
                <button className="no-routes-action" onClick={handleChangeMode}>
                  Change transportation mode
                </button>
                <button className="no-routes-action no-routes-action-primary" onClick={handleSuggestedRoutes}>
                  Let TARA suggest a route instead
                </button>
              </div>
            </div>
          </section>
        )}

        {selectedRouteData && (
          <section className="route-details-card">
            <div className="route-details-header">
              <div className="route-details-icon">
                <i className="bi bi-signpost-2-fill" aria-hidden="true"></i>
              </div>

              <div>
                <span>SELECTED ROUTE</span>
                <h2>{selectedRouteData.name}</h2>
              </div>
            </div>

            <div className="route-details-section">
              <span>ROUTE PATH</span>
              <div className="route-path">
                <i className="bi bi-geo-alt-fill" aria-hidden="true"></i>
                <p>{selectedRouteData.stops}</p>
              </div>
            </div>

            <div className="route-details-section">
              <span>ABOUT THIS ROUTE</span>
              <p className="route-description">{selectedRouteData.description}</p>
            </div>
          </section>
        )}

        <section className="suggested-route-option">
          <div className="suggested-route-option-icon">
            <i className="bi bi-stars" aria-hidden="true"></i>
          </div>

          <div className="suggested-route-option-information">
            <span>NOT SURE WHICH ROUTE TO CHOOSE?</span>
            <h3>Let TARA suggest a route for you</h3>
            <p>Enter your starting point and destination and we'll suggest possible routes for your trip.</p>
          </div>

          <button
            className="suggested-route-option-button"
            onClick={handleSuggestedRoutes}
            aria-label="Get route suggestions"
          >
            <i className="bi bi-arrow-right" aria-hidden="true"></i>
          </button>
        </section>

        <div className="route-filter-tip">
          <i className="bi bi-info-circle-fill" aria-hidden="true"></i>
          <p>Make sure you select the route that matches your intended destination before continuing.</p>
        </div>
      </main>

      <footer className="route-filter-footer">
        <button className="continue-route-button" onClick={handleContinue} disabled={!selectedRouteData}>
          Continue to Map
          <i className="bi bi-arrow-right" aria-hidden="true"></i>
        </button>
      </footer>
    </div>
  );
}

export default RouteFilter;