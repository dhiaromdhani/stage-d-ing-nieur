import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { pointerEntree, pointerSortie } from "../../services/pointageService";
import { soumettreJustificatif, getMesJustificatifs } from "../../services/justificatifService";
import { useEffect } from "react";
import "./PointagePage.css";

function getDashboardPath() {
    const role = localStorage.getItem("role");
    const routes = {
        ROLE_EMPLOYEE: "/employee", ROLE_CHEF: "/chef/dashboard",
        ROLE_SOUS_DIRECTEUR: "/sous-directeur/dashboard", ROLE_DIRECTEUR: "/directeur/dashboard",
        ROLE_RH: "/rh/dashboard", ROLE_ADMIN: "/admin/dashboard",
    };
    return routes[role] || "/login";
}

const STATUT_LABELS = {
    EN_ATTENTE: { label: "En attente", className: "pending" },
    VALIDE: { label: "Validé", className: "validated" },
    REFUSE: { label: "Refusé", className: "refused" },
};

export default function PointagePage() {
    const navigate = useNavigate();
    const [message, setMessage] = useState(null);
    const [loadingAction, setLoadingAction] = useState(false);

    const [form, setForm] = useState({ dateDebut: "", dateFin: "", motif: "" });
    const [justificatifs, setJustificatifs] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    const chargerJustificatifs = () => {
        getMesJustificatifs()
            .then((res) => setJustificatifs(Array.isArray(res.data) ? res.data : []))
            .catch(() => {});
    };

    useEffect(() => { chargerJustificatifs(); }, []);

    const handleEntree = async () => {
        setLoadingAction(true);
        setMessage(null);
        try {
            await pointerEntree();
            setMessage({ type: "success", text: "Entrée pointée avec succès." });
        } catch (err) {
            setMessage({ type: "error", text: err.response?.data?.message || "Erreur." });
        } finally {
            setLoadingAction(false);
        }
    };

    const handleSortie = async () => {
        setLoadingAction(true);
        setMessage(null);
        try {
            await pointerSortie();
            setMessage({ type: "success", text: "Sortie pointée avec succès." });
        } catch (err) {
            setMessage({ type: "error", text: err.response?.data?.message || "Erreur." });
        } finally {
            setLoadingAction(false);
        }
    };

    const handleSubmitJustificatif = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await soumettreJustificatif(form.dateDebut, form.dateFin, form.motif);
            setForm({ dateDebut: "", dateFin: "", motif: "" });
            chargerJustificatifs();
        } catch (err) {
            alert(err.response?.data?.message || "Erreur lors de l'envoi.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="pointage-page">
            <button type="button" className="back-btn" onClick={() => navigate(getDashboardPath())}>
                ← Retour
            </button>

            <h1 className="page-title">Pointage & justificatifs</h1>
            <p className="pointage-subtitle">
                Pointez votre présence chaque jour. En cas d'absence, soumettez un justificatif pour
                éviter une retenue sur votre salaire.
            </p>

            {message && <div className={`pointage-alert ${message.type}`}>{message.text}</div>}

            <div className="pointage-actions">
                <button className="pointage-btn entree" onClick={handleEntree} disabled={loadingAction}>
                    Pointer entrée
                </button>
                <button className="pointage-btn sortie" onClick={handleSortie} disabled={loadingAction}>
                    Pointer sortie
                </button>
            </div>

            <div className="justificatif-block">
                <h2>Soumettre un justificatif d'absence</h2>
                <form onSubmit={handleSubmitJustificatif} className="justificatif-form">
                    <div className="form-row">
                        <label>
                            Date début
                            <input
                                type="date"
                                required
                                value={form.dateDebut}
                                onChange={(e) => setForm({ ...form, dateDebut: e.target.value })}
                            />
                        </label>
                        <label>
                            Date fin
                            <input
                                type="date"
                                required
                                value={form.dateFin}
                                onChange={(e) => setForm({ ...form, dateFin: e.target.value })}
                            />
                        </label>
                    </div>
                    <label>
                        Motif
                        <textarea
                            required
                            placeholder="Ex: certificat médical, cas de force majeure..."
                            value={form.motif}
                            onChange={(e) => setForm({ ...form, motif: e.target.value })}
                        />
                    </label>
                    <button type="submit" className="submit-btn" disabled={submitting}>
                        {submitting ? "Envoi..." : "Envoyer le justificatif"}
                    </button>
                </form>
            </div>

            <div className="justificatif-history">
                <h2>Mes justificatifs</h2>
                {justificatifs.length === 0 ? (
                    <p className="empty-state">Aucun justificatif soumis.</p>
                ) : (
                    <table className="justificatif-table">
                        <thead>
                            <tr><th>Période</th><th>Motif</th><th>Statut</th></tr>
                        </thead>
                        <tbody>
                            {justificatifs.map((j) => {
                                const s = STATUT_LABELS[j.statut] || { label: j.statut, className: "pending" };
                                return (
                                    <tr key={j.id}>
                                        <td>{j.dateDebut} → {j.dateFin}</td>
                                        <td>{j.motif}</td>
                                        <td><span className={`status-badge ${s.className}`}>{s.label}</span></td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}