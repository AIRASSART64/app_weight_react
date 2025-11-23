import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { decodeToken } from "../utils/decodeToken";
import { formatDateToDayMonthYear } from "../utils/dateFormat";

function Profile() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const payload = decodeToken(token);

    useEffect(() => {
        if (!token || !payload) {
            navigate("/login");
            return;
        }
        fetchUser();
    }, [id, token]);

    const fetchUser = async () => {
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

    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!user) return <p>Chargement...</p>;

    return (
        <div className="container fade-in">
            <div className="card profile-card">
                <h2 className="card-title">Bienvenue {user.pseudo} !</h2>

                <div className="profile-info">
                    <p><strong>Email :</strong> {user.email}</p>
                    <p><strong>Pseudo :</strong> {user.pseudo || "-"}</p>
                    <p><strong>Taille (cm) :</strong> {user.size_cm}</p>
                    <p><strong>Sexe :</strong> {user.sex || "-"}</p>
                    <p><strong>Date de naissance :</strong> {formatDateToDayMonthYear(user.date_of_birth)}</p>
                </div>

                <div className="btn-row">
                    <button className="btn btn-success"
                        onClick={() => navigate(`/profiles/${id}/edit`)}>
                        Modifier mon profil
                    </button>


                </div>
            </div>
            <div className="card profile-card">
                <h2 className="card-title">Tableau de bord</h2>
                <div className="btn-row">
                    <button className="btn btn-primary"
                        onClick={() => navigate(`/profiles/${id}/stats`)}>
                        Mon tableau de bord
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Profile;


