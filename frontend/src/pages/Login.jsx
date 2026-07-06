import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await login(email, password);
            navigate("/"); // logged in -> go home
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-page">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>{t("login")}</h2>
                {error && <div className="error-message">{error}</div>}
                <input
                    type="email"
                    placeholder={t("email")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder={t("password")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">{t("login")}</button>
                <p className="auth-switch">
                    {t("noAccount")} <Link to="/register">{t("signup")}</Link>
                </p>
            </form>
        </div>
    );
}

export default Login;
