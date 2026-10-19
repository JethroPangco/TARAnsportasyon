import "./StepProgress.css";

const defaultSteps = ["City", "Mode", "Route"];

function StepProgress({ currentStep, steps = defaultSteps }) {
  return (
    <div className="step-progress" role="list" aria-label="Progress">
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isActive = stepNumber === currentStep;

        return (
          <div className="step-progress-item" key={label} role="listitem">
            <div
              className={`step-progress-circle ${isCompleted ? "completed" : ""} ${isActive ? "active" : ""}`}
              aria-current={isActive ? "step" : undefined}
            >
              {isCompleted ? (
                <i className="bi bi-check-lg" aria-hidden="true"></i>
              ) : (
                stepNumber
              )}
            </div>

            <span className={`step-progress-label ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""}`}>
              {label}
            </span>

            {stepNumber < steps.length && (
              <div className={`step-progress-line ${isCompleted ? "completed" : ""}`}></div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default StepProgress;