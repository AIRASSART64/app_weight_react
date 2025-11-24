import { Link, useNavigate } from "react-router-dom";
import { decodeToken } from "../utils/decodeToken";
import Login from "./Login";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  
  const decoded = token ? decodeToken(token) : null;
  
  const userId = decoded?.sub ?? null;

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/")
  }


  if (!token || !decoded) {
    return (
      <div className="btn-row">
      <nav className="navbar">
        <Link to="/" className="nav-link">Accueil</Link>
        <Link to="/auth/login" className="nav-link">Connexion</Link>
        <Link to="/auth/register" className="nav-link">Inscription</Link>
      </nav>
      </div>
    );
  }

  return (
    <div className="btn-row">
    <nav className="navbar">
      <Link to="/" className="nav-link">Accueil</Link>
      <Link to={`/profiles/${userId}`} className="nav-link">Profil</Link>
      <Link to={`/profiles/${userId}/stats`} className="nav-link">Dashboard</Link>

      <button onClick={handleLogout} className="nav-link btn-logout">
        Déconnexion
      </button>
    </nav>
    </div>
  );
}

export default Navbar;