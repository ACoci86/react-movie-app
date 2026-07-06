import { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";

const MovieContext = createContext();

export const useMovieContext = () => useContext(MovieContext);

const API_URL = import.meta.env.VITE_API_URL;

export const MovieProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { token } = useAuth();

    // Load favorites whenever the login state changes
    useEffect(() => {
        // Not logged in -> no favorites to show
        if (!token) {
            setFavorites([]);
            setLoading(false);
            return;
        }

        const loadFavorites = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${API_URL}/api/favorites`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error("Failed to load favorites");
                const data = await res.json();
                // Map DB rows -> the shape MovieCard expects (needs `id`)
                setFavorites(data.map((row) => ({
                    id: row.movie_id,
                    title: row.title,
                    poster_path: row.poster_path,
                    release_date: row.release_date,
                })));
                setError("");
            } catch (err) {
                console.log(err);
                setError("Could not load favorites");
            } finally {
                setLoading(false);
            }
        };
        loadFavorites();
    }, [token]);

    const addToFavorites = async (movie) => {
        if (!token) return;
        try {
            await fetch(`${API_URL}/api/favorites`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    movie_id: movie.id,
                    title: movie.title,
                    poster_path: movie.poster_path,
                    release_date: movie.release_date,
                }),
            });
            setFavorites((prev) => [...prev, movie]);
        } catch (err) {
            console.log(err);
        }
    };

    const removeFromFavorites = async (movieId) => {
        if (!token) return;
        try {
            await fetch(`${API_URL}/api/favorites/${movieId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            setFavorites((prev) => prev.filter((movie) => movie.id !== movieId));
        } catch (err) {
            console.log(err);
        }
    };

    const isFavorite = (movieId) => {
        return favorites.some((movie) => movie.id === movieId);
    };

    const value = {
        favorites,
        loading,
        error,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
    };

    return (
        <MovieContext.Provider value={value}>
            {children}
        </MovieContext.Provider>
    );
};
