import { useEffect, useState, useRef } from "react";
import { getApiErrorMessage } from "../../services/api";
import { getMyNotifications, getUnreadCount, markAsRead } from "../../services/notificationService";
import { changerStatutCandidature } from "../../services/candidatureService";
import { changerStatutConversion } from "../../services/conversionService";
import { repondreAffectation } from "../../services/activiteService";
import { IconBell, IconCheck, IconX } from "../Icons/Icons";
import "./NotificationBell.css";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [traitementEnCours, setTraitementEnCours] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const ref = useRef(null);

  const chargerNotifications = () => {
    getMyNotifications()
      .then((res) => {
        setNotifications(Array.isArray(res.data) ? res.data : []);
        setErrorMessage("");
      })
      .catch((err) => {
        setErrorMessage(getApiErrorMessage(err, "Impossible de charger les notifications."));
      });
  };

  const chargerCompteur = () => {
    getUnreadCount()
      .then((res) => {
        setUnreadCount(res.data?.count ?? 0);
        setErrorMessage("");
      })
      .catch((err) => {
        setErrorMessage(getApiErrorMessage(err, "Impossible de charger le compteur de notifications."));
      });
  };

  useEffect(() => {
    chargerCompteur();
    const interval = setInterval(chargerCompteur, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOpen = () => {
    if (!open) chargerNotifications();
    setOpen(!open);
  };

  const handleMarkAsRead = (id) => {
    markAsRead(id).then(() => {
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, lue: true } : n)));
      setUnreadCount((c) => Math.max(0, c - 1));
    });
  };

const handleDecision = async (notif, statut) => {
    setTraitementEnCours(notif.id);
    try {
        if (notif.type === "CONVERSION_CONGE") {
            await changerStatutConversion(notif.candidatureId, statut, "");
        } else if (notif.type === "AFFECTATION") {
            await repondreAffectation(notif.candidatureId, statut);
        } else {
            await changerStatutCandidature(notif.candidatureId, statut);
        }
        handleMarkAsRead(notif.id);
        setNotifications((prev) =>
            prev.map((n) => (n.id === notif.id ? { ...n, decisionPrise: statut } : n))
        );
    } catch (err) {
        console.error("Erreur décision :", err);
        alert(err.response?.data?.message || "Impossible de traiter cette demande.");
    } finally {
        setTraitementEnCours(null);
    }
}

  return (
    <div className="notification-bell" ref={ref}>
      <button className="bell-btn" onClick={toggleOpen} aria-label="Notifications">
        <IconBell size={19} />
        {unreadCount > 0 && <span className="bell-badge">{unreadCount}</span>}
      </button>

      {open && (
        <div className="bell-dropdown">
          <div className="bell-dropdown-header">Notifications</div>
          {errorMessage && <p className="bell-empty">{errorMessage}</p>}
          {notifications.length === 0 && !errorMessage && <p className="bell-empty">Aucune notification.</p>}
          {notifications.map((n) => (
            <div key={n.id} className={`bell-item ${n.lue ? "" : "unread"}`}>
              <div onClick={() => !n.lue && handleMarkAsRead(n.id)}>
                <strong>{n.titre}</strong>
                <p>{n.message}</p>
              </div>

              {(n.type === "CANDIDATURE" || n.type === "CONVERSION_CONGE") && !n.decisionPrise && (
                <div className="bell-actions">
                  <button
                    className="btn-accepter"
                    disabled={traitementEnCours === n.id}
                    onClick={() => handleDecision(n, "ACCEPTEE")}
                  >
                    <IconCheck size={13} /> Accepter
                  </button>
                  <button
                    className="btn-refuser"
                    disabled={traitementEnCours === n.id}
                    onClick={() => handleDecision(n, "REFUSEE")}
                  >
                    <IconX size={13} /> Refuser
                  </button>
                </div>
              )}
              {n.decisionPrise && (
                <span className={`bell-decision-tag ${n.decisionPrise === "ACCEPTEE" ? "ok" : "ko"}`}>
                  {n.decisionPrise === "ACCEPTEE" ? <IconCheck size={12} /> : <IconX size={12} />}
                  {n.decisionPrise === "ACCEPTEE" ? "Acceptée" : "Refusée"}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}