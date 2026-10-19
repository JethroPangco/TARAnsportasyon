import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import taraLogo from "../../assets/taraLogo.png";

function Navbar() {
  const navigate = useNavigate();

  return (
    <header className="tara-navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <img src={taraLogo} alt="TARA Transportasyon" />
        </Link>

        <button
          className="navbar-settings-button"
          aria-label="Settings"
          onClick={() => navigate("/settings")}
        >
          <i className="bi bi-gear" aria-hidden="true"></i>
        </button>
      </div>
    </header>
  );
}

export default Navbar;