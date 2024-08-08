import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/signin";
import RegisterPage from "./pages/signup";
import Connect from "./pages/connect";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/about" element={<RegisterPage />} />
        <Route path="/connect" element={<Connect />} />
      </Routes>
    </Router>
  );
};

export default App;
