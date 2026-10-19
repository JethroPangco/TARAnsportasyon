import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./TripSummary.css";

function TripSummary() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    route,
    city,
    mode,
    selectedRoute,
    flow,
    from = "Starting Point",
    to = "Destination",
    fare,
    travelTime,
    completed = false,
  } = location.state || {};

  const routeObject =
    typeof route === "object" && route !== null
      ? route
      : typeof selectedRoute === "object" && selectedRoute !== null
        ? selectedRoute
        : null;

  const routeName =
    routeObject?.route ||
    routeObject?.title ||
    routeObject?.name ||
    (typeof route === "string" ? route : null) ||
    (typeof selectedRoute === "string" ? selectedRoute : null) ||
    "Selected Route";

  const transportMode =
    routeObject?.mode ||
    mode ||
    "Jeepney";

  const estimatedFare =
    fare ||
    routeObject?.fare ||
    "₱15–₱25";

  const estimatedTravelTime =
    travelTime ||
    routeObject?.time ||
    "25–35 min";

  const cityName = city || "Quezon City";

  /*
    =========================
    REDIRECT TO TRIP PLANNER
    =========================

    If the trip came from Trip Planner (flow === "trip-planner"),
    redirect back to Trip Planner after completion.
  */

  useEffect(() => {
    if (flow === "trip-planner" && completed) {
      navigate("/trip-planner");
    }
  }, [flow, completed, navigate]);

  /*
    =========================
    BACK BUTTON
    =========================

    Since Trip Summary is now the FINAL
    page after completing the trip,
    the back button returns to Trip Status.
  */

  const handleBack = () => {
    navigate("/trip-status", {
      state: {
        route,
        city,
        mode,
        selectedRoute,
        from,
        to,
        fare: estimatedFare,
        travelTime: estimatedTravelTime,
        flow,
      },
    });
  };

  /*
    =========================
    SAVE TO FAVORITES
    =========================
  */

  const handleSaveFavorite = () => {
    try {
      const favoriteKey = `${cityName}-${transportMode}-${routeName}`;
      const stored = JSON.parse(localStorage.getItem("tara_favorites") || "{}");

      stored[favoriteKey] = {
        city: cityName,
        mode: transportMode,
        route: routeName,
        from,
        to,
        fare: estimatedFare,
        time: estimatedTravelTime,
      };

      localStorage.setItem("tara_favorites", JSON.stringify(stored));
      alert("Trip saved to Favorites!");
    } catch {
      alert("Couldn't save to Favorites. Please try again.");
    }
  };

  /*
    =========================
    RETURN HOME
    =========================
  */

  const handleBackHome = () => {
    navigate("/");
  };

  return (
    <div className="trip-summary-page">

      <main className="trip-summary-container">

        {/* =========================
            BACK BUTTON
        ========================= */}

        <button
          className="summary-back-button"
          onClick={handleBack}
        >
          <i className="bi bi-arrow-left"></i>
          Back
        </button>


        {/* =========================
            HEADER
        ========================= */}

        <section className="summary-header">

          <div className="summary-icon">
            <i className="bi bi-check2-circle"></i>
          </div>

          <p className="summary-label">
            {completed ? "TRIP COMPLETED" : "TRIP SUMMARY"}
          </p>

          <h1>
            {completed ? "Trip Completed!" : "Trip Summary"}
          </h1>

          <p>
            {completed
              ? "Here's a summary of your completed trip."
              : "Here's a summary of your selected trip."
            }
          </p>

        </section>


        {/* =========================
            ROUTE OVERVIEW
        ========================= */}

        <section className="trip-route-card">

          {/* FROM */}

          <div className="location-row">

            <div className="location-marker from-marker">
              <i className="bi bi-circle-fill"></i>
            </div>

            <div>
              <span>FROM</span>
              <h2>{from}</h2>
            </div>

          </div>


          {/* CONNECTOR */}

          <div className="summary-route-line">
            <div></div>
          </div>


          {/* TO */}

          <div className="location-row">

            <div className="location-marker to-marker">
              <i className="bi bi-geo-alt-fill"></i>
            </div>

            <div>
              <span>TO</span>
              <h2>{to}</h2>
            </div>

          </div>

        </section>


        {/* =========================
            SELECTED TRANSPORTATION
        ========================= */}

        <section className="selected-route-card">

          <div className="selected-route-heading">

            <div className="transport-icon">
              <i className="bi bi-bus-front-fill"></i>
            </div>

            <div>
              <span>TRANSPORTATION MODE</span>
              <h2>{transportMode}</h2>
            </div>

          </div>


          {/* ROUTE */}

          <div className="route-detail">

            <span>ROUTE</span>

            <p>{routeName}</p>

          </div>


          {/* DETAILS */}

          <div className="trip-details">

            <div className="trip-detail-item">

              <i className="bi bi-cash-stack"></i>

              <div>
                <span>ESTIMATED FARE</span>
                <strong>{estimatedFare}</strong>
              </div>

            </div>


            <div className="trip-detail-item">

              <i className="bi bi-clock"></i>

              <div>
                <span>ESTIMATED TRAVEL TIME</span>
                <strong>{estimatedTravelTime}</strong>
              </div>

            </div>

          </div>

        </section>


        {/* =========================
            COMPLETION STATUS
        ========================= */}

        {completed && (

          <section className="trip-completed-message">

            <div className="completed-icon">
              <i className="bi bi-check-lg"></i>
            </div>

            <div>

              <strong>
                Your trip has been completed
              </strong>

              <p>
                Thank you for using TARA. We hope you had
                a smooth journey!
              </p>

            </div>

          </section>

        )}


        {/* =========================
            DISCLAIMER
        ========================= */}

        <div className="summary-disclaimer">

          <i className="bi bi-info-circle-fill"></i>

          <p>
            Fare and travel time are estimates only. Actual
            fares, waiting times, traffic conditions, and
            travel times may vary.
          </p>

        </div>


        {/* =========================
            ACTIONS
        ========================= */}

        <section className="summary-actions">

          <button
            className="start-trip-button"
            onClick={handleSaveFavorite}
          >
            <i className="bi bi-star"></i>
            Save to Favorites
          </button>


          <button
            className="choose-another-button"
            onClick={handleBackHome}
          >
            <i className="bi bi-house"></i>
            Back to Home
          </button>

        </section>

      </main>

    </div>
  );
}

export default TripSummary;