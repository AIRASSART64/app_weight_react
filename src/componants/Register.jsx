import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    pseudo: "",
    password: "",
    sex: "",
    date_of_birth: "",
    size_cm: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:3000/myapi/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Erreur lors de l'inscription");
        return;
      }

      navigate("/auth/login");
    } catch (error) {
      setError("Erreur serveur");
    }
  };

  return (
    <div className="container fade-in">
      <div className="card">
        <h2 className="card-title">Créer un compte</h2>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit} className="form">

          <input className="input" type="email" name="email"
            placeholder="Email" value={formData.email}
            onChange={handleChange} required />

          <input className="input" type="text" name="pseudo"
            placeholder="Pseudo" value={formData.pseudo}
            onChange={handleChange} required />

          <input className="input" type="password" name="password"
            placeholder="Mot de passe" value={formData.password}
            onChange={handleChange} required />

          <select className="input" name="sex"
            value={formData.sex} onChange={handleChange} required>
            <option value="">Sexe</option>
            <option value="M">Homme</option>
            <option value="F">Femme</option>
          </select>

          <input className="input" type="date" name="date_of_birth"
            value={formData.date_of_birth} onChange={handleChange} required />

          <input className="input" type="number" name="size_cm"
            placeholder="Taille (cm)" value={formData.size_cm}
            onChange={handleChange} required />
          <div className="btn-row"> 
          <button type="submit" className="btn btn-primary">
            S'inscrire
          </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
