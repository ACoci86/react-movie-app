import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";

function NavBar() {
    const { user, logout } = useAuth();
    const { t, i18n } = useTranslation();

    const switchLang = (lng) => i18n.changeLanguage(lng);

    return (
        <nav className="nav-bar">
            <div className="navbar-brand">
                <Link to="/">
                    <img src="/movie-app.png" alt="Movie App logo" className="navbar-logo" />
                    Movie App
                </Link>
            </div>

            <div className="navbar-links">
                <Link to="/" className="nav-link">
                    {t("home")}
                </Link>

                {user ? (
                    <>
                        <Link to="/favorites" className="nav-link">
                            {t("favorites")}
                        </Link>
                        <span className="nav-user">{user.email}</span>
                        <button className="nav-logout" onClick={logout}>
                            {t("logout")}
                        </button>
                    </>
                ) : (
                    <>
                        <a href="#how-it-works" className="nav-link">
                            {t("navHowItWorks")}
                        </a>
                        <a href="#categories" className="nav-link">
                            {t("navExplore")}
                        </a>
                        <Link to="/login" className="nav-cta">
                            {t("login")}
                        </Link>
                    </>
                )}

                <div className="lang-switch">
                    <button
                        className={i18n.language.startsWith("en") ? "active" : ""}
                        onClick={() => switchLang("en")}
                    >
                        EN
                    </button>
                    <button
                        className={i18n.language.startsWith("it") ? "active" : ""}
                        onClick={() => switchLang("it")}
                    >
                        IT
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;
