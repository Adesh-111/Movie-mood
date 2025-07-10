import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MovieArea from "./components/MoviesArea/MoviesArea";
import MovieDetailPage from "./components/MovieDetailModel/MovieDetailPage";
import { Analytics } from "@vercel/analytics/next"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MovieArea />} />
        <Route path="/movie/:id" element={<MovieDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;