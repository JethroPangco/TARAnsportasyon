import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StepProgress from "../../components/StepProgress/StepProgress";
import "./CityFilter.css";

const cities = [
  "Quezon City", "Manila", "Caloocan", "Pasig", "Makati", "Taguig",
  "Marikina", "Mandaluyong", "Parañaque", "Las Piñas", "Muntinlupa",
  "Pasay", "Valenzuela", "Navotas", "Malabon", "San Juan", "Pateros",
];

function CityFilter() {
  const navigate = useNavigate();
  const [city, setCity] = useState("");

  function handleContinue() {
    if (!city) return;
    navigate("/mode-filter", { state: { city } });
  }

  return (
    <div className="city-filter-page">
      <header className="city-filter-header">
        <button className="city-back-button" onClick={() => navigate("/")} aria-label="Go back">
          <i className="bi bi-arrow-left" aria-hidden="true"></i>
          Back
        </button>
      </header>

      <main className="city-filter-content">
        <StepProgress currentStep={1} />

        <section className="city-filter-intro">
          <div className="city-filter-icon">
            <i className="bi bi-geo-alt-fill" aria-hidden="true"></i>
          </div>

          <p className="city-filter-label">MANUAL ROUTE</p>

          <h1>Where are you commuting?</h1>

          <p>
            Select the city where you want to find available public
            transportation routes.
          </p>
        </section>

        <section className="city-selection-card">
          <label htmlFor="city">
            <i className="bi bi-buildings" aria-hidden="true"></i>
            Select a city
          </label>

          <div className="city-select-wrapper">
            <i className="bi bi-geo-alt" aria-hidden="true"></i>

            <select id="city" value={city} onChange={(event) => setCity(event.target.value)}>
              <option value="">Choose a city</option>
              {cities.map((cityName) => (
                <option key={cityName} value={cityName}>
                  {cityName}
                </option>
              ))}
            </select>

            <i className="bi bi-chevron-down select-arrow" aria-hidden="true"></i>
          </div>

          <p className="selection-helper">
            Choose the city where you will be taking your public transportation.
          </p>
        </section>

        {city && (
          <div className="selected-city-card">
            <div className="selected-city-icon">
              <i className="bi bi-check-lg" aria-hidden="true"></i>
            </div>

            <div>
              <span>SELECTED CITY</span>
              <strong>{city}</strong>
            </div>
          </div>
        )}

        <button className="continue-city-button" onClick={handleContinue} disabled={!city}>
          Continue to Transportation
          <i className="bi bi-arrow-right" aria-hidden="true"></i>
        </button>

        <div className="city-filter-tip">
          <i className="bi bi-info-circle-fill" aria-hidden="true"></i>
          <p>You can change your city later when viewing your selected route on the map.</p>
        </div>
      </main>
    </div>
  );
}

export default CityFilter;