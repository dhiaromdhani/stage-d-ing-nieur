import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMySolde } from "../../services/soldeService";
import { demanderConversion, getMesConversions } from "../../services/conversionService";
import "./ConvertirCongePage.css";

function getDashboardPath() {
    const role = localStorage.getItem("role");
    const routes = {
        ROLE_EMPLOYEE: "/employee",
        ROLE_CHEF: "/chef/dashboard",
        ROLE_SOUS_DIRECTEUR: "/sous-directeur/dashboard",
        ROLE_DIRECTEUR: "/directeur/dashboard",
        ROLE_RH: "/rh/dashboard",
        ROLE_ADMIN: "/admin/dashboard",
    };
    return routes[role] || "/login";
}

export default function ConvertirCongePage() {
    const navigate = useNavigate();
    const [solde, setSolde] = useState(null);
    const [jours, setJours] = useState(1);
    const [historique, setHistorique] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState(null);

    const chargerDonnees = () => {
        Promise.all([getMySolde(), getMesConversions()])
            .then(([soldeData, convRes]) => {
                setSolde(soldeData);
                setHistorique(Array.isArray(convRes.data) ? convRes.data : []);
            })
            .catch(() => setMessage({ type: "error", text: "Impossible de charger vos données." }))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        chargerDonnees();
    }, []);

    const restant = solde?.joursRestants ?? solde?.restant ?? 0;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setSubmitting(true);
        try {
            await demanderConversion(Number(jours));
            setMessage({ type: "success", text: "Votre demande de conversion a été envoyée au RH." });
            setJours(1);
            chargerDonnees();
        } catch (err) {
            setMessage({
                type: "error",
                text: err.response?.data?.message || "Erreur lors de l'envoi de la demande.",
            });
        } finally {
            setSubmitting(false);
        }
    };

    const STATUT_LABELS = {
        EN_ATTENTE: { label: "En attente", className: "pending" },
        ACCEPTEE: { label: "Acceptée", className: "validated" },
        REFUSEE: { label: "Refusée", className: "refused" },
    };

    return (
        <div className="convert-page">
            <button type="button" className="back-btn" onClick={() => navigate(getDashboardPath())}>
                ← Retour
            </button>

            <div className="convert-header">
                <span className="eyebrow">Espace collaborateur</span>
                <h1 className="page-title">Convertir mes congés en argent</h1>
                <p>
                    Transformez vos jours de congé non utilisés en indemnité, calculée sur la base de
                    votre salaire journalier. Chaque demande est soumise à validation du RH.
                </p>
            </div>

            {loading ? (
                <p>Chargement...</p>
            ) : (
                <>
                    <div className="convert-solde-card">
                        <span className="convert-solde-label">Solde de congés restant</span>
                        <span className="convert-solde-value">{restant} jour{restant > 1 ? "s" : ""}</span>
                    </div>

                    <form className="convert-form" onSubmit={handleSubmit}>
                        <label>
                            Nombre de jours à convertir
                            <input
                                type="number"
                                min="1"
                                max={restant}
                                value={jours}
                                onChange={(e) => setJours(e.target.value)}
                                required
                            />
                        </label>

                        {message && (
                            <div className={`convert-alert ${message.type}`}>{message.text}</div>
                        )}

                        <button type="submit" className="convert-submit-btn" disabled={submitting || restant === 0}>
                            {submitting ? "Envoi..." : "Envoyer la demande"}
                        </button>
                    </form>

                    <div className="convert-history">
                        <h2>Historique de mes demandes</h2>
                        {historique.length === 0 ? (
                            <p className="empty-state">Aucune demande envoyée pour le moment.</p>
                        ) : (
                            <table className="convert-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Jours</th>
                                        <th>Montant estimé</th>
                                        <th>Statut</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {historique.map((c) => {
                                        const s = STATUT_LABELS[c.statut] || { label: c.statut, className: "pending" };
                                        return (
                                            <tr key={c.id}>
                                                <td>{new Date(c.dateDemande).toLocaleDateString("fr-FR")}</td>
                                                <td>{c.nombreJours}</td>
                                                <td>{c.montantCalcule?.toFixed(3)} DT</td>
                                                <td><span className={`status-badge ${s.className}`}>{s.label}</span></td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}