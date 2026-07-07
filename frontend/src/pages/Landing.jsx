import { useState, useEffect, Fragment } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getGenres, getDiscoverMovies } from "../services/api";
import MovieCard from "../components/MovieCard";
import {
    MdMovie, MdFavorite, MdBolt, MdStar, MdChevronRight, MdCategory, MdApps,
    MdLocalFireDepartment, MdMood, MdTheaterComedy, MdNightlight, MdAnimation, MdExplore,
    MdSearch,
} from "react-icons/md";

const IMG = "https://image.tmdb.org/t/p/w342";
const BACKDROP = "https://image.tmdb.org/t/p/w500";
const POPULAR_GENRE_IDS = [28, 35, 27, 16, 12]; // Action, Comedy, Horror, Animation, Adventure

// Category cards: genre id -> icon
const CATEGORIES = [
    { id: 28, Icon: MdLocalFireDepartment },
    { id: 35, Icon: MdMood },
    { id: 18, Icon: MdTheaterComedy },
    { id: 27, Icon: MdNightlight },
    { id: 16, Icon: MdAnimation },
    { id: 12, Icon: MdExplore },
];

function Landing() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [genres, setGenres] = useState([]);
    const [popular, setPopular] = useState([]);
    const [backdrops, setBackdrops] = useState({}); // genre id -> backdrop_path

    useEffect(() => {
        getGenres(i18n.language).then(setGenres).catch(console.log);
    }, [i18n.language]);

    // One representative backdrop per category (language-independent, fetch once)
    useEffect(() => {
        Promise.all(
            CATEGORIES.map(({ id }) =>
                getDiscoverMovies(id, "popularity.desc", "en")
                    .then((r) => ({ id, backdrop: r[0]?.backdrop_path }))
                    .catch(() => ({ id, backdrop: null }))
            )
        ).then((results) => {
            const map = {};
            results.forEach(({ id, backdrop }) => (map[id] = backdrop));
            setBackdrops(map);
        });
    }, []);

    useEffect(() => {
        getDiscoverMovies(null, "popularity.desc", i18n.language)
            .then(setPopular)
            .catch(console.log);
    }, [i18n.language]);

    const collage = popular.filter((m) => m.poster_path).slice(0, 15);
    const featured = popular.slice(0, 5);

    // Logged-out funnel: interactions lead to sign-up
    const goRegister = (e) => {
        if (e) e.preventDefault();
        navigate("/register");
    };

    const popularGenres = POPULAR_GENRE_IDS
        .map((id) => genres.find((g) => g.id === id))
        .filter(Boolean);

    const highlights = [
        { Icon: MdMovie, cls: "hl-gold", title: t("hlMoviesTitle"), sub: t("hlMoviesSub") },
        { Icon: MdFavorite, cls: "hl-pink", title: t("hlCollectionsTitle"), sub: t("hlCollectionsSub") },
        { Icon: MdBolt, cls: "hl-purple", title: t("hlDiscoverTitle"), sub: t("hlDiscoverSub") },
    ];

    const steps = [
        { n: 1, Icon: MdSearch, cls: "how-icon-blue", title: t("step1Title"), sub: t("step1Sub") },
        { n: 2, Icon: MdFavorite, cls: "how-icon-pink", title: t("step2Title"), sub: t("step2Sub") },
        { n: 3, Icon: MdBolt, cls: "how-icon-purple", title: t("step3Title"), sub: t("step3Sub") },
    ];

    return (
        <div className="landing" id="top">
            <section className="landing-hero">
                <div className="hero-collage" aria-hidden="true">
                    {collage.map((m) => (
                        <img key={m.id} src={`${IMG}${m.poster_path}`} alt="" loading="lazy" />
                    ))}
                </div>

                <div className="landing-hero-content">
                    <h1 className="landing-hero-title">{t("heroEyebrow")}</h1>
                    <p className="landing-hero-subtitle">{t("landingSubtitle")}</p>

                    <form className="search-form" onSubmit={goRegister}>
                        <input
                            type="text"
                            placeholder={t("searchPlaceholder")}
                            className="search-input"
                        />
                        <button type="submit" className="search-button">
                            {t("search")}
                        </button>
                    </form>

                    <div className="landing-popular">
                        <span className="landing-popular-label">{t("popular")}:</span>
                        {popularGenres.map((genre) => (
                            <button key={genre.id} className="genre-chip" onClick={goRegister}>
                                {genre.name}
                            </button>
                        ))}
                    </div>

                    <div className="landing-highlights">
                        {highlights.map(({ Icon, cls, title, sub }) => (
                            <div className="landing-highlight" key={title}>
                                <Icon className={`landing-highlight-icon ${cls}`} />
                                <div>
                                    <div className="landing-highlight-title">{title}</div>
                                    <div className="landing-highlight-sub">{sub}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="movie-section">
                <div className="section-head">
                    <h2 className="section-title">
                        <MdStar className="section-icon section-icon-gold" />
                        {t("featured")}
                    </h2>
                    <button className="section-link" onClick={goRegister}>
                        {t("viewAll")} <MdChevronRight />
                    </button>
                </div>
                <div className="movies-grid">
                    {featured.map((movie) => (
                        <MovieCard movie={movie} key={movie.id} />
                    ))}
                </div>
            </section>

            <section className="movie-section" id="categories">
                <div className="section-head">
                    <h2 className="section-title">
                        <MdCategory className="section-icon" />
                        {t("exploreByCategory")}
                    </h2>
                </div>
                <div className="category-grid">
                    {CATEGORIES.map(({ id, Icon }) => (
                        <button className="category-card" key={id} onClick={goRegister}>
                            {backdrops[id] && (
                                <img className="category-card-bg" src={`${BACKDROP}${backdrops[id]}`} alt="" loading="lazy" />
                            )}
                            <span className="category-card-scrim" />
                            <Icon className="category-card-icon" />
                            <span className="category-card-label">
                                {genres.find((g) => g.id === id)?.name}
                            </span>
                        </button>
                    ))}
                    <button className="category-card category-card-all" onClick={goRegister}>
                        <span className="category-card-scrim" />
                        <MdApps className="category-card-icon" />
                        <span className="category-card-label">{t("allCategories")}</span>
                    </button>
                </div>
            </section>

            <section className="how-section" id="how-it-works">
                <h2 className="how-title">{t("navHowItWorks")}</h2>
                <div className="how-steps">
                    {steps.map((s, i) => (
                        <Fragment key={s.n}>
                            <div className="how-step">
                                <div className={`how-step-icon ${s.cls}`}>
                                    <s.Icon />
                                </div>
                                <div>
                                    <div className="how-step-title">{s.n}. {s.title}</div>
                                    <div className="how-step-sub">{s.sub}</div>
                                </div>
                            </div>
                            {i < steps.length - 1 && <span className="how-arrow" aria-hidden="true" />}
                        </Fragment>
                    ))}
                </div>
            </section>

            <section className="landing-cta">
                <div className="landing-cta-text">
                    <h2>{t("landingCtaTitle")}</h2>
                    <p>{t("landingCtaSubtitle")}</p>
                    <div className="landing-cta-actions">
                        <Link to="/login" className="btn-primary">{t("login")}</Link>
                        <span className="cta-or">{t("ctaOr")}</span>
                        <Link to="/register" className="btn-outline">{t("registerFree")}</Link>
                    </div>
                </div>
                <span className="landing-cta-art" aria-hidden="true">🍿</span>
            </section>
        </div>
    );
}

export default Landing;
