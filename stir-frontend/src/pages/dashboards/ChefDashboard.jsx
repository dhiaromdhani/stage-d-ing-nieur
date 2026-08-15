import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLeavesByStatus, validateLeave, refuseLeave } from "../../services/leaveService";
import { IconCalendarPlus, IconFileText, IconInbox } from "../../components/Icons/Icons";
import "./ChefDashboard.css";

function getInitials(name = "") {
    return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

const ROLES_CADRES = ["ROLE_CHEF", "ROLE_SOUS_DIRECTEUR", "ROLE_DIRECTEUR"];

export function LeaveDashboard({ status, title, role }) {
    const [leaves, setLeaves] = useState([]);
    const [refuseComment, setRefuseComment] = useState({});
    const [showRefuse, setShowRefuse] = useState({});

    const load = useCallback(async () => {
        try {
            const res = await getLeavesByStatus(status);
            setLeaves(res.data);
        } catch (error) {
            console.error("Erreur chargement demandes", error);
        }
    }, [status]);

    useEffect(() => { load(); }, [load]);

    const handleValidate = async (id) => {
        try {
            await validateLeave(id, "");
            load();
        } catch (err) {
            console.error("Erreur validation :", err.response?.data || err.message);
            alert(err.response?.data?.message || "Erreur lors de la validation");
        }
    };

    const handleRefuse = async (id) => {
        const comment = refuseComment[id];
        if (!comment || comment.trim() === "") {
            alert("Le commentaire de refus est obligatoire.");
            return;
        }
        try {
            await refuseLeave(id, comment);
            load();
        } catch (err) {
            console.error("Erreur refus :", err.response?.data || err.message);
            alert(err.response?.data?.message || "Erreur lors du refus");
        }
    };

    return (
        <div className="chef-dashboard">
            <div className="dashboard-header">
                <div>
                    <span className="eyebrow">Espace {role}</span>
                    <h1 className="dashboard-title page-title">{title}</h1>
                    <p className="dashboard-subtitle">
                        Validez ou refusez les demandes en attente.
                    </p>
                </div>
                <div className="dashboard-header-right">
                    <div className="own-leave-actions">
                        <Link to="/leave/new" className="btn-poser-conge">
                            <IconCalendarPlus size={15} /> Poser un congé
                        </Link>
                        <Link to="/leave/my" className="btn-mes-demandes">
                            <IconFileText size={15} /> Mes demandes
                        </Link>
                    </div>
                    <div className="pending-count">
                        <span className="dot"></span>
                        {leaves.length} demande{leaves.length > 1 ? "s" : ""} en attente
                    </div>
                </div>
            </div>

            {leaves.length === 0 ? (
                <div className="empty-state">
                    <IconInbox size={40} className="empty-icon" />
                    <h3>Aucune demande en attente</h3>
                    <p>Toutes les demandes ont été traitées.</p>
                </div>
            ) : (
                <div className="leave-grid">
                    {leaves.map((l) => (
                        <div className="leave-card" key={l.id}>
                            <div className="leave-card-top">
                                <div className="avatar">{getInitials(l.employeeName)}</div>
                                <div>
                                    <h4 className="employee-name">{l.employeeName}</h4>
                                    <span className="motif-badge">{l.reason}</span>
                                    {status === "PENDING_RH" && ROLES_CADRES.includes(l.role) && (
                                        <span className="cadre-badge">Congé cadre — validation directe</span>
                                    )}
                                </div>
                            </div>

                            <div className="leave-dates">
                                <div className="date-block">
                                    <span className="date-label">Début</span>
                                    <span className="date-value">{l.startDate}</span>
                                </div>
                                <span className="arrow">→</span>
                                <div className="date-block">
                                    <span className="date-label">Fin</span>
                                    <span className="date-value">{l.endDate}</span>
                                </div>
                            </div>

                            {showRefuse[l.id] && (
                                <textarea
                                    className="refuse-comment"
                                    placeholder="Commentaire de refus (obligatoire)..."
                                    value={refuseComment[l.id] || ""}
                                    onChange={(e) =>
                                        setRefuseComment({ ...refuseComment, [l.id]: e.target.value })
                                    }
                                />
                            )}

                            <div className="leave-actions">
                                <button
                                    className="btn-validate"
                                    onClick={() => handleValidate(l.id)}
                                >
                                    Valider
                                </button>
                                {!showRefuse[l.id] ? (
                                    <button
                                        className="btn-refuse"
                                        onClick={() =>
                                            setShowRefuse({ ...showRefuse, [l.id]: true })
                                        }
                                    >
                                        Refuser
                                    </button>
                                ) : (
                                    <button
                                        className="btn-refuse active"
                                        onClick={() => handleRefuse(l.id)}
                                    >
                                        Confirmer refus
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function ChefDashboard() {
    return (
        <LeaveDashboard
            status="PENDING_CHEF"
            title="Dashboard Chef de Service"
            role="Chef de service"
        />
    );
}

export default ChefDashboard;