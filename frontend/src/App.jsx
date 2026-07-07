import "./App.css";
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import { Routes, Route } from "react-router-dom";
import Favorites from "./pages/Favorites";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MovieDetails from "./pages/MovieDetails";
import PersonDetails from "./pages/PersonDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import NavBar from "./components/NavBar"
import Footer from "./components/Footer"
import { useAuth } from "./contexts/AuthContext";

function App() {
  const { token } = useAuth();

  return (
    <div>
      <NavBar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={token ? <Home /> : <Landing />} />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/person/:id" element={<PersonDetails />} />
        </Routes>
      </main>

      <Footer />
    </div>

  );
}

export default App;
