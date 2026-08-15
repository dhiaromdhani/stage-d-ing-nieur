import { useState, useRef, useEffect } from "react";
import "./EmailAutocomplete.css";

export default function EmailAutocomplete({ value, onChange, users, loading }) {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filtered = users.filter((u) =>
        u.email?.toLowerCase().includes(value.toLowerCase())
    );

    return (
        <div className="email-autocomplete" ref={wrapperRef}>
            <input
                type="email"
                placeholder="nom@stir.tn"
                value={value}
                onChange={(e) => {
                    onChange(e.target.value);
                    setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                required
            />

            {open && (
                <div className="email-suggestions">
                    {loading ? (
                        <div className="suggestion-info">Chargement des comptes...</div>
                    ) : filtered.length === 0 ? (
                        <div className="suggestion-info">
                            Aucun compte existant — vous pouvez saisir un email manuellement.
                        </div>
                    ) : (
                        filtered.map((u) => (
                            <button
                                type="button"
                                key={u.id || u.email}
                                className="suggestion-item"
                                onClick={() => {
                                    onChange(u.email);
                                    setOpen(false);
                                }}
                            >
                                <span className="suggestion-email">{u.email}</span>
                                {(u.firstName || u.lastName) && (
                                    <span className="suggestion-name">
                                        {u.firstName} {u.lastName}
                                    </span>
                                )}
                            </button>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}