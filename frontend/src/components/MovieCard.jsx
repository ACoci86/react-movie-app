import { useMovieContext } from "../contexts/MovieContext";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function MovieCard({ movie }) {
    const { isFavorite, addToFavorites, removeFromFavorites } = useMovieContext();
    const { token } = useAuth();
    const navigate = useNavigate();
    const favorite = isFavorite(movie.id);

    function onCardClick() {
        navigate(`/movie/${movie.id}`);
    }

    function onFavoriteClick(e) {
        e.preventDefault();
        e.stopPropagation(); // don't let the click bubble up to the card

        // Not logged in -> guide them to log in instead of doing nothing
        if (!token) {
            navigate("/login");
            return;
        }

        if (favorite) removeFromFavorites(movie.id);
        else addToFavorites(movie);
    }

    return <div className="movie-card" onClick={onCardClick}>
        <div className="movie-poster"></div>
        {movie.poster_path && (
            <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
            />
        )}
        <div className="movie-overlay">
            <button
                className={`favorite-btn${favorite ? " favorited" : ""}`}
                onClick={onFavoriteClick}
            >
                ♥
            </button>
        </div>
        <div className="movie-info">
            <h3>{movie.title}</h3>
            <div className="movie-meta">
                <span>{movie.release_date?.slice(0, 4)}</span>
                {movie.vote_average ? (
                    <span className="movie-rating">★ {movie.vote_average.toFixed(1)}</span>
                ) : null}
            </div>
        </div>
    </div>

}

export default MovieCard
