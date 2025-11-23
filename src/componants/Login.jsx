import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { decodeToken } from "../utils/decodeToken";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch("http://localhost:3000/myapi/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const res = await response.json();

            if (!response.ok) {
                return setError(res.message || "Identifiants incorrects");
            }

            const token = res.data.token;
            localStorage.setItem("token", token);

            const payload = decodeToken(token);

            if (payload?.sub) {
                navigate(`/profiles/${payload.sub}`);
            } else {
                setError("Token invalide reçu du serveur.");
            }

        } catch (err) {
            console.error(err);
            setError("Erreur réseau, impossible de se connecter.");
        }
    };

    return (
        <div className="container fade-in">
            <div className="card">
                <h2 className="card-title">Connexion</h2>

                <form onSubmit={handleSubmit} className="form">

                    <label>Email</label>
                    <input
                        className="input"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label>Mot de passe</label>
                    <input
                        className="input"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button type="submit" className="btn btn-primary">
                        Se connecter
                    </button>

                    {error && <p className="error-message">{error}</p>}
                </form>
            </div>
        </div>
    );
}

export default Login;
