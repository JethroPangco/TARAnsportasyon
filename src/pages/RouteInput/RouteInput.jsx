import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./RouteInput.css";

function RouteInput() {
  const navigate = useNavigate();
  const location = useLocation();

  const { city, flow, from: initialFrom, to: initialTo } = location.state || {};

  const [from, setFrom] = useState(initialFrom || "");
  const [to, setTo] = useState(city || initialTo || "");
  const [errors, setErrors] = useState({});

  const isDestinationPreselected = Boolean(city);

  function validate() {
    const nextErrors = {};
    if (!from.trim()) nextErrors.from = "Please enter your starting location.";
    if (!isDestinationPreselected && !to.trim()) {
      nextErrors.to = "Please enter your destination.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleFindRoutes() {
    if (!validate()) return;

    navigate("/suggestions", {
      state: {
        from: from.trim(),
        to: isDestinationPreselected ? city : to.trim(),
        city: isDestinationPreselected ? city : null,
        flow: flow || "suggestion",
      },
    });
  }

  function handleBack() {
    if (isDestinationPreselected) {
      navigate("/route-filter", { state: { city } });
    } else {
      navigate("/");
    }
  }

  function handleSwap() {
    if (isDestinationPreselected) return;
    setFrom(to);
    setTo(from);
  }

  function updateFrom(value) {
    setFrom(value);
    if (errors.from) setErrors((prev) => ({ ...prev, from: undefined }));
  }

  function updateTo(value) {
    setTo(value);
    if (errors.to) setErrors((prev) => ({ ...prev, to: undefined }));
  }

  return (
    <div className="route-input-page">
      <div className="route-input-container">
        <button className="back-button" onClick={handleBack}>
          <i className="bi bi-arrow-left" aria-hidden="true"></i>
          Back
        </button>

        <div className="route-input-header">
          <div className="route-icon">
            <i className="bi bi-signpost-2-fill" aria-hidden="true"></i>
          </div>

          <h1>Where are you going?</h1>

          <p>
            {isDestinationPreselected
              ? "Tell us where you're coming from and TARA will help you find the best route."
              : "Tell us where you're coming from and where you want to go. We'll help you find the best routes."}
          </p>
        </div>

        <div className="route-form">
          <div className="location-input-group">
            <label htmlFor="from">
              <i className="bi bi-circle-fill from-icon" aria-hidden="true"></i>
              From
            </label>

            <div className={`input-wrapper ${errors.from ? "input-error" : ""}`}>
              <i className="bi bi-geo-alt" aria-hidden="true"></i>
              <input
                id="from"
                type="text"
                placeholder="Enter your starting location"
                value={from}
                onChange={(event) => updateFrom(event.target.value)}
                aria-invalid={Boolean(errors.from)}
                aria-describedby={errors.from ? "from-error" : undefined}
                autoFocus
              />
            </div>

            {errors.from && (
              <small className="field-error" id="from-error">
                <i className="bi bi-exclamation-circle-fill" aria-hidden="true"></i>
                {errors.from}
              </small>
            )}
          </div>

          <div className="route-connector">
            <button
              type="button"
              className="swap-button"
              onClick={handleSwap}
              disabled={isDestinationPreselected}
              aria-label="Swap starting location and destination"
            >
              <i className="bi bi-arrow-down-up" aria-hidden="true"></i>
            </button>
          </div>

          <div className="location-input-group">
            <label htmlFor="to">
              <i className="bi bi-geo-alt-fill to-icon" aria-hidden="true"></i>
              To
            </label>

            <div
              className={`input-wrapper ${
                isDestinationPreselected ? "destination-preselected" : ""
              } ${errors.to ? "input-error" : ""}`}
            >
              <i className="bi bi-geo-alt" aria-hidden="true"></i>
              <input
                id="to"
                type="text"
                placeholder="Enter your destination"
                value={to}
                onChange={(event) => updateTo(event.target.value)}
                readOnly={isDestinationPreselected}
                aria-invalid={Boolean(errors.to)}
                aria-describedby={errors.to ? "to-error" : undefined}
              />
              {isDestinationPreselected && (
                <i className="bi bi-check-circle-fill destination-check" aria-hidden="true"></i>
              )}
            </div>

            {isDestinationPreselected && (
              <small className="destination-note">
                <i className="bi bi-check-circle-fill" aria-hidden="true"></i>
                Destination selected from your manual route setup.
              </small>
            )}

            {errors.to && (
              <small className="field-error" id="to-error">
                <i className="bi bi-exclamation-circle-fill" aria-hidden="true"></i>
                {errors.to}
              </small>
            )}
          </div>
        </div>

        <button className="find-routes-button" onClick={handleFindRoutes}>
          <i className="bi bi-search" aria-hidden="true"></i>
          Find Routes
        </button>

        <div className="route-input-tip">
          <i className="bi bi-lightbulb-fill" aria-hidden="true"></i>
          <span>
            TARA will suggest routes based on your destination, travel time,
            and available transportation options.
          </span>
        </div>
      </div>
    </div>
  );
}

export default RouteInput;