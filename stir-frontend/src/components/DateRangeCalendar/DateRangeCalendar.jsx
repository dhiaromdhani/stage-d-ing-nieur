import { useState } from "react";
import "./DateRangeCalendar.css";

const MONTHS = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];
const DAYS = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"];

function toISO(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function parseLocalDate(value) {
    if (!value) return null;

    if (value instanceof Date) {
        return new Date(value.getFullYear(), value.getMonth(), value.getDate());
    }

    const [year, month, day] = String(value).split("-").map(Number);
    if (!year || !month || !day) return null;

    return new Date(year, month - 1, day);
}

function isBeforeToday(date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
}

function buildMonthGrid(year, month) {
    const firstDay = new Date(year, month, 1);
    // Lundi = 0 ... Dimanche = 6
    const startOffset = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells = [];
    for (let i = 0; i < startOffset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    return cells;
}

export default function DateRangeCalendar({ startDate, endDate, onChange }) {
    const [viewDate, setViewDate] = useState(new Date());

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const cells = buildMonthGrid(year, month);

    const start = startDate ? parseLocalDate(startDate) : null;
    const end = endDate ? parseLocalDate(endDate) : null;

    const handleDayClick = (date) => {
        if (isBeforeToday(date)) return;

        // Aucune sélection, ou sélection déjà complète -> on recommence
        if (!start || (start && end)) {
            onChange({ startDate: toISO(date), endDate: "" });
            return;
        }

        // Un début est déjà choisi
        if (date < start) {
            onChange({ startDate: toISO(date), endDate: toISO(start) });
        } else {
            onChange({ startDate: toISO(start), endDate: toISO(date) });
        }
    };

    const isInRange = (date) => {
        if (!start || !end) return false;
        return date >= start && date <= end;
    };

    const isEdge = (date) => {
        if (start && toISO(date) === toISO(start)) return true;
        if (end && toISO(date) === toISO(end)) return true;
        return false;
    };

    const changeMonth = (delta) => {
        setViewDate(new Date(year, month + delta, 1));
    };

    return (
        <div className="range-calendar">
            <div className="range-calendar-header">
                <button type="button" onClick={() => changeMonth(-1)} aria-label="Mois précédent">
                    ‹
                </button>
                <span>{MONTHS[month]} {year}</span>
                <button type="button" onClick={() => changeMonth(1)} aria-label="Mois suivant">
                    ›
                </button>
            </div>

            <div className="range-calendar-daynames">
                {DAYS.map((d) => <span key={d}>{d}</span>)}
            </div>

            <div className="range-calendar-grid">
                {cells.map((date, i) =>
                    date === null ? (
                        <span key={i} className="empty-cell" />
                    ) : (
                        <button
                            type="button"
                            key={i}
                            disabled={isBeforeToday(date)}
                            className={
                                "day-cell" +
                                (isInRange(date) ? " in-range" : "") +
                                (isEdge(date) ? " edge" : "") +
                                (isBeforeToday(date) ? " disabled" : "")
                            }
                            onClick={() => handleDayClick(date)}
                        >
                            {date.getDate()}
                        </button>
                    )
                )}
            </div>

            <div className="range-calendar-footer">
                <div>
                    <span className="footer-label">Début</span>
                    <strong>{startDate || "—"}</strong>
                </div>
                <div>
                    <span className="footer-label">Fin</span>
                    <strong>{endDate || "—"}</strong>
                </div>
            </div>
        </div>
    );
}