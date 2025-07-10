import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getMovieDetails,
  getMovieCast,
  getMovieVideos,
  getMovieReviews,
  getSimilarMovies,
  getMovieReleaseDates, 
} from "../../api/movieApi";
import "./MovieDetailPage.css";

export default function MovieDetailPage() {
  const { id } = useParams();
  const [details, setDetails] = useState(null);
  const [cast, setCast] = useState([]);
  const [director, setDirector] = useState("");
  const [trailerKey, setTrailerKey] = useState("");
  const [reviews, setReviews] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [certification, setCertification] = useState(""); 
  const [loading, setLoading] = useState(true);

  const [soundOn, setSoundOn] = useState(false);
  const playerRef = useRef(null);
  const ytPlayerRef = useRef(null);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      try {
        const [
          { data: detailsData },
          { data: castData },
          { data: videosData },
          { data: reviewsData },
          { data: similarData },
          { data: releaseDatesData }, 
        ] = await Promise.all([
          getMovieDetails(id),
          getMovieCast(id),
          getMovieVideos(id),
          getMovieReviews(id),
          getSimilarMovies(id),
          getMovieReleaseDates(id), 
        ]);
        setDetails(detailsData);
        setCast(castData.cast.slice(0, 8));

        const directorInfo = castData.crew.find(
          (member) => member.job === "Director"
        );
        setDirector(directorInfo ? directorInfo.name : "N/A");

        const trailer = videosData.results.find(
          (v) => v.type === "Trailer" && v.site === "YouTube"
        );
        setTrailerKey(trailer ? trailer.key : "");
        setReviews(reviewsData.results.slice(0, 3));
        setSimilar(similarData.results.slice(0, 6));
        const usRelease = releaseDatesData.results.find(
          (release) => release.iso_3166_1 === "US"
        );
        if (usRelease && usRelease.release_dates.length > 0) {
          const latestCertification =
            usRelease.release_dates[usRelease.release_dates.length - 1]
              .certification;
          setCertification(latestCertification || "N/A");
        } else {
          setCertification("N/A");
        }
      } catch (e) {
        console.error("Error fetching movie details:", e);
        setCertification("N/A");
      }
      setLoading(false);
    }
    fetchAll();
  }, [id]);

  useEffect(() => {
    if (!trailerKey) return;

    function createPlayer() {
      if (!playerRef.current) return;

      ytPlayerRef.current = new window.YT.Player(playerRef.current, {
        videoId: trailerKey,
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          showinfo: 0,
          loop: 1,
          playlist: trailerKey,
          modestbranding: 1,
          cc_load_policy: 1,
        },
        events: {
          onReady: (event) => {
            event.target.setPlaybackQuality("medium");
            event.target.playVideo();
            event.target.mute();
          },
        },
      });
    }

    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
      window.onYouTubeIframeAPIReady = createPlayer;
    }
  }, [trailerKey]);

  useEffect(() => {
    if (!ytPlayerRef.current) return;
    if (soundOn) {
      ytPlayerRef.current.unMute();
    } else {
      ytPlayerRef.current.mute();
    }
  }, [soundOn]);

  if (loading || !details)
    return (
      <div className="detail-page-container">
        <div className="page-content">Loading...</div>
      </div>
    );

  const formatRuntime = (minutes) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  return (
    <div className="detail-page-container">
      {trailerKey && (
        <div className="bg-trailer">
          <div className="yt-bg-aspect">
            <div ref={playerRef} className="yt-player-iframe"></div>
          </div>
          <div className="bg-gradient"></div>
          <button
            className="sound-toggle-btn"
            aria-label={soundOn ? "Mute trailer" : "Unmute trailer"}
            onClick={() => setSoundOn((v) => !v)}
          >
            {soundOn ? (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff">
                <path d="M3 10v4h4l5 5V5l-5 5H3zm13.5 2c0-1.77-1-3.29-2.5-4.03v8.06c1.5-.74 2.5-2.26 2.5-4.03z"/>
              </svg>
            ) : (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff">
                <path d="M16.5 12c0-1.77-1-3.29-2.5-4.03v1.73l2.51 2.51c-.01-.07-.01-.14-.01-.21zm3.49 7.49-1.41 1.41-3.58-3.58C14.18 17.65 13.12 18 12 18c-4.41 0-8-3.59-8-8 0-1.12.35-2.18.93-3.09L1.51 3.51 2.92 2.1l19.8 19.8-1.41 1.41-1.32-1.32zm-9.21-3.62L5.17 15c-.45-.36-.87-.79-1.25-1.27C4.44 14.22 4.97 14.5 5.5 14.5h1.79l1.49 1.37z"/>
              </svg>
            )}
          </button>
        </div>
      )}
      <div className="page-content content-overlay">
        <Link to="/" className="back-link">← Back to Movies</Link>
        
        <h2>{details.title}</h2>
        <div className="movie-desc">
           <img
          src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
          alt={details.title}
          style={{ width: 300, borderRadius: 8, marginBottom: 16 }}
        />
        <div>
          <p>{details.overview}</p>
          <p>
            <strong>Release Date:</strong> {details.release_date}
          </p>
          <p>
            <strong>Rating:</strong> {details.vote_average.toFixed(1)} / 10
          </p>
          <p>
            <strong>Language:</strong> {details.spoken_languages.map(lang => lang.english_name).join(', ') || 'N/A'}
          </p>
          <p>
            <strong>Genre:</strong> {details.genres.map(genre => genre.name).join(', ') || 'N/A'}
          </p>
          <p>
            <strong>Duration:</strong> {formatRuntime(details.runtime)}
          </p>
          <p>
            <strong>Director:</strong> {director}
          </p>
          <p>
            <strong>Certification:</strong> {certification}
          </p>
        </div>
       
        </div>
       
        <h3>Cast</h3>
        <div className="cast-list">
          {cast.map((actor) => (
            <div key={actor.cast_id || actor.credit_id} className="cast-item">
              {actor.profile_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w92${actor.profile_path}`}
                  alt={actor.name}
                />
              )}
              <p>
                {actor.name} <br />
                <span>as {actor.character}</span>
              </p>
            </div>
          ))}
        </div>
        
        <h3>Reviews</h3>
        <div className="reviews">
        {reviews.length ? (
          reviews.map((r) => (
            <div key={r.id} className="review">
              <strong>{r.author}</strong>
              <p>
                {r.content.slice(0, 300)}
                {r.content.length > 300 ? "..." : ""}
              </p>
            </div>
          ))
        ) : (
          <p>No reviews found.</p>
        )}</div>
        <h3>Similar Movies</h3>
        <div className="similar-movies">
          {similar.map((m) => (
            <Link to={`/movie/${m.id}`} key={m.id} className="similar-card">
              {m.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w154${m.poster_path}`}
                  alt={m.title}
                />
              )}
              <div>{m.title}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}