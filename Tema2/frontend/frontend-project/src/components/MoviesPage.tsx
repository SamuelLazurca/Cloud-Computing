import { useEffect, useState } from "react";
import MovieComponent from "./MovieComponent";
import { Link } from "react-router-dom";
import AddMovie from "./AddMovie";
import { API_URL } from "../constants";

interface Movie {
  id: number;
  title: string;
  director: string;
  year: number;
  rating: number;
}

function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);

  const URL = `${API_URL}/movies`;

  const getMovies = async () => {
    try {
      const response = await fetch(URL);
      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }
      const data = await response.json();
      setMovies(data.movies);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  useEffect(() => {
    getMovies();
  }, []);

  return (
    <>
      <div className="container mt-5">
        <h1 className="text-center mb-4">Movies Shop</h1>
        <button
          className="btn btn-primary mb-4"
          data-bs-toggle="modal"
          data-bs-target="#addMovieModal"
        >
          Add Movie
        </button>
        <div
          className="modal fade"
          id="addMovieModal"
          tabIndex={-1}
          aria-labelledby="addMovieModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="addMovieModalLabel">
                  Add Movie
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <AddMovie />
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          {movies.length > 0 ? (
            movies.map((movie, index) => (
              <div className="col-lg-4 mb-4" key={index}>
                <Link
                  to={`/movies/${movie.id}`}
                  className="text-decoration-none"
                >
                  <MovieComponent movie={movie} />
                </Link>
              </div>
            ))
          ) : (
            <p className="text-center">No movies available</p>
          )}
        </div>
      </div>
    </>
  );
}

export default MoviesPage;
