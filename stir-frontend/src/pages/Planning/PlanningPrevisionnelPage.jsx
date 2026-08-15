import { useEffect, useState } from "react";

import {
    getTeamPlanning,
    getMyPlanning,
    createPlanning,
    updatePlanning,
    deletePlanning
} from "../../services/planningPrevisionnelService";

import "./PlanningPrevisionnelPage.css";


function PlanningPrevisionnelPage() {

    const role = localStorage.getItem("role");

    const [teamPlanning, setTeamPlanning] = useState([]);
    const [myPlanning, setMyPlanning] = useState([]);

    const [loading, setLoading] = useState(true);

    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        startDate: "",
        endDate: "",
        reason: ""
    });


    const isChef = role === "ROLE_CHEF";


    // =========================================================
    // Chargement
    // =========================================================

    const loadData = async () => {

        try {

            setLoading(true);

            const mine = await getMyPlanning();

            setMyPlanning(mine);


            if (isChef) {

                const team = await getTeamPlanning();

                setTeamPlanning(team);
            }

        } catch (error) {

            console.error(
                "Erreur chargement planning :",
                error
            );

            alert(
                "Impossible de charger le planning."
            );

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {

        loadData();

    }, []);


    // =========================================================
    // Input
    // =========================================================

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };


    // =========================================================
    // Submit
    // =========================================================

    const handleSubmit = async (e) => {

        e.preventDefault();


        if (!form.startDate ||
            !form.endDate) {

            alert(
                "Veuillez sélectionner les dates."
            );

            return;
        }


        if (
            new Date(form.endDate) <
            new Date(form.startDate)
        ) {

            alert(
                "La date de fin doit être après la date de début."
            );

            return;
        }


        try {

            if (editingId) {

                await updatePlanning(
                    editingId,
                    form
                );

            } else {

                await createPlanning(
                    form
                );
            }


            resetForm();

            await loadData();


        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                error.response?.data ||
                "Une erreur est survenue."
            );
        }
    };


    // =========================================================
    // Modifier
    // =========================================================

    const handleEdit = (planning) => {

        setEditingId(
            planning.id
        );

        setForm({
            startDate:
                planning.startDate || "",

            endDate:
                planning.endDate || "",

            reason:
                planning.reason || ""
        });


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };


    // =========================================================
    // Supprimer
    // =========================================================

    const handleDelete = async (id) => {

        const confirmed =
            window.confirm(
                "Voulez-vous supprimer cette prévision ?"
            );


        if (!confirmed) {
            return;
        }


        try {

            await deletePlanning(id);

            await loadData();

        } catch (error) {

            console.error(error);

            alert(
                "Impossible de supprimer la prévision."
            );
        }
    };


    // =========================================================
    // Reset
    // =========================================================

    const resetForm = () => {

        setEditingId(null);

        setForm({
            startDate: "",
            endDate: "",
            reason: ""
        });
    };


    // =========================================================
    // Format date
    // =========================================================

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleDateString(
            "fr-FR"
        );
    };


    return (

        <div className="planning-page">

            <div className="planning-header">

                <div>

                    <h1>
                        Planning prévisionnel
                    </h1>

                    <p>
                        Déclarez vos congés envisagés
                        afin d'aider le service à anticiper
                        la charge de travail.
                    </p>

                </div>

            </div>


            {/* ================================================= */}
            {/* FORMULAIRE */}
            {/* ================================================= */}

            <div className="planning-card">

                <h2>
                    {editingId
                        ? "Modifier ma prévision"
                        : "Ajouter une prévision"
                    }
                </h2>

                <form
                    className="planning-form"
                    onSubmit={handleSubmit}
                >

                    <div className="form-row">

                        <div className="form-group">

                            <label>
                                Date de début
                            </label>

                            <input
                                type="date"
                                name="startDate"
                                value={form.startDate}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Date de fin
                            </label>

                            <input
                                type="date"
                                name="endDate"
                                value={form.endDate}
                                onChange={handleChange}
                                required
                            />

                        </div>

                    </div>


                    <div className="form-group">

                        <label>
                            Motif / information
                        </label>

                        <textarea
                            name="reason"
                            value={form.reason}
                            onChange={handleChange}
                            placeholder="Exemple : vacances d'été, déplacement familial..."
                            rows="3"
                        />

                    </div>


                    <div className="planning-actions">

                        <button
                            type="submit"
                            className="btn-primary"
                        >
                            {editingId
                                ? "Modifier"
                                : "Ajouter au planning"
                            }
                        </button>


                        {editingId && (

                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={resetForm}
                            >
                                Annuler
                            </button>

                        )}

                    </div>

                </form>

            </div>


            {/* ================================================= */}
            {/* MES PRÉVISIONS */}
            {/* ================================================= */}

            <div className="planning-card">

                <div className="section-title">

                    <div>

                        <h2>
                            Mes prévisions
                        </h2>

                        <span>
                            Congés envisagés — non officiels
                        </span>

                    </div>

                </div>


                {loading ? (

                    <div className="empty-state">
                        Chargement...
                    </div>

                ) : myPlanning.length === 0 ? (

                    <div className="empty-state">

                        Aucune prévision enregistrée.

                    </div>

                ) : (

                    <div className="planning-list">

                        {myPlanning.map(
                            (planning) => (

                                <div
                                    className="planning-item"
                                    key={planning.id}
                                >

                                    <div>

                                        <strong>
                                            {formatDate(
                                                planning.startDate
                                            )}
                                            {" → "}
                                            {formatDate(
                                                planning.endDate
                                            )}
                                        </strong>

                                        <p>
                                            {planning.reason ||
                                                "Aucun motif indiqué"}
                                        </p>

                                        <span className="planning-status">
                                            Prévision
                                        </span>

                                    </div>


                                    <div className="item-actions">

                                        <button
                                            onClick={() =>
                                                handleEdit(
                                                    planning
                                                )
                                            }
                                            className="btn-edit"
                                        >
                                            Modifier
                                        </button>


                                        <button
                                            onClick={() =>
                                                handleDelete(
                                                    planning.id
                                                )
                                            }
                                            className="btn-delete"
                                        >
                                            Supprimer
                                        </button>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}

            </div>


            {/* ================================================= */}
            {/* ÉQUIPE — CHEF */}
            {/* ================================================= */}

            {isChef && (

                <div className="planning-card">

                    <div className="section-title">

                        <div>

                            <h2>
                                Planning de l'équipe
                            </h2>

                            <span>
                                Vue prévisionnelle du département
                            </span>

                        </div>

                    </div>


                    {teamPlanning.length === 0 ? (

                        <div className="empty-state">

                            Aucune prévision dans l'équipe.

                        </div>

                    ) : (

                        <div className="team-planning-table">

                            <table>

                                <thead>

                                    <tr>

                                        <th>
                                            Employé
                                        </th>

                                        <th>
                                            Début
                                        </th>

                                        <th>
                                            Fin
                                        </th>

                                        <th>
                                            Motif
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {teamPlanning.map(
                                        (planning) => (

                                            <tr
                                                key={
                                                    planning.id
                                                }
                                            >

                                                <td>
                                                    <strong>
                                                        {
                                                            planning.employeeName
                                                        }
                                                    </strong>
                                                </td>

                                                <td>
                                                    {
                                                        formatDate(
                                                            planning.startDate
                                                        )
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        formatDate(
                                                            planning.endDate
                                                        )
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        planning.reason ||
                                                        "-"
                                                    }
                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            )}

        </div>
    );
}


export default PlanningPrevisionnelPage;