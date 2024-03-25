interface Movie {
  id: number;
  title: string;
  director: string;
  year: number;
  rating: number;
}

interface MovieProps {
  movie: Movie;
}

function MovieComponent({ movie }: MovieProps) {
  return (
    <>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{movie.title}</h5>
          <p className="card-text">Director: {movie.director}</p>
          <p className="card-text">Year: {movie.year}</p>
          <p className="card-text">Rating: {movie.rating}</p>
        </div>
      </div>
    </>
  );
}

export default MovieComponent;
