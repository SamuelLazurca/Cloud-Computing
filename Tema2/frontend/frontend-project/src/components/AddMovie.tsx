import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../constants";

const TAGS_URL = `${API_URL}/tags`;
const ADD_MOVIE_URL = `${API_URL}/movies`;

interface Tag {
  id: string;
  name: string;
}

function AddMovie() {
  const [tags, setTags] = useState<Tag[]>([]);

  const getTags = async () => {
    try {
      const response = await fetch(TAGS_URL);
      if (!response.ok) {
        throw new Error("Failed to fetch tags");
      }
      const data = await response.json();
      setTags(data.tags);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  useEffect(() => {
    getTags();
  }, []);

  const handleAddMovie = (e: React.FormEvent) => {
    e.preventDefault();
    const title = (document.getElementById("title") as HTMLInputElement).value;
    const director = (document.getElementById("director") as HTMLInputElement)
      .value;
    const year = (document.getElementById("year") as HTMLInputElement).value;
    const rating = (document.getElementById("rating") as HTMLInputElement)
      .value;
    const tags = Array.from(
      document.querySelectorAll<HTMLInputElement>("#tags input:checked")
    ).map((tag) => tag.value);
    const image = (document.getElementById("image") as HTMLInputElement).files;
    const formData = new FormData();
    const movieData = {
      title,
      director,
      year,
      rating,
      tags,
    };

    formData.append("data", JSON.stringify(movieData));
    formData.append("file", image ? image[0] : "logo.pdf");

    axios
      .post(ADD_MOVIE_URL, formData)
      .then(() => {
        alert("Movie added successfully");
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error adding movie:", error);
        alert("Something went wrong. Please try again.");
      });
  };

  return (
    <>
      <form>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input type="text" className="form-control" id="title" required />
        </div>
        <div className="mb-3">
          <label htmlFor="director" className="form-label">
            Director
          </label>
          <input type="text" className="form-control" id="director" required />
        </div>
        <div className="mb-3">
          <label htmlFor="year" className="form-label">
            Year
          </label>
          <input
            type="number"
            className="form-control"
            id="year"
            defaultValue={2024}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="rating" className="form-label">
            Rating
          </label>
          <input
            type="number"
            className="form-control"
            id="rating"
            defaultValue={10}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="image" className="form-label">
            Image
          </label>
          <input type="file" className="form-control" id="image" />
        </div>
        <div className="mb-3">
          <label htmlFor="tags" className="form-label">
            Tags
          </label>

          <form id="tags">
            {tags.map((tag) => (
              <div key={tag.id} className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={tag.id}
                  value={tag.id}
                />
                <label htmlFor={tag.id} className="form-check-label">
                  {tag.name}
                </label>
              </div>
            ))}
          </form>
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          onClick={handleAddMovie}
        >
          Add Movie
        </button>
      </form>
    </>
  );
}

export default AddMovie;
