import { useNavigate } from "react-router-dom";

const PROFILE_IMG = "https://image.tmdb.org/t/p/w500";

function PersonCard({ person }) {
    const navigate = useNavigate();

    // e.g. "Fight Club, Se7en" — their best-known titles
    const knownFor = (person.known_for || [])
        .map((item) => item.title || item.name)
        .filter(Boolean)
        .slice(0, 2)
        .join(", ");

    return (
        <div className="movie-card" onClick={() => navigate(`/person/${person.id}`)}>
            <div className="movie-poster person-photo-empty"></div>
            {person.profile_path && (
                <img
                    src={`${PROFILE_IMG}${person.profile_path}`}
                    alt={person.name}
                />
            )}
            <div className="movie-info">
                <h3>{person.name}</h3>
                <p>{person.known_for_department}{knownFor ? ` · ${knownFor}` : ""}</p>
            </div>
        </div>
    );
}

export default PersonCard;
