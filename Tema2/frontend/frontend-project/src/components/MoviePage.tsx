import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BuyTicketPage from "./BuyTicketPage";
import axios from "axios";
import { API_URL } from "../constants";

const MOVIES_URL = `${API_URL}/movies`;

interface Tag {
  id: number;
  name: string;
}

interface Movie {
  id: string;
  title: string;
  director: string;
  year: number;
  rating: number;
  tags: Tag[];
}

const MoviePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const response = await fetch(`${MOVIES_URL}/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch movie data");
        }
        const data = await response.json();
        setMovie(data);
      } catch (error) {
        console.error("Error fetching movie data:", error);
      }
    };

    fetchMovieData();
  }, [id]);

  if (!movie) {
    return <div>Loading...</div>;
  }

  const handleDelete = async () => {
    try {
      await axios.delete(`${MOVIES_URL}/${movie.id}`);
      alert("Movie deleted successfully");
      window.location.href = "/";
    } catch (error) {
      console.error("Error deleting movie:", error);
      alert("Failed to delete movie. Please try again.");
    }
  };

  return (
    <>
      <div className="container mt-5">
        <div className="card">
          <img
            className="card-img-top"
            src={`${MOVIES_URL}/image/${movie?.id}`}
            alt="Movies Shop Cinema"
          ></img>
          <div className="card-body">
            <h5 className="card-title">{movie.title}</h5>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <strong>Director:</strong> {movie.director}
              </li>
              <li className="list-group-item">
                <strong>Release Year:</strong> {movie.year}
              </li>
              <li className="list-group-item">
                <strong>Rating:</strong> {movie.rating}
              </li>
            </ul>
            <div className="mt-3">
              {movie.tags.length > 0 &&
                movie.tags.map((tag) => (
                  <span key={tag.id} className="badge bg-secondary me-1">
                    {tag.name}
                  </span>
                ))}
            </div>
            <button
              className="btn btn-primary mt-3"
              data-bs-toggle="modal"
              data-bs-target="#buyTicketModal"
            >
              Buy Ticket
            </button>
            <button className="btn btn-primary mt-3" onClick={handleDelete}>
              Delete Movie
            </button>
            <div
              className="modal fade"
              id="buyTicketModal"
              tabIndex={-1}
              aria-labelledby="buyTicketModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="buyTicketModalLabel">
                      Buy Ticket
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    <BuyTicketPage
                      movieData={{ movie_id: movie.id, movie: movie.title }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MoviePage;
