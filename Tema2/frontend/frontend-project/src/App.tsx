import MoviesPage from "./components/MoviesPage";
import MoviePage from "./components/MoviePage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<MoviesPage />} />
          <Route path="/movies/:id" element={<MoviePage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
