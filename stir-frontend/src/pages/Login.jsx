import { useState, useEffect } from "react";
import { loginUser } from "../services/authService";
import { getUsersByRole } from "../services/userService";
import { useNavigate, useSearchParams } from "react-router-dom";
import logo from "../assets/logo.png";
import EmailAutocomplete from "../components/EmailAutocomplete/EmailAutocomplete";
import "./Login.css";

const ROLE_LABELS = {
    ROLE_EMPLOYEE: "Employé",
    ROLE_CHEF: "Chef de service",
    ROLE_SOUS_DIRECTEUR: "Sous-directeur",
    ROLE_DIRECTEUR: "Directeur",
    ROLE_RH: "RH",
    ROLE_ADMIN: "Admin",
};

function Login() {
    const [searchParams] = useSearchParams();
    const targetRole = searchParams.get("role");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [roleUsers, setRoleUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(false);

    // L'autocomplétion n'est disponible que si un utilisateur est DÉJÀ connecté
    // (ex: changement de rôle depuis le menu "Utilisateur"). Après déconnexion,
    // aucun token n'existe et la saisie doit être 100% manuelle, pour la sécurité.
    const isAlreadyLoggedIn = !!localStorage.getItem("token");
    const autocompleteActif = isAlreadyLoggedIn && !!targetRole;

    const navigate = useNavigate();

    useEffect(() => {
        if (!autocompleteActif) {
            setRoleUsers([]);
            return;
        }

        setUsersLoading(true);
        getUsersByRole(targetRole)
            .then(setRoleUsers)
            .catch(() => setRoleUsers([]))
            .finally(() => setUsersLoading(false));
    }, [targetRole, autocompleteActif]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const data = await loginUser({ email, password });

            const token = data.token ?? data.accessToken ?? data.jwt;
            if (!token) {
                throw new Error("Token manquant dans la réponse du serveur");
            }

            localStorage.setItem("token", token);
            localStorage.setItem("role", data.role);

            window.dispatchEvent(new Event("authChanged"));

            switch (data.role) {
                case "ROLE_EMPLOYEE":
                    navigate("/employee");
                    break;
                case "ROLE_CHEF":
                    navigate("/chef/dashboard");
                    break;
                case "ROLE_SOUS_DIRECTEUR":
                    navigate("/sous-directeur/dashboard");
                    break;
                case "ROLE_DIRECTEUR":
                    navigate("/directeur/dashboard");
                    break;
                case "ROLE_RH":
                    navigate("/rh/dashboard");
                    break;
                case "ROLE_ADMIN":
                    navigate("/admin/dashboard");
                    break;
                default:
                    navigate("/");
            }
        } catch (error) {
            console.error("Erreur de connexion", error);
            setError("Email ou mot de passe incorrect.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <img src={logo} alt="STIR" className="login-logo" />

                <h2>Connexion</h2>

                {targetRole ? (
                    <p className="subtitle role-banner">
                        Connexion en tant que <strong>{ROLE_LABELS[targetRole] || targetRole}</strong>
                    </p>
                ) : (
                    <p className="subtitle">
                        Entrez vos identifiants pour accéder à votre tableau de bord.
                    </p>
                )}

                {error && <div className="login-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="field-group">
                        <label htmlFor="email">Email</label>

                        {autocompleteActif ? (
                            <EmailAutocomplete
                                value={email}
                                onChange={setEmail}
                                users={roleUsers}
                                loading={usersLoading}
                            />
                        ) : (
                            <div className="field-wrapper">
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="nom@stir.tn"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        )}
                    </div>

                    <div className="field-group">
                        <label htmlFor="password">Mot de passe</label>
                        <div className="field-wrapper">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword((s) => !s)}
                            >
                                {showPassword ? "MASQUER" : "AFFICHER"}
                            </button>
                        </div>
                    </div>

                    <button className="login-submit" disabled={loading}>
                        {loading && <span className="spinner"></span>}
                        {loading ? "Connexion..." : "Se connecter"}
                    </button>
                </form>

                <p className="login-footer">
                    © {new Date().getFullYear()} STIR — Tous droits réservés
                </p>
            </div>
        </div>
    );
}

export default Login;