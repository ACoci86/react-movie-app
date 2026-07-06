const API_KEY = "806536462a0bda2adf6e3b5c2e6b1aed";
const BASE_URL = "https://api.themoviedb.org/3";

// Map i18next's short codes to TMDB's locale codes
const TMDB_LANG = {
  en: "en-US",
  it: "it-IT",
};

// Convert an i18next language ("en" or "en-US") into a TMDB code
const toTmdbLang = (lng) => TMDB_LANG[lng?.split("-")[0]] || "en-US";

export const getPopularMovies = async (lng) => {
  const language = toTmdbLang(lng);
  const response = await fetch(
    `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=${language}`,
  );
  const data = await response.json();
  return data.results;
};

export const searchMovies = async (query, lng) => {
  const language = toTmdbLang(lng);
  const response = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&language=${language}&query=${encodeURIComponent(query)}`,
  );
  const data = await response.json();
  return data.results;
};

export const getMovieDetails = async (id, lng) => {
  const language = toTmdbLang(lng);
  const response = await fetch(
    `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=${language}&append_to_response=credits`,
  );
  const data = await response.json();
  return data; // full movie object, incl. runtime, genres, vote_average, credits.cast
};
