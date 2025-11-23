import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { decodeToken } from "../utils/decodeToken";

function UpdateProfile() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const payload = decodeToken(token);

    useEffect(() => {
        if (!token || !payload) {
            navigate("/login");
            return;
        }
        fetchUserById();
    }, [id, token]);

    const fetchUserById = async () => {
        try {
            const response = await fetch(`http://localhost:3000/myapi/profiles/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Impossible de récupérer le profil");
            } else {
                setUser(data);
            }
        } catch {
            setError("Erreur serveur lors de la récupération");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:3000/myapi/profiles/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(user),
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.data?.length > 0) {
                    setError(data.data[0].msg);
                } else {
                    setError(data.message || "Erreur lors de la mise à jour");
                }
            } else {
                setMessage("Profil mis à jour avec succès !");
                navigate(`/profiles/${id}`);
            }
        } catch {
            setError("Erreur serveur lors de la mise à jour");
        }
    };

    if (!user) return <p>Chargement...</p>;

    return (
        <div className="container fade-in">
            <div className="card">
                <h2 className="card-title">Modifier mon profil</h2>

                <form onSubmit={handleSubmit} className="form">

                    <label>Pseudo</label>
                    <input
                        className="input"
                        type="text"
                        value={user.pseudo}
                        onChange={(e) => setUser({ ...user, pseudo: e.target.value })}
                    />

                    <label>Nouveau mot de passe</label>
                    <input
                        className="input"
                        type="password"
                        placeholder="Laisser vide si pas de changement"
                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                    />

                    <label>Taille (cm)</label>
                    <input
                        className="input"
                        type="number"
                        value={user.size_cm}
                        onChange={(e) =>
                            setUser({ ...user, size_cm: parseInt(e.target.value, 10) })
                        }
                    />

                    <label>Sexe</label>
                    <select
                        className="input"
                        value={user.sex || ""}
                        onChange={(e) => setUser({ ...user, sex: e.target.value })}
                    >
                        <option value="">Sélectionner</option>
                        <option value="M">Homme</option>
                        <option value="F">Femme</option>
                    </select>

                    <label>Date de naissance</label>
                    <input
                        className="input"
                        type="date"
                        value={user.date_of_birth || ""}
                        onChange={(e) =>
                            setUser({ ...user, date_of_birth: e.target.value })
                        }
                    />

                    <button type="submit" className="btn btn-success mt-2">
                        Modifier
                    </button>

                    {message && <p className="success-message">{message}</p>}
                    {error && <p className="error-message">{error}</p>}
                </form>
            </div>
        </div>
    );
}

export default UpdateProfile;



