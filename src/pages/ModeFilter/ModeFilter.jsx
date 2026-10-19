import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StepProgress from "../../components/StepProgress/StepProgress";
import "./ModeFilter.css";

const transportationModes = [
  { id: "jeepney", name: "Jeepney", description: "Traditional public utility jeepneys", icon: "bi-truck-front-fill" },
  { id: "ejeep", name: "E-Jeep", description: "Electric jeepneys", icon: "bi-lightning-charge-fill" },
  { id: "bus", name: "Bus", description: "Public buses operating on major routes", icon: "bi-bus-front-fill" },
  { id: "fx", name: "UV Express / FX", description: "UV Express vans and FX vehicles", icon: "bi-car-front-fill" },
];

function ModeFilter() {
  const navigate = useNavigate();
  const location = useLocation();
  const { city } = location.state || {};
  const [mode, setMode] = useState("");

  if (!city) {
    return (
      <div className="mode-filter-page">
        <div className="mode-filter-error">
          <div className="error-icon">
            <i className="bi bi-exclamation-circle" aria-hidden="true"></i>
          </div>

          <h2>City information not found</h2>

          <p>Please select a city first before choosing a transportation mode.</p>

          <button className="primary-button" onClick={() => navigate("/city-filter")}>
            <i className="bi bi-arrow-left" aria-hidden="true"></i>
            Go to City Filter
          </button>
        </div>
      </div>
    );
  }

  function handleContinue() {
    if (!mode) return;
    navigate("/route-filter", { state: { city, mode } });
  }

  return (
    <div className="mode-filter-page">
      <main className="mode-filter-container">
        <button className="back-button" onClick={() => navigate("/city-filter")}>
          <i className="bi bi-arrow-left" aria-hidden="true"></i>
          Back
        </button>

        <StepProgress currentStep={2} />

        <section className="mode-filter-header">
          <div className="mode-filter-icon">
            <i className="bi bi-bus-front-fill" aria-hidden="true"></i>
          </div>

          <p className="mode-filter-label">STEP 2 OF 3</p>

          <h1>How do you want to ride?</h1>

          <p>Choose the type of public transportation you want to take.</p>
        </section>

        <section className="selected-city-card">
          <div className="selected-city-icon">
            <i className="bi bi-geo-alt-fill" aria-hidden="true"></i>
          </div>

          <div>
            <span>SELECTED CITY</span>
            <strong>{city}</strong>
          </div>

          <button onClick={() => navigate("/city-filter")} aria-label="Change city">
            <i className="bi bi-pencil" aria-hidden="true"></i>
          </button>
        </section>

        <section className="transportation-modes">
          <div className="section-heading">
            <h2>Transportation Mode</h2>
            <p>Select one option to continue.</p>
          </div>

          <div className="mode-list" role="radiogroup" aria-label="Transportation mode">
            {transportationModes.map((transport) => (
              <button
                key={transport.id}
                className={`mode-card ${mode === transport.id ? "selected" : ""}`}
                onClick={() => setMode(transport.id)}
                role="radio"
                aria-checked={mode === transport.id}
              >
                <div className="mode-card-icon">
                  <i className={`bi ${transport.icon}`} aria-hidden="true"></i>
                </div>

                <div className="mode-card-information">
                  <h3>{transport.name}</h3>
                  <p>{transport.description}</p>
                </div>

                <div className="mode-radio">
                  {mode === transport.id && <i className="bi bi-check-lg" aria-hidden="true"></i>}
                </div>
              </button>
            ))}
          </div>
        </section>

        <button className="continue-button" onClick={handleContinue} disabled={!mode}>
          Continue to Routes
          <i className="bi bi-arrow-right" aria-hidden="true"></i>
        </button>
      </main>
    </div>
  );
}

export default ModeFilter;