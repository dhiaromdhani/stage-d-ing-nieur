import { useEffect, useState } from "react";
import { getAllUsers, createUser } from "../../services/userService";
import "./AdminDashboard.css";

const ROLES = [
    { value: "ROLE_EMPLOYEE", label: "Employé" },
    { value: "ROLE_CHEF", label: "Chef de service" },
    { value: "ROLE_SOUS_DIRECTEUR", label: "Sous-directeur" },
    { value: "ROLE_DIRECTEUR", label: "Directeur" },
    { value: "ROLE_RH", label: "RH" },
    { value: "ROLE_ADMIN", label: "Admin" },
];

const ROLE_LABELS = {
    ROLE_EMPLOYEE: "Employé",
    ROLE_CHEF: "Chef de service",
    ROLE_SOUS_DIRECTEUR: "Sous-directeur",
    ROLE_DIRECTEUR: "Directeur",
    ROLE_RH: "RH",
    ROLE_ADMIN: "Admin",
};

function getInitials(firstName = "", lastName = "") {
    return ((firstName[0] || "") + (lastName[0] || "")).toUpperCase();
}

const EMPTY_FORM = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    matricule: "",
    department: "",
    role: "ROLE_EMPLOYEE",
};

function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState(null);
    const [search, setSearch] = useState("");
    const [filterRole, setFilterRole] = useState("");

    const loadUsers = async () => {
        try {
            const data = await getAllUsers();
            setUsers(data);
        } catch (err) {
            console.error("Erreur chargement utilisateurs", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadUsers(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setSubmitting(true);
        try {
            await createUser(form);
            setMessage({ type: "success", text: `Compte créé pour ${form.email}.` });
            setForm(EMPTY_FORM);
            loadUsers();
            setTimeout(() => setShowModal(false), 1500);
        } catch (error) {
            console.error("Erreur création utilisateur", error);
            setMessage({ type: "error", text: "Erreur lors de la création du compte." });
        } finally {
            setSubmitting(false);
        }
    };

    const filtered = users.filter((u) => {
        const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
        const matchSearch =
            fullName.includes(search.toLowerCase()) ||
            u.email?.toLowerCase().includes(search.toLowerCase());
        const matchRole = filterRole ? u.role === filterRole : true;
        return matchSearch && matchRole;
    });

    return (
        <div className="admin-page">
            {/* Header */}
            <div className="admin-header">
                <div>
                    <span className="eyebrow">Administration</span>
                    <h1 className="admin-title">Gestion des utilisateurs</h1>
                    <p className="admin-subtitle">
                        Ajoutez, consultez et gérez les comptes STIR.
                    </p>
                </div>
                <button className="add-user-btn" onClick={() => { setShowModal(true); setMessage(null); }}>
                    + Ajouter un utilisateur
                </button>
            </div>

            {/* Stats */}
            <div className="admin-stats">
                {ROLES.map((r) => (
                    <div className="stat-card" key={r.value}>
                        <span className="stat-count">
                            {users.filter((u) => u.role === r.value).length}
                        </span>
                        <span className="stat-label">{r.label}</span>
                    </div>
                ))}
            </div>

            {/* Filtres */}
            <div className="admin-filters">
                <input
                    className="filter-input"
                    placeholder="Rechercher par nom ou email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select
                    className="filter-select"
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                >
                    <option value="">Tous les rôles</option>
                    {ROLES.map((r) => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                </select>
            </div>

            {/* Table */}
            <div className="admin-table-card">
                {loading ? (
                    <div className="state-message">Chargement des utilisateurs...</div>
                ) : filtered.length === 0 ? (
                    <div className="state-message">
                        <div className="icon">👤</div>
                        Aucun utilisateur trouvé.
                    </div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Utilisateur</th>
                                <th>Email</th>
                                <th>Matricule</th>
                                <th>Département</th>
                                <th>Rôle</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((u) => (
                                <tr key={u.id}>
                                    <td>
                                        <div className="user-cell">
                                            <div className="user-avatar">
                                                {getInitials(u.firstName, u.lastName)}
                                            </div>
                                            <span>{u.firstName} {u.lastName}</span>
                                        </div>
                                    </td>
                                    <td>{u.email}</td>
                                    <td>{u.matricule || "—"}</td>
                                    <td>{u.department || "—"}</td>
                                    <td>
                                        <span className={`role-badge role-${u.role?.toLowerCase().replace("role_", "")}`}>
                                            {ROLE_LABELS[u.role] || u.role}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal ajout utilisateur */}
            {showModal && (
                <div className="modal-overlay" onClick={(e) => {
                    if (e.target.classList.contains("modal-overlay")) setShowModal(false);
                }}>
                    <div className="modal-card">
                        <div className="modal-header">
                            <h2>Nouvel utilisateur</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
                        </div>

                        {message && (
                            <div className={message.type === "success" ? "alert-success" : "alert-error"}>
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="form-row">
                                <div className="field-group">
                                    <label>Prénom</label>
                                    <input
                                        className="text-input"
                                        value={form.firstName}
                                        onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="field-group">
                                    <label>Nom</label>
                                    <input
                                        className="text-input"
                                        value={form.lastName}
                                        onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="field-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    className="text-input"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="field-group">
                                <label>Mot de passe</label>
                                <input
                                    type="password"
                                    className="text-input"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="field-group">
                                    <label>Matricule</label>
                                    <input
                                        className="text-input"
                                        value={form.matricule}
                                        onChange={(e) => setForm({ ...form, matricule: e.target.value })}
                                    />
                                </div>
                                <div className="field-group">
                                    <label>Département</label>
                                    <input
                                        className="text-input"
                                        value={form.department}
                                        onChange={(e) => setForm({ ...form, department: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="field-group">
                                <label>Rôle</label>
                                <select
                                    className="text-input"
                                    value={form.role}
                                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                                >
                                    {ROLES.map((r) => (
                                        <option key={r.value} value={r.value}>{r.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="btn-cancel"
                                    onClick={() => setShowModal(false)}
                                >
                                    Annuler
                                </button>
                                <button className="btn-create" disabled={submitting}>
                                    {submitting ? "Création..." : "Créer le compte"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;