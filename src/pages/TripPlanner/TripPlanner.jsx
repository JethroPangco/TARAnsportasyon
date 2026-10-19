import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TripPlanner.css";

const STORAGE_KEY = "tara_planned_trips";
const MAX_LEGS = 5;

const transportationModes = [
  { id: "jeepney", name: "Jeepney", icon: "bi-truck-front-fill" },
  { id: "ejeep", name: "E-Jeep", icon: "bi-lightning-charge-fill" },
  { id: "bus", name: "Bus", icon: "bi-bus-front-fill" },
  { id: "fx", name: "UV Express / FX", icon: "bi-car-front-fill" },
];

function getModeInfo(modeId) {
  return transportationModes.find((mode) => mode.id === modeId) || transportationModes[0];
}

function loadPlannedTrips() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

function savePlannedTrips(trips) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
}

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("en-PH", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

const emptyForm = { from: "", to: "", date: "", time: "", notes: "" };
const emptyLeg = () => ({ id: Date.now() + Math.random(), mode: "jeepney", route: "", note: "" });

function TripPlanner() {
  const navigate = useNavigate();

  const [trips, setTrips] = useState(loadPlannedTrips);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [legs, setLegs] = useState([]);
  const [errors, setErrors] = useState({});

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function validate() {
    const nextErrors = {};
    if (!form.from.trim()) nextErrors.from = "Starting location is required.";
    if (!form.to.trim()) nextErrors.to = "Destination is required.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleOpenForm() {
    setForm(emptyForm);
    setLegs([]);
    setErrors({});
    setIsFormOpen(true);
  }

  function handleCancelForm() {
    setIsFormOpen(false);
  }

  function handleAddLeg() {
    if (legs.length >= MAX_LEGS) return;
    setLegs((prev) => [...prev, emptyLeg()]);
  }

  function handleRemoveLeg(id) {
    setLegs((prev) => prev.filter((leg) => leg.id !== id));
  }

  function handleUpdateLeg(id, field, value) {
    setLegs((prev) => prev.map((leg) => (leg.id === id ? { ...leg, [field]: value } : leg)));
  }

  function handleMoveLeg(id, direction) {
    setLegs((prev) => {
      const index = prev.findIndex((leg) => leg.id === id);
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const updated = [...prev];
      [updated[index], updated[targetIndex]] = [updated[targetIndex], updated[index]];
      return updated;
    });
  }

  function handleSavePlan() {
    if (!validate()) return;

    const cleanedLegs = legs
      .filter((leg) => leg.route.trim())
      .map((leg) => ({
        mode: leg.mode,
        route: leg.route.trim(),
        note: leg.note.trim(),
      }));

    const newTrip = {
      id: Date.now(),
      from: form.from.trim(),
      to: form.to.trim(),
      date: form.date,
      time: form.time,
      notes: form.notes.trim(),
      legs: cleanedLegs,
    };

    const updated = [...trips, newTrip].sort((a, b) => {
      const dateA = a.date || "9999-99-99";
      const dateB = b.date || "9999-99-99";
      return dateA.localeCompare(dateB);
    });

    setTrips(updated);
    savePlannedTrips(updated);
    setIsFormOpen(false);
  }

  function handleDelete(id) {
    const updated = trips.filter((trip) => trip.id !== id);
    setTrips(updated);
    savePlannedTrips(updated);
  }

  function handleStartNow(trip) {
    navigate("/suggestions", {
      state: { from: trip.from, to: trip.to, flow: "trip-planner" },
    });
  }

  return (
    <div className="trip-planner-page">
      <header className="trip-planner-header">
        <button
          className="trip-planner-back-button"
          onClick={() => navigate("/")}
          aria-label="Go back"
        >
          <i className="bi bi-arrow-left" aria-hidden="true"></i>
          Back
        </button>

        <div className="trip-planner-header-title">
          <div className="trip-planner-header-icon">
            <i className="bi bi-journal-text" aria-hidden="true"></i>
          </div>

          <div>
            <p className="trip-planner-header-label">TARA TRIP PLANNER</p>
            <h1>Planned Trips</h1>
          </div>
        </div>
      </header>

      <main className="trip-planner-content">
        {!isFormOpen && (
          <button className="add-plan-button" onClick={handleOpenForm}>
            <i className="bi bi-plus-lg" aria-hidden="true"></i>
            Plan a new trip
          </button>
        )}

        {isFormOpen && (
          <section className="plan-form-card">
            <h2>New Planned Trip</h2>

            <div className="plan-form-group">
              <label htmlFor="plan-from">
                <i className="bi bi-circle-fill from-icon" aria-hidden="true"></i>
                From
              </label>
              <div className={`plan-input-wrapper ${errors.from ? "input-error" : ""}`}>
                <input
                  id="plan-from"
                  type="text"
                  placeholder="Enter starting location"
                  value={form.from}
                  onChange={(event) => updateField("from", event.target.value)}
                  autoFocus
                />
              </div>
              {errors.from && (
                <small className="field-error">
                  <i className="bi bi-exclamation-circle-fill" aria-hidden="true"></i>
                  {errors.from}
                </small>
              )}
            </div>

            <div className="plan-form-group">
              <label htmlFor="plan-to">
                <i className="bi bi-geo-alt-fill to-icon" aria-hidden="true"></i>
                To
              </label>
              <div className={`plan-input-wrapper ${errors.to ? "input-error" : ""}`}>
                <input
                  id="plan-to"
                  type="text"
                  placeholder="Enter destination"
                  value={form.to}
                  onChange={(event) => updateField("to", event.target.value)}
                />
              </div>
              {errors.to && (
                <small className="field-error">
                  <i className="bi bi-exclamation-circle-fill" aria-hidden="true"></i>
                  {errors.to}
                </small>
              )}
            </div>

            <div className="plan-form-row">
              <div className="plan-form-group">
                <label htmlFor="plan-date">Date</label>
                <div className="plan-input-wrapper">
                  <input
                    id="plan-date"
                    type="date"
                    value={form.date}
                    onChange={(event) => updateField("date", event.target.value)}
                  />
                </div>
              </div>

              <div className="plan-form-group">
                <label htmlFor="plan-time">Time</label>
                <div className="plan-input-wrapper">
                  <input
                    id="plan-time"
                    type="time"
                    value={form.time}
                    onChange={(event) => updateField("time", event.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="plan-form-group">
              <label htmlFor="plan-notes">Notes (optional)</label>
              <div className="plan-input-wrapper">
                <textarea
                  id="plan-notes"
                  placeholder="e.g. Bring umbrella, meeting at 9AM"
                  value={form.notes}
                  onChange={(event) => updateField("notes", event.target.value)}
                  rows={2}
                />
              </div>
            </div>

            <div className="plan-legs-section">
              <div className="plan-legs-heading">
                <div>
                  <label>Route Legs / Transfers (optional)</label>
                  <p>
                    List each ride in order — e.g. jeepney to the terminal, then bus,
                    then FX — up to 5 legs, to guide the commuter through the full trip.
                  </p>
                </div>
                <span className="plan-legs-count">{legs.length}/{MAX_LEGS}</span>
              </div>

              {legs.length > 0 && (
                <div className="plan-legs-path">
                  <div className="plan-legs-endpoint">
                    <i className="bi bi-circle-fill from-icon" aria-hidden="true"></i>
                    <span>{form.from.trim() || "Starting point"}</span>
                  </div>

                  {legs.map((leg, index) => (
                    <div className="plan-leg-entry" key={leg.id}>
                      <div className="plan-leg-connector">
                        <div className="plan-leg-connector-line"></div>
                        <div className="plan-leg-number">{index + 1}</div>
                        <div className="plan-leg-connector-line"></div>
                      </div>

                      <div className="plan-leg-card">
                        <div className="plan-leg-card-header">
                          <span>Leg {index + 1}</span>

                          <div className="plan-leg-card-actions">
                            <button
                              type="button"
                              className="plan-leg-move-button"
                              onClick={() => handleMoveLeg(leg.id, -1)}
                              disabled={index === 0}
                              aria-label={`Move leg ${index + 1} up`}
                            >
                              <i className="bi bi-arrow-up" aria-hidden="true"></i>
                            </button>
                            <button
                              type="button"
                              className="plan-leg-move-button"
                              onClick={() => handleMoveLeg(leg.id, 1)}
                              disabled={index === legs.length - 1}
                              aria-label={`Move leg ${index + 1} down`}
                            >
                              <i className="bi bi-arrow-down" aria-hidden="true"></i>
                            </button>
                            <button
                              type="button"
                              className="plan-leg-remove-button"
                              onClick={() => handleRemoveLeg(leg.id)}
                              aria-label={`Remove leg ${index + 1}`}
                            >
                              <i className="bi bi-x-lg" aria-hidden="true"></i>
                            </button>
                          </div>
                        </div>

                        <div className="plan-leg-entry-row">
                          <div className="plan-input-wrapper plan-leg-mode-select">
                            <select
                              value={leg.mode}
                              onChange={(event) => handleUpdateLeg(leg.id, "mode", event.target.value)}
                              aria-label={`Mode for leg ${index + 1}`}
                            >
                              {transportationModes.map((mode) => (
                                <option key={mode.id} value={mode.id}>
                                  {mode.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="plan-input-wrapper plan-leg-name-input">
                            <input
                              type="text"
                              placeholder="Route name (e.g. Route A, Cubao–Manila)"
                              value={leg.route}
                              onChange={(event) => handleUpdateLeg(leg.id, "route", event.target.value)}
                              aria-label={`Route name for leg ${index + 1}`}
                            />
                          </div>
                        </div>

                        <div className="plan-input-wrapper">
                          <input
                            type="text"
                            placeholder="Note (optional) — e.g. fare, transfer point"
                            value={leg.note}
                            onChange={(event) => handleUpdateLeg(leg.id, "note", event.target.value)}
                            aria-label={`Note for leg ${index + 1}`}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="plan-leg-connector plan-leg-connector-final">
                    <div className="plan-leg-connector-line"></div>
                  </div>

                  <div className="plan-legs-endpoint">
                    <i className="bi bi-geo-alt-fill to-icon" aria-hidden="true"></i>
                    <span>{form.to.trim() || "Destination"}</span>
                  </div>
                </div>
              )}

              <button
                type="button"
                className="plan-add-leg-button"
                onClick={handleAddLeg}
                disabled={legs.length >= MAX_LEGS}
              >
                <i className="bi bi-plus-lg" aria-hidden="true"></i>
                {legs.length >= MAX_LEGS ? "Maximum of 5 legs reached" : "Add another leg"}
              </button>
            </div>

            <div className="plan-form-actions">
              <button className="plan-save-button" onClick={handleSavePlan}>
                <i className="bi bi-check-lg" aria-hidden="true"></i>
                Save Plan
              </button>
              <button className="plan-cancel-button" onClick={handleCancelForm}>
                Cancel
              </button>
            </div>
          </section>
        )}

        {trips.length === 0 && !isFormOpen ? (
          <section className="trip-planner-empty">
            <div className="trip-planner-empty-icon">
              <i className="bi bi-journal-text" aria-hidden="true"></i>
            </div>
            <h2>No planned trips yet</h2>
            <p>Plan ahead by saving trips you'll take later — TARA will keep them here for quick access.</p>
          </section>
        ) : (
          <section className="planned-trips-list">
            {trips.map((trip) => (
              <article className="planned-trip-card" key={trip.id}>
                <div className="planned-trip-top">
                  <div className="planned-trip-schedule">
                    {trip.date ? (
                      <span className="planned-trip-date">
                        <i className="bi bi-calendar-event" aria-hidden="true"></i>
                        {formatDate(trip.date)}
                      </span>
                    ) : (
                      <span className="planned-trip-date planned-trip-date-unscheduled">
                        <i className="bi bi-calendar" aria-hidden="true"></i>
                        No date set
                      </span>
                    )}
                    {trip.time && (
                      <span className="planned-trip-time">
                        <i className="bi bi-clock" aria-hidden="true"></i>
                        {trip.time}
                      </span>
                    )}
                  </div>

                  <button
                    className="planned-trip-delete"
                    onClick={() => handleDelete(trip.id)}
                    aria-label="Delete planned trip"
                  >
                    <i className="bi bi-trash" aria-hidden="true"></i>
                  </button>
                </div>

                <div className="planned-trip-route">
                  <div className="planned-trip-location">
                    <i className="bi bi-circle-fill from-icon" aria-hidden="true"></i>
                    <span>{trip.from}</span>
                  </div>
                  <div className="planned-trip-route-line"></div>
                  <div className="planned-trip-location">
                    <i className="bi bi-geo-alt-fill to-icon" aria-hidden="true"></i>
                    <span>{trip.to}</span>
                  </div>
                </div>

                {trip.notes && <p className="planned-trip-notes">{trip.notes}</p>}

                {trip.legs && trip.legs.length > 0 && (
                  <div className="planned-trip-legs">
                    <span className="planned-trip-legs-label">
                      TRANSFER PLAN — {trip.legs.length} LEG{trip.legs.length > 1 ? "S" : ""}
                    </span>

                    <div className="planned-trip-legs-path">
                      {trip.legs.map((leg, index) => {
                        const modeInfo = getModeInfo(leg.mode);
                        const isLast = index === trip.legs.length - 1;
                        return (
                          <div className="planned-trip-leg" key={index}>
                            <div className="planned-trip-leg-marker">
                              <div className="planned-trip-leg-icon">
                                <i className={`bi ${modeInfo.icon}`} aria-hidden="true"></i>
                              </div>
                              {!isLast && <div className="planned-trip-leg-line"></div>}
                            </div>

                            <div className="planned-trip-leg-info">
                              <span>
                                Leg {index + 1} · {modeInfo.name}
                              </span>
                              <strong>{leg.route}</strong>
                              {leg.note && <p>{leg.note}</p>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <button
                  className="planned-trip-start-button"
                  onClick={() => handleStartNow(trip)}
                >
                  <span>Find routes for this trip</span>
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

export default TripPlanner;