import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FrequentTrips.css";

function loadFrequentTrips() {
  try {
    const stored = JSON.parse(localStorage.getItem("tara_trip_history") || "{}");
    return Object.entries(stored)
      .map(([key, trip]) => ({ key, ...trip }))
      .sort((a, b) => (b.count || 0) - (a.count || 0));
  } catch {
    return [];
  }
}

function FrequentTrips() {
  const navigate = useNavigate();
  const [trips] = useState(loadFrequentTrips);

  function handleFindRoute(trip) {
    navigate("/suggestions", {
      state: {
        from: trip.from,
        to: trip.to,
        city: trip.city,
        flow: "frequent-trip",
      },
    });
  }

  return (
    <div className="frequent-trips-page">
      <header className="frequent-trips-header">
        <button
          className="frequent-trips-back-button"
          onClick={() => navigate("/")}
          aria-label="Go to home"
        >
          <i className="bi bi-arrow-left" aria-hidden="true"></i>
          Home
        </button>

        <div className="frequent-trips-title">
          <div className="frequent-trips-title-icon">
            <i className="bi bi-arrow-repeat" aria-hidden="true"></i>
          </div>
          <div>
            <p>QUICK ACCESS</p>
            <h1>Frequent Trips</h1>
          </div>
        </div>
      </header>

      <main className="frequent-trips-content">
        {trips.length === 0 ? (
          <section className="frequent-trips-empty">
            <div className="frequent-trips-empty-icon">
              <i className="bi bi-signpost-2" aria-hidden="true"></i>
            </div>
            <h2>Your regular trips will show up here</h2>
            <p>
              Start a trip and TARA will save it here so you can find routes for
              it again quickly.
            </p>
            <button
              className="frequent-trips-primary-button"
              onClick={() => navigate("/route-input")}
            >
              <i className="bi bi-search" aria-hidden="true"></i>
              Find a route
            </button>
          </section>
        ) : (
          <section className="frequent-trips-list" aria-label="Frequent trips">
            {trips.map((trip) => (
              <article className="frequent-trip-card" key={trip.key}>
                <div className="frequent-trip-heading">
                  <div className="frequent-trip-icon">
                    <i className="bi bi-arrow-left-right" aria-hidden="true"></i>
                  </div>
                  <div>
                    <span>{trip.city || "City not specified"}</span>
                    <strong>
                      Used {trip.count} {trip.count === 1 ? "time" : "times"}
                    </strong>
                  </div>
                </div>

                <div className="frequent-trip-route">
                  <span>{trip.from}</span>
                  <i className="bi bi-arrow-down" aria-hidden="true"></i>
                  <span>{trip.to}</span>
                </div>

                <button
                  className="frequent-trip-action"
                  onClick={() => handleFindRoute(trip)}
                >
                  Find routes again
                  <i className="bi bi-arrow-right" aria-hidden="true"></i>
                </button>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

export default FrequentTrips;
