import { useState } from "react";
import { createLeave } from "../../services/leaveService";
import DateRangeCalendar from "../../components/DateRangeCalendar/DateRangeCalendar";
import "./NewLeave.css";
import { useNavigate } from "react-router-dom";

const MOTIFS = ["Maladie", "Congé annuel", "Événement familial", "Autre"];

const MESSAGES_PAR_STATUT = {
    PENDING_CHEF: "Votre demande a bien été envoyée à votre chef de service.",
    PENDING_RH: "Votre demande a bien été envoyée au RH pour confirmation.",
};

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

function NewLeave() {
    const navigate = useNavigate();

    const [leave, setLeave] = useState({
        employeeId: "EMP001",
        employeeName: "Employe STIR",
        startDate: "",
        endDate: "",
        reason: ""
    });

    const [motifChoice, setMotifChoice] = useState("");
    const [customReason, setCustomReason] = useState("");
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const finalReason = motifChoice === "Autre" ? customReason.trim() : motifChoice;

    const validate = () => {
        const errs = {};

        if (!leave.startDate) errs.startDate = "Sélectionnez une date de début.";
        if (!leave.endDate) errs.endDate = "Sélectionnez une date de fin.";

        if (leave.startDate && leave.endDate) {
            const start = new Date(leave.startDate);
            const end = new Date(leave.endDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (start < today) {
                errs.startDate = "La date de début ne peut pas être dans le passé.";
            }
            if (end < start) {
                errs.endDate = "La date de fin doit être après la date de début.";
            }
        }

        if (!motifChoice) {
            errs.reason = "Sélectionnez un motif.";
        } else if (motifChoice === "Autre" && customReason.trim().length < 3) {
            errs.reason = "Précisez le motif (3 caractères minimum).";
        }

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess(false);
        setSuccessMessage("");

        if (!validate()) return;

        setSubmitting(true);
        try {
            const response = await createLeave({ ...leave, reason: finalReason });
            const data = response.data ?? response;

            if (data.status === "REFUSED_QUOTA_DEPASSE") {
                setErrors({ global: data.comment });
            } else {
                setSuccess(true);
                setSuccessMessage(
                    MESSAGES_PAR_STATUT[data.status] || "Votre demande a bien été envoyée."
                );
                setLeave({ ...leave, startDate: "", endDate: "" });
                setMotifChoice("");
                setCustomReason("");
            }
        } catch (error) {
            console.error("Erreur création demande de congé", error);
            setErrors({ global: "Une erreur est survenue lors de l'envoi de la demande." });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="new-leave-page">
            <div className="new-leave-header">
                <button type="button" className="back-btn" onClick={() => navigate(getDashboardPath())}>
                    ← Retour
                </button>
                <span className="eyebrow">Espace collaborateur</span>
                <h1 className = "page-title">Nouvelle demande de congé</h1>
                <p>Choisissez vos dates dans le calendrier et précisez le motif de votre absence.</p>
            </div>

            <form className="new-leave-layout" onSubmit={handleSubmit}>
                <div className="calendar-column">
                    <DateRangeCalendar
                        startDate={leave.startDate}
                        endDate={leave.endDate}
                        onChange={({ startDate, endDate }) =>
                            setLeave((l) => ({ ...l, startDate, endDate }))
                        }
                    />
                    {(errors.startDate || errors.endDate) && (
                        <div className="field-error">{errors.startDate || errors.endDate}</div>
                    )}
                </div>

                <div className="form-column">
                    {success && (
                        <div className="alert-success">
                            {successMessage}
                        </div>
                    )}
                    {errors.global && <div className="alert-error">{errors.global}</div>}

                    <div className="field-group">
                        <label>Dates sélectionnées</label>
                        <div className="dates-summary">
                            <div>
                                <span className="label">Début</span>
                                <strong>{leave.startDate || "Non choisie"}</strong>
                            </div>
                            <span className="sep">→</span>
                            <div>
                                <span className="label">Fin</span>
                                <strong>{leave.endDate || "Non choisie"}</strong>
                            </div>
                        </div>
                    </div>

                    <div className="field-group">
                        <label htmlFor="motif">Motif</label>
                        <select
                            id="motif"
                            className="select-input"
                            value={motifChoice}
                            onChange={(e) => setMotifChoice(e.target.value)}
                        >
                            <option value="">Sélectionnez un motif</option>
                            {MOTIFS.map((m) => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                        {errors.reason && <div className="field-error">{errors.reason}</div>}
                    </div>

                    {motifChoice === "Autre" && (
                        <div className="field-group">
                            <label htmlFor="customReason">Précisez</label>
                            <input
                                id="customReason"
                                className="text-input"
                                placeholder="Décrivez brièvement le motif"
                                value={customReason}
                                onChange={(e) => setCustomReason(e.target.value)}
                            />
                        </div>
                    )}

                    <button className="submit-btn" disabled={submitting}>
                        {submitting ? "Envoi en cours..." : "Envoyer la demande"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default NewLeave;
