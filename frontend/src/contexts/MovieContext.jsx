import { createContext, useState, useContext, useEffect } from "react";

const MovieContext = createContext();

export const useMovieContext = () => useContext(MovieContext);

const API_URL = import.meta.env.VITE_API_URL;

export const MovieProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Load favorites from the API on first render
    useEffect(() => {
        const loadFavorites = async () => {
            try {
                const res = await fetch(`${API_URL}/api/favorites`);
                if (!res.ok) throw new Error("Failed to load favorites");
                const data = await res.json();
                // Map DB rows -> the shape MovieCard expects (needs `id`)
                setFavorites(data.map((row) => ({
                    id: row.movie_id,
                    title: row.title,
                    poster_path: row.poster_path,
                    release_date: row.release_date,
                })));
            } catch (err) {
                console.log(err);
                setError("Could not load favorites");
            } finally {
                setLoading(false);
            }
        };
        loadFavorites();
    }, []);

    const addToFavorites = async (movie) => {
        try {
            await fetch(`${API_URL}/api/favorites`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
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
        try {
            await fetch(`${API_URL}/api/favorites/${movieId}`, {
                method: "DELETE",
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
