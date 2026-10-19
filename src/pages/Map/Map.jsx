import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Map.css";

function parseEtaMinutes(etaText) {
  const match = etaText.match(/\d+/);
  return match ? parseInt(match[0], 10) : Number.MAX_SAFE_INTEGER;
}

function generatePuvs(transportMode) {
  return [
    { id: 1, type: transportMode, plate: "ABC 1234", eta: `${2 + Math.floor(Math.random() * 4)} min`, status: "Available", top: "36%", left: "42%" },
    { id: 2, type: transportMode, plate: "XYZ 5678", eta: `${6 + Math.floor(Math.random() * 4)} min`, status: "Available", top: "52%", left: "63%" },
    { id: 3, type: transportMode, plate: "DEF 9012", eta: `${9 + Math.floor(Math.random() * 5)} min`, status: "Available", top: "67%", left: "31%" },
  ];
}

function Map() {
  const navigate = useNavigate();
  const location = useLocation();

  const { from, to, city, mode, selectedRoute, flow } = location.state || {};

  const storedTrip =
    !from && !to
      ? JSON.parse(localStorage.getItem("tara_active_trip") || "null")
      : null;

  const routeName =
    selectedRoute?.route || selectedRoute?.title || storedTrip?.routeName || "Selected Route";
  const cityName = city || storedTrip?.city || "Quezon City";
  const transportMode = selectedRoute?.mode || mode || storedTrip?.mode || "Jeepney";
  const fromLocation = from || storedTrip?.from || "Starting Point";
  const destination = to || storedTrip?.to || "Destination";
  const estimatedFare = selectedRoute?.fare || storedTrip?.fare || "₱15–₱25";
  const estimatedTime = selectedRoute?.time || storedTrip?.travelTime || "25–35 min";

  const [puvs, setPuvs] = useState(() => generatePuvs(transportMode));
  const [isRefreshing, setIsRefreshing] = useState(false);

  const favoriteKey = `${cityName}-${transportMode}-${routeName}`;
  const [isFavorited, setIsFavorited] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("tara_favorites") || "{}");
      return Boolean(stored[favoriteKey]);
    } catch {
      return false;
    }
  });

  const nearestPuv = [...puvs].sort(
    (a, b) => parseEtaMinutes(a.eta) - parseEtaMinutes(b.eta)
  )[0];

  function handleBack() {
    navigate(-1);
  }

  function handleRefresh() {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setTimeout(() => {
      setPuvs(generatePuvs(transportMode));
      setIsRefreshing(false);
    }, 700);
  }

  function handleToggleFavorite() {
    try {
      const stored = JSON.parse(localStorage.getItem("tara_favorites") || "{}");
      if (stored[favoriteKey]) {
        delete stored[favoriteKey];
        setIsFavorited(false);
      } else {
                stored[favoriteKey] = {
          city: cityName,
          mode: transportMode,
          route: routeName,
          from: fromLocation,
          to: destination,
          fare: estimatedFare,
          time: estimatedTime,
        };
        setIsFavorited(true);
      }
      localStorage.setItem("tara_favorites", JSON.stringify(stored));
    } catch {
      // Silently fail if localStorage is not available
    }
  }

  function handleStartTrip() {
    localStorage.setItem(
      "tara_active_trip",
      JSON.stringify({
        from: fromLocation,
        to: destination,
        city: cityName,
        mode: transportMode,
        routeName,
        fare: estimatedFare,
        travelTime: estimatedTime,
      })
    );

    navigate("/trip-status", {
      state: {
        from: fromLocation,
        to: destination,
        city: cityName,
        mode: transportMode,
        selectedRoute,
        fare: estimatedFare,
        travelTime: estimatedTime,
        flow,
      },
    });
  }

  function handleChangeRoute() {
    if (flow === "manual") {
      navigate("/city-filter");
    } else {
      navigate("/suggestions", {
        state: { from: fromLocation, to: destination, city, flow },
      });
    }
  }

  return (
    <div className="map-page">
      <header className="map-header">
        <button className="map-back-button" onClick={handleBack} aria-label="Go back">
          <i className="bi bi-arrow-left" aria-hidden="true"></i>
        </button>

        <div className="map-header-info">
          <span className="map-header-label">LIVE TRANSPORT</span>
          <h1>Track your ride</h1>
        </div>

        <button
          className="map-refresh-button"
          onClick={handleRefresh}
          aria-label="Refresh vehicle positions"
          disabled={isRefreshing}
        >
          <i
            className={`bi bi-arrow-clockwise ${isRefreshing ? "spinning" : ""}`}
            aria-hidden="true"
          ></i>
        </button>
      </header>

      <section className="map-trip-info">
        <div className="trip-location">
          <div className="trip-location-dot from-dot">
            <i className="bi bi-circle-fill" aria-hidden="true"></i>
          </div>
          <div>
            <span>FROM</span>
            <strong>{fromLocation}</strong>
          </div>
        </div>

        <div className="trip-location-line"></div>

        <div className="trip-location">
          <div className="trip-location-dot to-dot">
            <i className="bi bi-geo-alt-fill" aria-hidden="true"></i>
          </div>
          <div>
            <span>TO</span>
            <strong>{destination}</strong>
          </div>
        </div>
      </section>

      <main className="map-container">
        <div className="map-background">
          <div className="map-road road-one"></div>
          <div className="map-road road-two"></div>
          <div className="map-road road-three"></div>
          <div className="map-road road-four"></div>

          <div className="route-line"></div>

          <div className="map-marker start-marker">
            <div className="marker-pulse"></div>
            <i className="bi bi-circle-fill" aria-hidden="true"></i>
          </div>

          <div className="map-marker destination-marker">
            <i className="bi bi-geo-alt-fill" aria-hidden="true"></i>
          </div>

          {puvs.map((puv) => (
            <div
              className="puv-marker"
              key={puv.id}
              style={{ top: puv.top, left: puv.left }}
              title={`${puv.type} - ${puv.eta}`}
            >
              <i className="bi bi-bus-front-fill" aria-hidden="true"></i>
            </div>
          ))}

          <div className="map-area-label">{cityName}</div>
        </div>

        <div className="map-legend">
          <div>
            <span className="legend-dot available"></span>
            Available PUV
          </div>
          <div>
            <span className="legend-dot destination"></span>
            Destination
          </div>
        </div>

        <section className="map-route-card">
          <div className="route-card-top">
            <div className="route-mode-icon">
              <i className="bi bi-bus-front-fill" aria-hidden="true"></i>
            </div>

            <div className="route-card-title">
              <span>{transportMode}</span>
              <h2>{routeName}</h2>
            </div>

            <button
              className={`favorite-route-button ${isFavorited ? "is-favorited" : ""}`}
              aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
              aria-pressed={isFavorited}
              onClick={handleToggleFavorite}
            >
              <i
                className={`bi ${isFavorited ? "bi-star-fill" : "bi-star"}`}
                aria-hidden="true"
              ></i>
            </button>
          </div>

          <div className="route-stats">
            <div className="route-stat">
              <i className="bi bi-clock" aria-hidden="true"></i>
              <div>
                <span>Estimated time</span>
                <strong>{estimatedTime}</strong>
              </div>
            </div>

            <div className="route-stat">
              <i className="bi bi-cash-stack" aria-hidden="true"></i>
              <div>
                <span>Estimated fare</span>
                <strong>{estimatedFare}</strong>
              </div>
            </div>
          </div>
        </section>
      </main>

      <section className="nearest-puv-card">
        <div className="nearest-puv-icon">
          <i className="bi bi-bus-front-fill" aria-hidden="true"></i>
        </div>

        <div className="nearest-puv-info">
          <span>NEAREST AVAILABLE PUV</span>
          <h2>{nearestPuv.type}</h2>
          <p>
            Vehicle <strong>{nearestPuv.plate}</strong> is approximately{" "}
            <strong>{nearestPuv.eta}</strong> away.
          </p>
        </div>

        <div className="nearest-puv-eta">
          <strong>{nearestPuv.eta}</strong>
          <span>ETA</span>
        </div>
      </section>

      <div className="map-actions">
        <button className="change-route-button" onClick={handleChangeRoute}>
          <i className="bi bi-arrow-left-right" aria-hidden="true"></i>
          Change Route
        </button>

        <button className="start-trip-button" onClick={handleStartTrip}>
          Start Trip
          <i className="bi bi-arrow-right" aria-hidden="true"></i>
        </button>
      </div>

      <p className="map-disclaimer">
        <i className="bi bi-info-circle" aria-hidden="true"></i>
        PUV locations, ETAs, fares, and travel times are estimates and may
        change depending on traffic and vehicle availability.
      </p>
    </div>
  );
}

export default Map;