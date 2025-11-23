import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import { formatDateToDayMonth , formatDateToDayMonthYear } from "../utils/dateFormat";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [newWeight, setNewWeight] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:3000/myapi/stats", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStats(data.stats);
      } else {
        setError(data.message || "Erreur lors du chargement des statistiques");
        setStats(null);
      }
    } catch (err) {
      setError("Erreur réseau ou serveur");
      setStats(null);
    } finally {
      setLoading(false);
    }
  }

  const handleAddWeight = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const weightNum = parseFloat(newWeight);
    if (isNaN(weightNum) || weightNum <= 0) {
      setError("Veuillez entrer un poids valide supérieur à 0");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/myapi/weights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          weight_kg: weightNum,
        }),
      });

      const data = await res.json();
      console.log("Réponse ajout poids:", data);

      if (res.ok && data.success) {
        setMessage("Poids ajouté avec succès !");
        setNewWeight("");
        fetchStats();
      } else {
        setError(data.message || "Erreur lors de l'ajout du poids");
      }
    } catch (err) {
      console.error(err);
      setError("Erreur réseau ou serveur");
    }
  };

  if (loading) {
    return <p className="loading">Chargement des statistiques...</p>;
  }

  if (error && !stats) {

    return (
      <div className="dashboard">
        <p className="error">{error}</p>

        <form onSubmit={handleAddWeight} className="weight-form">
          <input
            type="number"
            step="0.1"
            min="0"
            placeholder="Poids en kg"
            value={newWeight}
            onChange={(e) => setNewWeight(e.target.value)}
            required
          />
          <button type="submit">Ajouter</button>
        </form>
        {message && <p className="success">{message}</p>}
      </div>
    );
  }

  if (!stats || stats.weight_evolution.length === 0) {
   
    return (
      <div className="dashboard">
        <h2>Tableau de bord</h2>
        <p>Aucune mesure disponible. Veuillez saisir votre premier poids :</p>

        <form onSubmit={handleAddWeight} className="weight-form">
          <input
            type="number"
            step="0.1"
            min="0"
            placeholder="Poids en kg"
            value={newWeight}
            onChange={(e) => setNewWeight(e.target.value)}
            required
          />
          <button type="submit">Ajouter</button>
        </form>

        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
      </div>
    );
  }

  const formattedWeightEvolution = stats.weight_evolution.map(({ weight, measured_at }) => ({
    weight,
    measured_at: formatDateToDayMonth(measured_at),
  }));

  return (
    <div className="dashboard">
      <h2>Tableau de bord</h2>
       <section className="chart-section" style={{ width: "100%", height: 300 }}>
        <h3>Évolution du poids</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedWeightEvolution}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="measured_at" interval={0} />
            <YAxis domain={["dataMin - 5", "dataMax + 5"]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="weight"
              stroke="#8884d8"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </section>

      <section className="add-weight-section" style={{ marginTop: "2rem" }}>
        <h3>Ajouter un nouvelle mesure de poids</h3>
        <form onSubmit={handleAddWeight} className="weight-form">
          <input
            type="number"
            step="0.1"
            min="0"
            placeholder="Poids en kg"
            value={newWeight}
            onChange={(e) => setNewWeight(e.target.value)}
            required
          />
          <button type="submit">Ajouter</button>
        </form>
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
      </section>

      <section className="stats-section">
        <h3>Mes stats</h3>
        <p>Nombre de mesures : {stats.total_measures} mesures</p>
        <p>Date première mesure : {formatDateToDayMonthYear(stats.first_date)}</p>
        <p>Depuis la première mesure se sont écoulés: {stats.days_since_first} jours</p>
        <p>Poids minimum : {stats.min_weight} kg</p>
        <p>Poids maximum : {stats.max_weight} kg</p>
        <p>Poids actuel : {stats.current_weight} kg</p>
        <p>IMC : {stats.imc_indice.toFixed(2)} ({stats.imc_category})</p>
      </section>

      <button
        className="btn-profile"
        style={{ marginTop: "20px" }}
        onClick={() => {
          const token = localStorage.getItem("token");
          if (!token) return;
          const payload = JSON.parse(atob(token.split(".")[1]));
          navigate(`/profiles/${payload.sub}`);
        }}
      >
        Retour à mon profil
      </button>
    </div>
  );
}

export default Dashboard;


