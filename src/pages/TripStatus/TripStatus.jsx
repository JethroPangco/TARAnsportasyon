import { useLocation, useNavigate } from "react-router-dom";
import "./TripStatus.css";

function TripStatus() {
  const navigate = useNavigate();
  const location = useLocation();

  /*
    Information comes from Map.jsx.

    Supported data:
    {
      route,
      city,
      mode,
      selectedRoute,
      from,
      to
    }
  */

  const {
    route,
    city,
    mode,
    selectedRoute,
    flow,
    from = "Starting Point",
    to = "Destination",
  } = location.state || {};

  // Get the route name regardless of whether
  // the trip came from Suggestions or Manual Route.
  const routeName =
    route?.route ||
    route?.title ||
    selectedRoute?.route ||
    selectedRoute?.title ||
    selectedRoute?.name ||
    selectedRoute ||
    "Selected Route";

  const transportMode =
    route?.mode ||
    selectedRoute?.mode ||
    mode ||
    "Jeepney";

  const estimatedFare =
    route?.fare ||
    selectedRoute?.fare ||
    "₱15–₱25";

  const estimatedTime =
    route?.time ||
    selectedRoute?.time ||
    "25–35 min";

  const cityName =
    route?.city ||
    selectedRoute?.city ||
    city ||
    "Quezon City";

  const handleCompleteTrip = () => {
    localStorage.removeItem("tara_active_trip");

    navigate("/trip-summary", {
      state: {
        route: route || selectedRoute,
        city: cityName,
        mode: transportMode,
        selectedRoute,
        from,
        to,
        fare: estimatedFare,
        travelTime: estimatedTime,
        completed: true,
        flow,
      },
    });
  };

  /*
    Go back to the Map page if the commuter
    wants to continue checking their ride.
  */
  const handleBackToMap = () => {
    navigate("/map", {
      state: {
        route,
        city: cityName,
        mode: transportMode,
        selectedRoute,
        from,
        to,
        flow,
      },
    });
  };

  return (
    <div className="trip-status-page">

      {/* =========================
          HEADER
      ========================= */}

      <header className="trip-status-header">

        <button
          className="trip-status-back-button"
          onClick={handleBackToMap}
          aria-label="Back to map"
        >
          <i className="bi bi-arrow-left"></i>
        </button>

        <div className="trip-status-header-info">

          <span>TRIP STATUS</span>

          <h1>Your Trip</h1>

        </div>

      </header>


      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main className="trip-status-content">


        {/* =========================
            STATUS HERO
        ========================= */}

        <section className="trip-status-hero">

          <div className="status-icon-wrapper">

            <div className="status-pulse"></div>

            <div className="status-icon">
              <i className="bi bi-navigation-fill"></i>
            </div>

          </div>

          <span className="status-label">
            TRIP IN PROGRESS
          </span>

          <h2>You're on your way!</h2>

          <p>
            Follow your selected route and use TARA to
            keep track of your trip.
          </p>

        </section>


        {/* =========================
            CURRENT TRIP
        ========================= */}

        <section className="current-trip-card">

          <div className="card-section-heading">

            <div className="heading-icon">
              <i className="bi bi-signpost-2-fill"></i>
            </div>

            <div>
              <span>CURRENT TRIP</span>
              <h2>{transportMode}</h2>
            </div>

          </div>


          {/* From / To */}

          <div className="trip-path">

            <div className="trip-path-item">

              <div className="trip-path-marker from-marker">
                <i className="bi bi-circle-fill"></i>
              </div>

              <div>
                <span>FROM</span>
                <strong>{from}</strong>
              </div>

            </div>


            <div className="trip-path-line"></div>


            <div className="trip-path-item">

              <div className="trip-path-marker to-marker">
                <i className="bi bi-geo-alt-fill"></i>
              </div>

              <div>
                <span>TO</span>
                <strong>{to}</strong>
              </div>

            </div>

          </div>


          {/* Route */}

          <div className="status-route">

            <span>ROUTE</span>

            <strong>{routeName}</strong>

          </div>

        </section>


        {/* =========================
            TRIP PROGRESS
        ========================= */}

        <section className="progress-card">

          <div className="progress-heading">

            <div>
              <span>TRIP PROGRESS</span>
              <h2>On the way</h2>
            </div>

            <div className="progress-percentage">
              50%
            </div>

          </div>


          <div className="progress-bar">

            <div className="progress-fill"></div>

          </div>


          <div className="progress-stages">

            <div className="progress-stage active">

              <div className="stage-dot">
                <i className="bi bi-check"></i>
              </div>

              <span>Started</span>

            </div>


            <div className="progress-stage active">

              <div className="stage-dot">
                <i className="bi bi-bus-front-fill"></i>
              </div>

              <span>On the way</span>

            </div>


            <div className="progress-stage">

              <div className="stage-dot"></div>

              <span>Near destination</span>

            </div>


            <div className="progress-stage">

              <div className="stage-dot"></div>

              <span>Completed</span>

            </div>

          </div>

        </section>


        {/* =========================
            TRIP INFORMATION
        ========================= */}

        <section className="trip-information-card">

          <div className="information-item">

            <div className="information-icon">
              <i className="bi bi-clock-fill"></i>
            </div>

            <div>
              <span>ESTIMATED TRAVEL TIME</span>
              <strong>{estimatedTime}</strong>
            </div>

          </div>


          <div className="information-divider"></div>


          <div className="information-item">

            <div className="information-icon">
              <i className="bi bi-cash-stack"></i>
            </div>

            <div>
              <span>ESTIMATED FARE</span>
              <strong>{estimatedFare}</strong>
            </div>

          </div>


          <div className="information-divider"></div>


          <div className="information-item">

            <div className="information-icon">
              <i className="bi bi-geo-alt-fill"></i>
            </div>

            <div>
              <span>AREA</span>
              <strong>{cityName}</strong>
            </div>

          </div>

        </section>


        {/* =========================
            LIVE STATUS
        ========================= */}

        <section className="live-status-card">

          <div className="live-status-icon">
            <i className="bi bi-broadcast-pin"></i>
          </div>

          <div className="live-status-information">

            <div className="live-status-title">

              <strong>Trip tracking active</strong>

              <span>
                <i className="bi bi-circle-fill"></i>
                LIVE
              </span>

            </div>

            <p>
              TARA is monitoring your selected route and
              transportation information.
            </p>

          </div>

        </section>


        {/* =========================
            ACTIONS
        ========================= */}

        <section className="trip-status-actions">

          <button
            className="view-map-button"
            onClick={handleBackToMap}
          >
            <i className="bi bi-map"></i>
            View Map
          </button>


          <button
            className="complete-trip-button"
            onClick={handleCompleteTrip}
          >
            <i className="bi bi-check2-circle"></i>
            Complete Trip
          </button>

        </section>


        {/* =========================
            DISCLAIMER
        ========================= */}

        <p className="trip-status-disclaimer">

          <i className="bi bi-info-circle"></i>

          Trip progress, travel time, fare, and transportation
          information are estimates and may change depending
          on actual conditions.

        </p>

      </main>

    </div>
  );
}

export default TripStatus;