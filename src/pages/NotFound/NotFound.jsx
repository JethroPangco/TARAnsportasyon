import { Link } from "react-router-dom";
import "./NotFound.css";

function NotFound() {
  return (
    <main className="not-found-page">
      <div className="not-found-icon">
        <i className="bi bi-map" aria-hidden="true"></i>
      </div>
      <p className="not-found-label">PAGE NOT FOUND</p>
      <h1>We couldn't find that page</h1>
      <p className="not-found-description">
        The link may be outdated or the address may have been entered
        incorrectly.
      </p>
      <Link className="not-found-home-link" to="/">
        <i className="bi bi-house" aria-hidden="true"></i>
        Back to Home
      </Link>
    </main>
  );
}

export default NotFound;
