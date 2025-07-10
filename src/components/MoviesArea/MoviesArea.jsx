import { useEffect, useState, useRef } from "react";
import axios from "axios";
import EmojiArea from "../EmojiArea/EmojiArea";
import "./MoviesArea.css";
import data from "../../Context/ContextAPI";
import { useNavigate } from "react-router-dom";

function MovieArea() {
  const [movieData, setMovieData] = useState([]);
  const [genres, setGenres] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [sortOption, setSortOption] = useState("none"); 
  const [languageFilter, setLanguageFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const apiKey = import.meta.env.VITE_API_KEY;
  const navigate = useNavigate();
  const movieGridRef = useRef(null);

  const importantLanguages = [
    "en", "hi", "es", "fr", "zh", "ja", "ko", "de", "ru", "it", "pt", "ar", "tr",
    "ta", "te", "ml", "kn", "bn", "mr", "pa", "gu", "or", "ur"
  ];

  useEffect(() => {
    async function getGenres() {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`
      );
      setGenres(data.genres);
    }
    getGenres();
  }, [apiKey]);

  useEffect(() => {
    async function getLanguages() {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/configuration/languages?api_key=${apiKey}`
      );
      const filtered = data.filter((l) =>
        importantLanguages.includes(l.iso_639_1)
      );
      setLanguages(filtered);
    }
    getLanguages();
  }, [apiKey]);

  useEffect(() => {
    setPage(1);
    setMovieData([]);
    setHasMore(true);
    setIsLoading(false); 
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedGenre, searchQuery, languageFilter, ratingFilter, sortOption]); 

  useEffect(() => {
    async function fetchMovies() {
      if (!hasMore || isLoading) return;
      setIsLoading(true);
      
      const today = new Date().toISOString().split("T")[0];
      const lastMonth = new Date();
      lastMonth.setDate(lastMonth.getDate() - 30);
      const startDate = lastMonth.toISOString().split("T")[0];

      let url = "";
      let langParam =
        languageFilter !== "all" ? `&with_original_language=${languageFilter}` : "";
      
      if (!searchQuery && !selectedGenre) {
        url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&primary_release_date.gte=${startDate}&primary_release_date.lte=${today}&sort_by=primary_release_date.desc&page=${page}${langParam}`;
      } else if (searchQuery) {
        url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
          searchQuery
        )}&page=${page}${langParam}`;
      } else if (selectedGenre) {
        url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${selectedGenre}&sort_by=popularity.desc&vote_count.gte=50&page=${page}${langParam}`;
      }
      
      try {
        const response = await axios.get(url);
        console.log(`Page ${page} loaded:`, response.data.results.length, 'movies');
        console.log(`Total pages available:`, response.data.total_pages);
        
        setMovieData((prev) => {
          if (page === 1) {
            return response.data.results;
          } else {
            const existingIds = new Set(prev.map(movie => movie.id));
            const newMovies = response.data.results.filter(movie => !existingIds.has(movie.id));
            console.log(`New unique movies added:`, newMovies.length);
            return [...prev, ...newMovies];
          }
        });
        
        if (response.data.results.length === 0) {
          setHasMore(false);
        } else if (page >= response.data.total_pages) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      } catch (err) {
        console.error("Error fetching movies:", err);
        setHasMore(false);
      }
      setIsLoading(false);
    }
    fetchMovies();
  }, [page, selectedGenre, searchQuery, apiKey, languageFilter]);

  useEffect(() => {
    if (!hasMore || isLoading) return;
    
    const handleScroll = () => {
      const threshold = 200; 
      const distanceFromBottom = document.documentElement.scrollHeight - 
                                 window.innerHeight - 
                                 window.scrollY;
      
      if (distanceFromBottom < threshold) {
        setPage((prev) => prev + 1);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, isLoading]);

  const filteredMovies = movieData.filter((movie) => {
    if (ratingFilter !== "all") {
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
    }
    return true;
  });

  const languageFilteredMovies =
    languageFilter === "all"
      ? filteredMovies
      : filteredMovies.filter(
          (movie) => movie.original_language === languageFilter
        );

  const sortedMovies = [...languageFilteredMovies].sort((a, b) => {
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
      case "none":
      default:
        return 0;
    }
  });

  const getGenreNames = (genreIds) =>
    genreIds
      .map((id) => genres.find((g) => g.id === id)?.name)
      .filter(Boolean)
      .join(", ");

  const getLanguageName = (langCode) => {
    const langObj = languages.find((l) => l.iso_639_1 === langCode);
    return langObj ? langObj.english_name : langCode;
  };

  const getSelectedGenreName = () => {
    if (!selectedGenre) return null;
    const genreObj = genres.find((g) => g.id === selectedGenre);
    return genreObj ? genreObj.name : null;
  };

  let title = "";
  if (searchQuery) {
    title = `Search results for "${searchQuery}"`;
  } else if (selectedGenre) {
    const genreName = getSelectedGenreName();
    title = genreName ? `${genreName} Movies` : "Movies by Selected Mood";
  } else {
    title = "Recent Movies";
  }

  return (
    <>
      <EmojiArea
        onSelectGenre={(gid) => {
          setSearchQuery("");
          setSelectedGenre(gid);
        }}
      />
      <h2 className="movie-list-h2">{title}</h2>
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
          <option value="none">Sort By: None</option>
          <option value="release_desc">Release: Newest First</option>
          <option value="release_asc">Release: Oldest First</option>
          <option value="rating_desc">Rating: High to Low</option>
          <option value="rating_asc">Rating: Low to High</option>
          <option value="popularity">Popularity</option>
        </select>
        <select
          value={languageFilter}
          onChange={(e) => setLanguageFilter(e.target.value)}
        >
          <option value="all">All Languages</option>
          {languages.map((lang) => (
            <option key={lang.iso_639_1} value={lang.iso_639_1}>
              {lang.english_name}
            </option>
          ))}
        </select>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search movies by title..."
            value={searchQuery}
            onChange={(e) => {
              setSelectedGenre(null);
              setSearchQuery(e.target.value);
            }}
          />
        </div>
      </div>

      <div className="movie-grid" ref={movieGridRef}>
        {sortedMovies.length === 0 && !isLoading ? (
          <div>No movies found.</div>
        ) : (
          sortedMovies
            .filter((movie) => movie.poster_path)
            .map((movie) => (
              <div
                key={movie.id}
                className="movie-card"
                onClick={() => navigate(`/movie/${movie.id}`)}
                style={{ cursor: "pointer" }}
              >
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
                <p className="language">
                  <strong>Language:</strong> {getLanguageName(movie.original_language)}
                </p>
                <p className="overview">{movie.overview}</p>
              </div>
            ))
        )}
      </div>
      
      {isLoading && (
        <div style={{ textAlign: "center", padding: "2em" }}>
          <div>Loading more movies...</div>
        </div>
      )}
      
      {!hasMore && sortedMovies.length > 0 && (
        <div style={{ textAlign: "center", padding: "2em", color: "#666" }}>
          No more movies to load.
        </div>
      )}
    </>
  );
}

export default MovieArea;