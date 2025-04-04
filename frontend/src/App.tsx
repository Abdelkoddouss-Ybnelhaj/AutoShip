import "./App.css";
import LandingPage from "./pages"; // Adjust if your landing page path differs
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import necessary routing components

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
