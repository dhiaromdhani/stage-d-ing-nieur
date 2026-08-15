import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEmployeeLeaves } from "../../services/leaveService";
import { IconInbox } from "../../components/Icons/Icons";
import "./MyLeaves.css";

const DASHBOARD_BY_ROLE = {
    ROLE_EMPLOYEE: "/employee",
    ROLE_CHEF: "/chef/dashboard",
    ROLE_SOUS_DIRECTEUR: "/sous-directeur/dashboard",
    ROLE_DIRECTEUR: "/directeur/dashboard",
    ROLE_RH: "/rh/dashboard",
    ROLE_ADMIN: "/admin/dashboard",
};

const STATUS_LABELS = {
    PENDING_CHEF:            { label: "En attente — Chef",           className: "pending" },
    PENDING_SOUS_DIRECTEUR:  { label: "En attente — Sous-directeur", className: "pending" },
    PENDING_DIRECTEUR:       { label: "En attente — Directeur",      className: "pending" },
    PENDING_RH:              { label: "En attente — RH",             className: "pending" },
    APPROVED:                { label: "Approuvée ✓",                 className: "validated" },
    REFUSED_CHEF:            { label: "Refusée par Chef",            className: "refused" },
    REFUSED_SOUS_DIRECTEUR:  { label: "Refusée par Sous-directeur",  className: "refused" },
    REFUSED_DIRECTEUR:       { label: "Refusée par Directeur",       className: "refused" },
    REFUSED_RH:              { label: "Refusée par RH",              className: "refused" },
};

function StatusBadge({ status }) {
    const config = STATUS_LABELS[status] || { label: status, className: "pending" };
    return <span className={`status-badge ${config.className}`}>{config.label}</span>;
}

function MyLeaves() {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const dashboardPath = DASHBOARD_BY_ROLE[localStorage.getItem("role")] || "/login";

    useEffect(() => {
        getEmployeeLeaves()
            .then((res) => setLeaves(res.data))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="my-leaves-page">
            <div className="my-leaves-header">
                <Link to={dashboardPath} className="back-link">
                    ← Retour au tableau de bord
                </Link>
                <span className="eyebrow">Espace collaborateur</span>
                <h1 className= "page-title">Mes demandes de congé</h1>
                <p>Suivez l'état de vos demandes envoyées.</p>
            </div>

            <div className="my-leaves-card">
                {loading ? (
                    <div className="state-message">Chargement de vos demandes...</div>
                ) : leaves.length === 0 ? (
                    <div className="state-message">
                        <IconInbox size={36} className="state-icon" />
                        Vous n'avez encore soumis aucune demande de congé.
                    </div>
                ) : (
                    <table className="leaves-table">
                        <thead>
                            <tr>
                                <th>Date début</th>
                                <th>Date fin</th>
                                <th>Motif</th>
                                <th>Statut</th>
                                <th>Commentaire</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaves.map((l) => (
                                <tr key={l.id}>
                                    <td>{l.startDate}</td>
                                    <td>{l.endDate}</td>
                                    <td>{l.reason}</td>
                                    <td>
                                        <StatusBadge status={l.status} />
                                    </td>
                                    <td>
                                        {l.comment ? (
                                            <span className={
                                                l.status?.startsWith("REFUSED")
                                                    ? "comment-refused"
                                                    : "comment-normal"
                                            }>
                                                {l.comment}
                                            </span>
                                        ) : (
                                            <span className="comment-empty">—</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default MyLeaves;