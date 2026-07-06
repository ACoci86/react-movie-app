import { useMovieContext } from "../contexts/MovieContext";
import { useTranslation } from "react-i18next";
import MovieCard from "../components/MovieCard";

function Favorites() {
    const { favorites } = useMovieContext();
    const { t } = useTranslation();

    if (favorites.length === 0) {
        return <div className="favorites-empty">
            <h2>{t("noFavoritesTitle")}</h2>
            <p>{t("noFavoritesSubtitle")}</p>
        </div>
    }

    return (
        <div className="favorites">
            <h2>{t("yourFavorites")}</h2>
            <div className="movies-grid">
                {favorites.map((movie) => (
                    <MovieCard movie={movie} key={movie.id} />
                ))}
            </div>
        </div>
    );
}

export default Favorites
