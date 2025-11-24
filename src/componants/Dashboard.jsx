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

import { formatDateToDayMonth, formatDateToDayMonthYear } from "../utils/dateFormat";
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
        <div className="add-weight-section">
          <h2>Tableau de bord</h2>
          <p>Aucune mesure disponible. Veuillez saisir votre premier poids :</p>

          <form onSubmit={handleAddWeight} className="weight-form">
            <input
              className="input"
              type="number"
              step="0.1"
              min="0"
              placeholder="Poids en kg"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              required
            />
            <div className="btn-row">
              <button type="submit" className="btn btn-primary">Ajouter</button>
            </div>
          </form>
        </div>

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
      <h2 className="card-title">Tableau de bord</h2>

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

      <section className="add-weight-section">
        <h3>Ajouter un nouvelle mesure de poids</h3>
        <form onSubmit={handleAddWeight} className="weight-form">
          <div>
            <input
              className="input"
              type="number"
              step="0.1"
              min="0"
              placeholder="Poids en kg"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              required
            />
            <div className="btn-row">
              <button type="submit" className="btn btn-primary">Ajouter</button>
            </div>
          </div>
        </form>
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
      </section>

      <section className="card profile-card">
        <h3 className="card-title">Mes stats</h3>
        <div className="profile-info">
          <p>Nombre de mesures : <strong>{stats.total_measures} mesures</strong></p>
          <p>Date première mesure : <strong>{formatDateToDayMonthYear(stats.first_date)}</strong></p>
          <p>Depuis la première mesure se sont écoulés : <strong>{stats.days_since_first} jours</strong></p>
          <p>Poids minimum : <strong>{stats.min_weight} kg</strong></p>
          <p>Poids maximum : <strong>{stats.max_weight} kg</strong></p>
          <p>Poids actuel : <strong>{stats.current_weight} kg</strong></p>
          <p>IMC : <strong>{stats.imc_indice.toFixed(2)} ({stats.imc_category})</strong></p>
        </div>
      </section>

      <div className="btn-row">
        <button
          className="btn btn-primary"
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
    </div>
  );
}

export default Dashboard;


