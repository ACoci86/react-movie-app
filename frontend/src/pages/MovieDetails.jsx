import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getMovieDetails } from "../services/api";

const IMG = "https://image.tmdb.org/t/p/w500";
const PROFILE_IMG = "https://image.tmdb.org/t/p/w185";

function MovieDetails() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const data = await getMovieDetails(id);
                setMovie(data);
                setError("");
            } catch (err) {
                console.log(err);
                setError("Could not load this movie.");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!movie) return null;

    const cast = movie.credits?.cast?.slice(0, 12) || [];

    return (
        <div className="movie-details">
            <Link to="/" className="back-link">&larr; Back</Link>

            <div className="details-top">
                {movie.poster_path && (
                    <img
                        className="details-poster"
                        src={`${IMG}${movie.poster_path}`}
                        alt={movie.title}
                    />
                )}

                <div className="details-info">
                    <h1>{movie.title}</h1>
                    <div className="details-meta">
                        <span>{movie.release_date?.slice(0, 4)}</span>
                        {movie.runtime ? <span>{movie.runtime} min</span> : null}
                        {movie.vote_average ? <span>★ {movie.vote_average.toFixed(1)}</span> : null}
                    </div>

                    <div className="details-genres">
                        {movie.genres?.map((g) => (
                            <span className="genre-chip" key={g.id}>{g.name}</span>
                        ))}
                    </div>

                    <p className="details-overview">{movie.overview}</p>
                </div>
            </div>

            <h2 className="cast-heading">Cast</h2>
            <div className="cast-grid">
                {cast.map((person) => (
                    <div className="cast-card" key={person.id}>
                        {person.profile_path ? (
                            <img
                                className="cast-photo"
                                src={`${PROFILE_IMG}${person.profile_path}`}
                                alt={person.name}
                            />
                        ) : (
                            <div className="cast-photo cast-photo-empty">👤</div>
                        )}
                        <div className="cast-name">{person.name}</div>
                        <div className="cast-character">{person.character}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MovieDetails;
