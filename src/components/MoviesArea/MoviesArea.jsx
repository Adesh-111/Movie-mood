import { useEffect, useState, useRef } from "react";
import axios from "axios";
import EmojiArea from "../EmojiArea/EmojiArea";
import "./MoviesArea.css";
import data from "../../Context/ContextAPI";

function MovieArea() {
  const [movieData, setMovieData] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [sortOption, setSortOption] = useState("release_desc");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const apiKey = import.meta.env.VITE_API_KEY;

  const observer = useRef();

  useEffect(() => {
    async function getGenres() {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`
      );
      setGenres(data.genres);
    }
    getGenres();
  }, [apiKey]);

  // Reset to page 1 and clear movies on filter/search/genre change
  useEffect(() => {
    setPage(1);
    setMovieData([]);
    setHasMore(true);
  }, [selectedGenre, searchQuery]);

  useEffect(() => {
    async function fetchMovies() {
      if (!hasMore || isLoading) return;
      setIsLoading(true);
      const today = new Date().toISOString().split("T")[0];
      const lastMonth = new Date();
      lastMonth.setDate(lastMonth.getDate() - 30);
      const startDate = lastMonth.toISOString().split("T")[0];

      let url = "";
      if (!searchQuery && !selectedGenre) {
        url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&primary_release_date.gte=${startDate}&primary_release_date.lte=${today}&sort_by=primary_release_date.desc&page=${page}`;
      } else if (searchQuery) {
        url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
          searchQuery
        )}&page=${page}`;
      } else if (selectedGenre) {
        url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${selectedGenre}&sort_by=vote_average.desc&vote_count.gte=200&page=${page}`;
      }
      try {
        const response = await axios.get(url);
        setMovieData((prev) =>
          page === 1 ? response.data.results : [...prev, ...response.data.results]
        );
        if (page >= response.data.total_pages || response.data.results.length === 0) {
          setHasMore(false);
        }
      } catch (err) {
        setHasMore(false);
      }
      setIsLoading(false);
    }
    fetchMovies();
  }, [page, selectedGenre, searchQuery, apiKey]);
  useEffect(() => {
    if (!hasMore || isLoading) return;
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 100 >=
        document.documentElement.offsetHeight
      ) {
        setPage((prev) => prev + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, isLoading]);

  const filteredMovies = movieData.filter((movie) => {
    if (!movie.vote_average) return false;
    switch (ratingFilter) {
      case "above7":
        return movie.vote_average > 7;
      case "5to7":
        return movie.vote_average >= 5 && movie.vote_average <= 7;
      case "below5":
        return movie.vote_average < 5;
      default:
        return true;
    }
  });

  const sortedMovies = [...filteredMovies].sort((a, b) => {
    switch (sortOption) {
      case "rating_desc":
        return b.vote_average - a.vote_average;
      case "rating_asc":
        return a.vote_average - b.vote_average;
      case "release_desc":
        return new Date(b.release_date) - new Date(a.release_date);
      case "release_asc":
        return new Date(a.release_date) - new Date(b.release_date);
      case "popularity":
        return b.popularity - a.popularity;
      default:
        return 0;
    }
  });

  const getGenreNames = (genreIds) =>
    genreIds
      .map((id) => genres.find((g) => g.id === id)?.name)
      .filter(Boolean)
      .join(", ");

  return (
    <>
      <EmojiArea
        onSelectGenre={(gid) => {
          setSearchQuery("");
          setSelectedGenre(gid);
        }}
      />
       <h2 className="movie-list-h2">
          {searchQuery
            ? `Search results for "${searchQuery}"`
            : selectedGenre
            ? "Movies by Selected Mood"
            : "Recent Movies"}
        </h2>
      <div className="filter-sort-bar">
       
        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
        >
          <option value="all">All Ratings</option>
          <option value="above7">Above 7</option>
          <option value="5to7">Between 5 and 7</option>
          <option value="below5">Below 5</option>
        </select>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="release_desc">Release: Newest First</option>
          <option value="release_asc">Release: Oldest First</option>
          <option value="rating_desc">Rating: High to Low</option>
          <option value="rating_asc">Rating: Low to High</option>
          <option value="popularity">Popularity</option>
        </select>
        <div className="search-bar">
          <input
            type="text"
            placeholder="🔍 Search movies by title..."
            value={searchQuery}
            onChange={(e) => {
              setSelectedGenre(null);
              setSearchQuery(e.target.value);
            }}
          />
        </div>
      </div>

      <div className="movie-grid">
        {sortedMovies.length === 0 ? (
          <div>No movies found.</div>
        ) : (
          sortedMovies
            .filter((movie) => movie.poster_path)
            .map((movie) => (
              <div key={movie.id} className="movie-card">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                />
                <h3>{movie.title}</h3>
                <p className="genres">
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
            ))
        )}
      </div>
      {isLoading && (
        <div style={{ textAlign: "center", padding: "1em" }}>Loading...</div>
      )}
      {!hasMore && (
        <div style={{ textAlign: "center", padding: "1em" }}>
          No more movies to load.
        </div>
      )}
    </>
  );
}

export default MovieArea;