import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRapportTous } from "../../services/absenceService";
import { getJustificatifsEnAttente, changerStatutJustificatif } from "../../services/justificatifService";
import "./AbsencesRhPage.css";

function premierEtDernierJourMois() {
    const now = new Date();
    const debut = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
    const fin = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().slice(0, 10);
    return { debut, fin };
}

export default function AbsencesRhPage() {
    const navigate = useNavigate();
    const { debut, fin } = premierEtDernierJourMois();
    const [rapports, setRapports] = useState([]);
    const [justificatifs, setJustificatifs] = useState([]);
    const [loading, setLoading] = useState(true);

    const charger = () => {
        Promise.all([getRapportTous(debut, fin), getJustificatifsEnAttente()])
            .then(([rapportsRes, justifRes]) => {
                setRapports(Array.isArray(rapportsRes.data) ? rapportsRes.data : []);
                setJustificatifs(Array.isArray(justifRes.data) ? justifRes.data : []);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => { charger(); }, []);

    const handleDecision = async (id, statut) => {
        try {
            await changerStatutJustificatif(id, statut, "");
            charger();
        } catch (err) {
            alert(err.response?.data?.message || "Erreur.");
        }
    };

    return (
        <div className="absences-rh-page">
            <button type="button" className="back-btn" onClick={() => navigate("/rh/dashboard")}>
                ← Retour
            </button>

            <h1 className="page-title">Suivi des absences — {debut.slice(0, 7)}</h1>

            {loading ? <p>Chargement...</p> : (
                <>
                    <section className="justif-section">
                        <h2>Justificatifs en attente</h2>
                        {justificatifs.length === 0 ? (
                            <p className="empty-state">Aucun justificatif en attente.</p>
                        ) : (
                            <div className="justif-list">
                                {justificatifs.map((j) => (
                                    <div className="justif-card" key={j.id}>
                                        <div>
                                            <strong>{j.employeNom}</strong>
                                            <p>{j.dateDebut} → {j.dateFin} — {j.motif}</p>
                                        </div>
                                        <div className="justif-actions">
                                            <button className="btn-accepter" onClick={() => handleDecision(j.id, "VALIDE")}>Valider</button>
                                            <button className="btn-refuser" onClick={() => handleDecision(j.id, "REFUSE")}>Refuser</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    <section className="rapport-section">
                        <h2>Rapport mensuel — absences & retenues</h2>
                        <table className="rapport-table">
                            <thead>
                                <tr>
                                    <th>Employé</th>
                                    <th>Salaire mensuel</th>
                                    <th>Jours présents</th>
                                    <th>Congés</th>
                                    <th>Justifiés</th>
                                    <th>Absences non justifiées</th>
                                    <th>Retenue (DT)</th>
                                    <th>Salaire net estimé</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rapports.map((r) => (
                                    <tr key={r.employeId} className={r.joursAbsenceNonJustifiee > 0 ? "alerte" : ""}>
                                        <td>{r.employeNom}</td>
                                        <td>{r.salaireMensuel?.toFixed(3)} DT</td>
                                        <td>{r.joursPresents}</td>
                                        <td>{r.joursCongeApprouve}</td>
                                        <td>{r.joursJustifies}</td>
                                        <td>{r.joursAbsenceNonJustifiee}</td>
                                        <td>{r.montantRetenue?.toFixed(3)} DT</td>
                                        <td>{r.salaireNetEstime?.toFixed(3)} DT</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                </>
            )}
        </div>
    );
}