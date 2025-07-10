import axios from "axios";

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export const getMovieDetails = (id) =>
  axios.get(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);

export const getMovieCast = (id) =>
  axios.get(`${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}`);

export const getMovieVideos = (id) =>
  axios.get(`${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}`);

export const getMovieReviews = (id) =>
  axios.get(`${BASE_URL}/movie/${id}/reviews?api_key=${API_KEY}`);

export const getSimilarMovies = (id) =>
  axios.get(`${BASE_URL}/movie/${id}/similar?api_key=${API_KEY}`);

export const getMovieReleaseDates = (id) =>
  axios.get(`${BASE_URL}/movie/${id}/release_dates?api_key=${API_KEY}`); 