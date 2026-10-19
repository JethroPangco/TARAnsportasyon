import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Favorites.css";

function loadFavorites() {
  try {
    const stored = JSON.parse(localStorage.getItem("tara_favorites") || "{}");
    return Object.entries(stored).map(([key, value]) => ({ key, ...value }));
  } catch {
    return [];
  }
}

function Favorites() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState(loadFavorites);

  function handleRemove(key) {
    try {
      const stored = JSON.parse(localStorage.getItem("tara_favorites") || "{}");
      delete stored[key];
      localStorage.setItem("tara_favorites", JSON.stringify(stored));
      setFavorites(loadFavorites());
    } catch {
      // Silently fail if localStorage is not available
    }
  }

  function handleViewOnMap(favorite) {
    navigate("/map", {
      state: {
        from: favorite.from,
        to: favorite.to,
        city: favorite.city,
        mode: favorite.mode,
        selectedRoute: {
          route: favorite.route,
          mode: favorite.mode,
          fare: favorite.fare,
          time: favorite.time,
        },
        flow: "favorite",
      },
    });
  }

  return (
    <div className="favorites-page">
      <header className="favorites-header">
        <button
          className="favorites-back-button"
          onClick={() => navigate("/")}
          aria-label="Go back"
        >
          <i className="bi bi-arrow-left" aria-hidden="true"></i>
          Back
        </button>

        <div className="favorites-header-title">
          <div className="favorites-header-icon">
            <i className="bi bi-star-fill" aria-hidden="true"></i>
          </div>

          <div>
            <p className="favorites-header-label">TARA FAVORITES</p>
            <h1>My Favorites</h1>
          </div>
        </div>
      </header>

      <main className="favorites-content">
        {favorites.length === 0 ? (
          <section className="favorites-empty">
            <div className="favorites-empty-icon">
              <i className="bi bi-star" aria-hidden="true"></i>
            </div>

            <h2>No favorites yet</h2>

            <p>
              Routes you star while tracking a trip will show up here for
              quick access next time.
            </p>

            <button
              className="favorites-primary-button"
              onClick={() => navigate("/route-input")}
            >
              <i className="bi bi-signpost-2" aria-hidden="true"></i>
              Find a route
            </button>
          </section>
        ) : (
          <section className="favorites-list">
            {favorites.map((favorite) => (
              <article className="favorite-card" key={favorite.key}>
                <div className="favorite-card-top">
                  <div className="favorite-mode-icon">
                    <i className="bi bi-bus-front-fill" aria-hidden="true"></i>
                  </div>

                  <div className="favorite-card-title">
                    <span>{favorite.mode}</span>
                    <h2>{favorite.route}</h2>
                  </div>

                  <button
                    className="favorite-remove-button"
                    onClick={() => handleRemove(favorite.key)}
                    aria-label="Remove from favorites"
                  >
                    <i className="bi bi-star-fill" aria-hidden="true"></i>
                  </button>
                </div>

                <div className="favorite-route-path">
                  <div className="favorite-location">
                    <i className="bi bi-circle-fill from-icon" aria-hidden="true"></i>
                    <span>{favorite.from}</span>
                  </div>

                  <div className="favorite-route-line"></div>

                  <div className="favorite-location">
                    <i className="bi bi-geo-alt-fill to-icon" aria-hidden="true"></i>
                    <span>{favorite.to}</span>
                  </div>
                </div>

                <div className="favorite-stats">
                  <div className="favorite-stat">
                    <i className="bi bi-clock" aria-hidden="true"></i>
                    <div>
                      <span>Time</span>
                      <strong>{favorite.time}</strong>
                    </div>
                  </div>

                  <div className="favorite-stat">
                    <i className="bi bi-cash-stack" aria-hidden="true"></i>
                    <div>
                      <span>Fare</span>
                      <strong>{favorite.fare}</strong>
                    </div>
                  </div>

                  <div className="favorite-stat">
                    <i className="bi bi-geo-alt" aria-hidden="true"></i>
                    <div>
                      <span>City</span>
                      <strong>{favorite.city}</strong>
                    </div>
                  </div>
                </div>

                <button
                  className="favorite-view-button"
                  onClick={() => handleViewOnMap(favorite)}
                >
                  <span>View on Map</span>
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

export default Favorites;