import "./SplashScreen.css";
import taraLogo from "../../assets/taraLogo.png";

function SplashScreen() {
  return (
    <div className="splash-screen">
      <div className="splash-content">

        <img
          src={taraLogo}
          alt="TARA Transportasyon"
          className="splash-logo"
        />

        <div className="splash-tagline">
          <span>YOUR</span>
          <strong>RIDE.</strong>
          <span>YOUR</span>
          <strong>WAY.</strong>
        </div>

        <div className="splash-loading">
          <div className="loading-bar"></div>
        </div>

        <p>Making your commute easier.</p>

      </div>
    </div>
  );
}

export default SplashScreen;