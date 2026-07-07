import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getPersonDetails } from "../services/api";
import MovieCard from "../components/MovieCard";

const IMG = "https://image.tmdb.org/t/p/w500";

// newest first, and drop duplicate movies (a person can be credited twice)
const tidy = (movies) => {
    const seen = new Set();
    return movies
        .filter((m) => {
            if (!m.id || seen.has(m.id)) return false;
            seen.add(m.id);
            return true;
        })
        .sort((a, b) => (b.release_date || "").localeCompare(a.release_date || ""));
};

function PersonDetails() {
    const { id } = useParams();
    const { t, i18n } = useTranslation();
    const [person, setPerson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [bioExpanded, setBioExpanded] = useState(false);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const data = await getPersonDetails(id, i18n.language);
                setPerson(data);
                setError("");
            } catch (err) {
                console.log(err);
                setError(t("couldNotLoadPerson"));
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id, i18n.language]);

    if (loading) return <div className="loading">{t("loading")}</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!person) return null;

    const acting = tidy(person.movie_credits?.cast || []);
    const directing = tidy(
        (person.movie_credits?.crew || []).filter((m) => m.job === "Director")
    );

    return (
        <div className="movie-details">
            <Link to="/" className="back-link">&larr; {t("back")}</Link>

            <div className="details-top">
                {person.profile_path && (
                    <img
                        className="details-poster"
                        src={`${IMG}${person.profile_path}`}
                        alt={person.name}
                    />
                )}

                <div className="details-info">
                    <h1>{person.name}</h1>
                    <div className="details-meta">
                        <span>
                            {t(`dept${person.known_for_department}`, {
                                defaultValue: person.known_for_department,
                            })}
                        </span>
                    </div>
                    {person.biography && (
                        <>
                            <p className={`details-overview person-bio${bioExpanded ? "" : " clamped"}`}>
                                {person.biography}
                            </p>
                            {person.biography.length > 300 && (
                                <button
                                    className="bio-toggle"
                                    onClick={() => setBioExpanded((v) => !v)}
                                >
                                    {bioExpanded ? t("readLess") : t("readMore")}
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>

            {acting.length > 0 && (
                <>
                    <h2 className="cast-heading">{t("acting")}</h2>
                    <div className="movies-grid">
                        {acting.map((movie) => (
                            <MovieCard movie={movie} key={movie.id} />
                        ))}
                    </div>
                </>
            )}

            {directing.length > 0 && (
                <>
                    <h2 className="cast-heading">{t("directing")}</h2>
                    <div className="movies-grid">
                        {directing.map((movie) => (
                            <MovieCard movie={movie} key={movie.id} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default PersonDetails;
