
"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [index, setIndex] = useState(0);
  const [history, setHistory] = useState([0]);
  const [historyPosition, setHistoryPosition] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMovies() {
      try {
        const response = await fetch("/api/movies");

        if (!response.ok) {
          throw new Error("Could not fetch movies");
        }

        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
          throw new Error("No movies found");
        }

        setMovies(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadMovies();
  }, []);

  function nextMovie() {
    if (!movies.length) return;

    let next;
    do {
      next = Math.floor(Math.random() * movies.length);
    } while (movies.length > 1 && next === index);

    const newHistory = history.slice(0, historyPosition + 1);
    newHistory.push(next);

    setHistory(newHistory);
    setHistoryPosition(newHistory.length - 1);
    setIndex(next);
  }

  function previousMovie() {
    if (historyPosition === 0) return;

    const previousPosition = historyPosition - 1;
    setHistoryPosition(previousPosition);
    setIndex(history[previousPosition]);
  }

  const movie = movies[index];

  if (loading) {
    return (
      <main className="screen">
        <h1>🎬 MOVIE HUB</h1>
        <p>Loading movies from Wikidata...</p>
      </main>
    );
  }

  if (error || !movie) {
    return (
      <main className="screen">
        <h1>MOVIE HUB</h1>
        <p>{error || "Movie unavailable"}</p>
        <button onClick={() => window.location.reload()}>
          Try Again
        </button>
      </main>
    );
  }

  return (
    <main className="screen">
      <header>
        <h1>🎬 MOVIE HUB</h1>
        <p>Discover a new movie</p>
      </header>

      <section className="movie-card">
        <img
          src={movie.poster}
          alt={movie.title}
          className="poster"
        />

        <div className="details">
          <h2>{movie.title}</h2>

          <p className="year">
            Release year: {movie.year}
          </p>

          <p>
            <strong>Director:</strong> {movie.director}
          </p>

          <p>
            <strong>About:</strong> {movie.description}
          </p>

          <a
            href={movie.imdb}
            target="_blank"
            rel="noopener noreferrer"
            className="imdb-link"
          >
            View on IMDb ↗
          </a>
        </div>
      </section>

      <nav className="controls">
        <button
          onClick={previousMovie}
          disabled={historyPosition === 0}
        >
          ← Previous
        </button>

        <button onClick={nextMovie}>
          Next Movie →
        </button>
      </nav>

      <footer>
        Movie information: Wikidata
      </footer>
    </main>
  );
      }

