import { useMovieContext } from "../contexts/MovieContext";

function MovieCard({ movie }) {
    const { isFavorite, addToFavorites, removeFromFavorites } = useMovieContext();
    const favorite = isFavorite(movie.id);

    function onFavoriteClick(e) {
        e.preventDefault();
        if (favorite) removeFromFavorites(movie.id);
        else addToFavorites(movie);
    }

    return <div className="movie-card">
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
            <p>{movie.release_date?.slice(0, 4)}</p>
        </div>
    </div>

}

export default MovieCard
