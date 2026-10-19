import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import SplashScreen from "./components/SplashScreen/SplashScreen";

import Home from "./pages/Home/Home";
import RouteInput from "./pages/RouteInput/RouteInput";
import Suggestions from "./pages/Suggestions/Suggestions";
import TripSummary from "./pages/TripSummary/TripSummary";
import Map from "./pages/Map/Map";
import TripStatus from "./pages/TripStatus/TripStatus";
import CityFilter from "./pages/CityFilter/CityFilter";
import ModeFilter from "./pages/ModeFilter/ModeFilter";
import RouteFilter from "./pages/RouteFilter/RouteFilter";
import Favorites from "./pages/Favorites/Favorites";
import Profile from "./pages/Profile/Profile";
import TripPlanner from "./pages/TripPlanner/TripPlanner";
import Settings from "./pages/Settings/Settings";
import FrequentTrips from "./pages/FrequentTrips/FrequentTrips";
import NotFound from "./pages/NotFound/NotFound";

function App() {
  const [showSplash, setShowSplash] = useState(
    () => !sessionStorage.getItem("tara_splash_shown")
  );

  useEffect(() => {
    if (!showSplash) return;

    const timer = setTimeout(() => {
      setShowSplash(false);
      sessionStorage.setItem("tara_splash_shown", "true");
    }, 2500);

    return () => clearTimeout(timer);
  }, [showSplash]);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/manual" element={<CityFilter />} />
        <Route path="/route-input" element={<RouteInput />} />
        <Route path="/suggestions" element={<Suggestions />} />
        <Route path="/map" element={<Map />} />
        <Route path="/trip-status" element={<TripStatus />} />
        <Route path="/city-filter" element={<CityFilter />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/frequent-trips" element={<FrequentTrips />} />
        <Route path="/trip-planner" element={<TripPlanner />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/mode-filter" element={<ModeFilter />} />
        <Route path="/route-filter" element={<RouteFilter />} />
        <Route path="/trip-summary" element={<TripSummary />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
