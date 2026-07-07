import MovieCard from "../components/MovieCard";
import PersonCard from "../components/PersonCard";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { searchMovies, getGenres, getDiscoverMovies } from "../services/api";
import {
    MdGridView, MdLocalFireDepartment, MdExplore, MdAnimation, MdMood,
    MdLocalPolice, MdVideocam, MdTheaterComedy, MdGroups, MdAutoAwesome,
    MdMenuBook, MdNightlight, MdMusicNote, MdSearch, MdFavorite,
    MdRocketLaunch, MdTv, MdVisibility, MdMilitaryTech, MdLandscape,
    MdMovie, MdMoreHoriz, MdStar, MdLocalMovies, MdChevronRight,
} from "react-icons/md";

// TMDB genre ids -> Material Design icon component (ids are stable across languages)
const GENRE_ICONS = {
    28: MdLocalFireDepartment, 12: MdExplore, 16: MdAnimation, 35: MdMood,
    80: MdLocalPolice, 99: MdVideocam, 18: MdTheaterComedy, 10751: MdGroups,
    14: MdAutoAwesome, 36: MdMenuBook, 27: MdNightlight, 10402: MdMusicNote,
    9648: MdSearch, 10749: MdFavorite, 878: MdRocketLaunch, 10770: MdTv,
    53: MdVisibility, 10752: MdMilitaryTech, 37: MdLandscape,
};

const VISIBLE_GENRES = 6;
const HERO_IMG = "https://image.tmdb.org/t/p/w342";

function Home() {
    const { t, i18n } = useTranslation();
    const [searchQuery, setSearchQuery] = useState("");
    const [movies, setMovies] = useState([]);
    const [featured, setFeatured] = useState([]);
    const [collage, setCollage] = useState([]);
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState(null); // null = all movies
    const [showAllGenres, setShowAllGenres] = useState(false);
    const [sortBy, setSortBy] = useState("popularity.desc");
    const [searching, setSearching] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const allMoviesRef = useRef(null);

    // Load the genre list (localized) — refreshes when language changes
    useEffect(() => {
        const loadGenres = async () => {
            try {
                setGenres(await getGenres(i18n.language));
            } catch (err) {
                console.log(err);
            }
        };
        loadGenres();
    }, [i18n.language]);

    // Load the "Featured" row (most popular) — refreshes when language changes
    useEffect(() => {
        const loadFeatured = async () => {
            try {
                const data = await getDiscoverMovies(null, "popularity.desc", i18n.language);
                setFeatured(data.slice(0, 5));
                setCollage(data.filter((m) => m.poster_path).slice(0, 15));
            } catch (err) {
                console.log(err);
            }
        };
        loadFeatured();
    }, [i18n.language]);

    // Load the browse grid: all popular, or a selected genre
    useEffect(() => {
        const loadMovies = async () => {
            setLoading(true);
            try {
                const data = await getDiscoverMovies(selectedGenre, sortBy, i18n.language);
                setMovies(data);
                setError("");
            } catch (err) {
                console.log(err);
                setError("Failed to load movies...");
            } finally {
                setLoading(false);
            }
        };
        loadMovies();
    }, [i18n.language, selectedGenre, sortBy]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return; //guard 1
        if (loading) return; //guard 2

        setLoading(true);
        setSearching(true);
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

    const handleGenre = (genreId) => {
        setSearchQuery("");     // leaving search mode
        setSearching(false);
        setSelectedGenre(genreId);
    };

    const handleSort = (value) => {
        setSearchQuery("");
        setSearching(false);
        setSortBy(value);
    };

    const scrollToAll = () => {
        allMoviesRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const visibleGenres = showAllGenres ? genres : genres.slice(0, VISIBLE_GENRES);
    const showFeatured = !searching && selectedGenre === null && featured.length > 0;

    return (
        <div className="home">
            <section className="hero">
                <div className="hero-collage" aria-hidden="true">
                    {collage.map((m) => (
                        <img key={m.id} src={`${HERO_IMG}${m.poster_path}`} alt="" loading="lazy" />
                    ))}
                </div>
                <div className="hero-content">
                <span className="hero-eyebrow">✨ {t("heroEyebrow")}</span>
                <h1 className="hero-title">
                    {t("heroTitleLead")}{" "}
                    <span className="hero-highlight">{t("heroTitleHighlight")}</span>
                </h1>
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

                <div className="genre-chips">
                    <button
                        className={`genre-chip${selectedGenre === null ? " active" : ""}`}
                        onClick={() => handleGenre(null)}
                    >
                        <MdGridView className="genre-icon" />
                        {t("allMovies")}
                    </button>
                    {visibleGenres.map((genre) => {
                        const Icon = GENRE_ICONS[genre.id] || MdMovie;
                        return (
                            <button
                                key={genre.id}
                                className={`genre-chip${selectedGenre === genre.id ? " active" : ""}`}
                                onClick={() => handleGenre(genre.id)}
                            >
                                <Icon className="genre-icon" />
                                {genre.name}
                            </button>
                        );
                    })}
                    {!showAllGenres && genres.length > VISIBLE_GENRES && (
                        <button
                            className="genre-chip"
                            onClick={() => setShowAllGenres(true)}
                            aria-label="Show all genres"
                        >
                            <MdMoreHoriz className="genre-icon" />
                        </button>
                    )}
                </div>
                </div>
            </section>

            {error && <div className="error-message">{error}</div>}

            {showFeatured && (
                <section className="movie-section">
                    <div className="section-head">
                        <h2 className="section-title">
                            <MdStar className="section-icon section-icon-gold" />
                            {t("featured")}
                        </h2>
                        <button className="section-link" onClick={scrollToAll}>
                            {t("viewAll")} <MdChevronRight />
                        </button>
                    </div>
                    <div className="movies-grid">
                        {featured.map((movie) => (
                            <MovieCard movie={movie} key={movie.id} />
                        ))}
                    </div>
                </section>
            )}

            <section className="movie-section" ref={allMoviesRef}>
                <div className="section-head">
                    <h2 className="section-title">
                        <MdLocalMovies className="section-icon" />
                        {searching ? t("searchResults") : t("allMovies")}
                    </h2>
                    {!searching && (
                        <label className="sort-control">
                            {t("sortBy")}:
                            <select value={sortBy} onChange={(e) => handleSort(e.target.value)}>
                                <option value="popularity.desc">{t("sortPopular")}</option>
                                <option value="release_date.desc">{t("sortNewest")}</option>
                                <option value="vote_average.desc">{t("sortTopRated")}</option>
                            </select>
                        </label>
                    )}
                </div>

                {loading ? (
                    <div className="loading">{t("loading")}</div>
                ) : (
                    <div className="movies-grid">
                        {movies
                            .filter((item) => item.media_type !== "tv")
                            .map((item) =>
                                item.media_type === "person" ? (
                                    <PersonCard person={item} key={item.id} />
                                ) : (
                                    <MovieCard movie={item} key={item.id} />
                                )
                            )}
                    </div>
                )}
            </section>
        </div>
    );
}

export default Home;
