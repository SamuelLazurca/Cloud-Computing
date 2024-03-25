import { useState } from "react";
import axios from "axios";
import { API_URL } from "../constants";

const TICKET_API_URL = `${API_URL}/ticket`;

interface Movie {
  movie_id: string;
  movie: string;
}

interface UserInput {
  name: string;
  email: string;
  location: string;
}

interface BuyTicketPageProps {
  movieData: Movie;
}

const BuyTicketPage: React.FC<BuyTicketPageProps> = ({ movieData }) => {
  const [userData, setUserData] = useState<UserInput>({
    name: "",
    email: "",
    location: "Movies Shop Cinema",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
  };

  const handleGenerateTicket = () => {
    console.log("Generating ticket:", userData, movieData);

    let alertSuccess = document.getElementById("alert-success");
    if (alertSuccess) {
      alertSuccess.style.display = "none";
    }

    let data = {
      ...userData,
      ...movieData,
    };
    console.log("Ticket data:", data);
    axios.post(TICKET_API_URL, data).catch((error) => {
      console.error("Error generating ticket:", error);
      alert("Failed to generate ticket. Please try again.");
      return;
    });

    alertSuccess = document.getElementById("alert-success");
    if (alertSuccess) {
      alertSuccess.style.display = "block";
    }
  };

  return (
    <div>
      <h2>Movie: {movieData.movie}</h2>
      <form>
        <label className="form-label">
          Name:
          <input
            type="text"
            name="name"
            value={userData.name}
            onChange={handleInputChange}
            className="form-control"
          />
        </label>
        <br />
        <label className="form-label">
          Email:
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleInputChange}
            className="form-control"
          />
        </label>
        <br />
        <div
          className="alert alert-success"
          id="alert-success"
          style={{ display: "none" }}
        >
          Thank You for choosing us!
        </div>
        <br />
        <button
          type="button"
          onClick={handleGenerateTicket}
          className="btn btn-primary mb-3"
        >
          Generate Ticket
        </button>
      </form>
    </div>
  );
};

export default BuyTicketPage;
