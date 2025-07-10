import { useEffect, useState } from "react";
import axios from "axios";
import "./MoviesArea.css";
import data from "../../Context/ContextAPI";

function MovieArea() {
  const [movieData, setMovieData] = useState([]);
  const [genres, setGenres] = useState([]);
  const apiKey = import.meta.env.VITE_API_KEY;
  const today = new Date().toISOString().split("T")[0];
  const lastMonth = new Date();
  lastMonth.setDate(lastMonth.getDate() - 30);
  const startDate = lastMonth.toISOString().split("T")[0];

  useEffect(() => {
    async function getAllMovies() {
      try {
        const allResults = [];
        for (let page = 1; page <= 15; page++) {
          const response = await axios.get(
            `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&primary_release_date.gte=${startDate}&primary_release_date.lte=${today}&sort_by=primary_release_date.desc&page=${page}`
          );
          allResults.push(...response.data.results);
        }
        setMovieData(allResults);
      } catch (e) {
        console.error("Error fetching movies:", e);
      }
    }

    async function getGenres() {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`
        );
        setGenres(response.data.genres);
      } catch (e) {
        console.error("Error fetching genres:", e);
      }
    }

    getAllMovies();
    getGenres();
  }, []);

  const getGenreNames = (genreIds) => {
    return genreIds
      .map((id) => {
        const genreObj = genres.find((g) => g.id === id);
        return genreObj ? genreObj.name : null;
      })
      .filter(Boolean)
      .join(", ");
  };

  return (
    <>
      <h2 className="movie-list-h2">Recent movies</h2>
      <div className="movie-grid">
        {movieData
          .filter((movie) => movie.poster_path)
          .map((movie) => (
            <div key={movie.id} className="movie-card">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
              />
              <h3>{movie.title}</h3>
              <p className="genres" style={{ marginBottom: "10px" }}>
                <strong>Genres:</strong> {getGenreNames(movie.genre_ids)}
              </p>
              <p className="rating">
                <img src={data.icons.star} alt="" />{" "}
                {movie.vote_average === 0 ? "No rating" : movie.vote_average}
              </p>
              <p className="release">
                <img src={data.icons.date} alt="" /> {movie.release_date}
              </p>
              <p className="overview">{movie.overview}</p>
            </div>
          ))}
      </div>
    </>
  );
}

export default MovieArea;
