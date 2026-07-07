import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MdFavorite } from "react-icons/md";
import { useAuth } from "../contexts/AuthContext";

function Footer() {
    const { t } = useTranslation();
    const { token } = useAuth();
    const year = new Date().getFullYear();

    return (
        <footer className="site-footer">
            {token && (
                <div className="footer-cta">
                    <div className="footer-cta-text">
                        <span className="footer-cta-icon">🍿</span>
                        <div>
                            <h3>{t("footerCtaTitle")}</h3>
                            <p>{t("footerCtaSubtitle")}</p>
                        </div>
                    </div>
                    <Link to="/favorites" className="footer-cta-btn">
                        <MdFavorite /> {t("footerCtaButton")}
                    </Link>
                </div>
            )}
            <p className="footer-copy">© {year} Movie App. {t("footerRights")}</p>
        </footer>
    );
}

export default Footer;
