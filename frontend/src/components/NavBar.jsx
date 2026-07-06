import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function NavBar() {
    const { user, logout } = useAuth();

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
                    Home
                </Link>

                {user ? (
                    <>
                        <Link to="/favorites" className="nav-link">
                            Favorites
                        </Link>
                        <span className="nav-user">{user.email}</span>
                        <button className="nav-logout" onClick={logout}>
                            Log out
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="nav-link">
                            Log in
                        </Link>
                        <Link to="/register" className="nav-link">
                            Sign up
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default NavBar;
