import MovieCard from "../components/MovieCard";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { searchMovies } from "../services/api";
import { getPopularMovies } from "../services/api";

function Home() {
    const { t, i18n } = useTranslation();
    const [searchQuery, setSearchQuery] = useState("");
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPopularMovies = async () => {
            try {
                const popularMovies = await getPopularMovies(i18n.language);
                setMovies(popularMovies);
            }
            catch (err) {
                console.log(err)
                setError("Failed to load movies...")
            }
            finally {
                setLoading(false)
            }
        };

        loadPopularMovies()
    }, [i18n.language]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return; //guard 1
        if (loading) return; //guard 2

        setLoading(true);
        try {
            const searchResults = await searchMovies(searchQuery, i18n.language);
            setMovies(searchResults);
            setError("");
        }
        catch (err) {
            console.log(err);
            setError("Failed to search movies...");
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="home">
            <section className="hero">
                <h1 className="hero-title">{t("heroTitle")}</h1>
                <p className="hero-subtitle">{t("heroSubtitle")}</p>
                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        placeholder={t("searchPlaceholder")}
                        className="search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" className="search-button">
                        {t("search")}
                    </button>
                </form>
            </section>
            {error && <div className="error-message">{error}</div>}

            {loading ? (
                <div className="loading">{t("loading")}</div>
            ) : (
                <div className="movies-grid">
                    {movies.map((movie) => (
                        <MovieCard movie={movie} key={movie.id} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Home;
