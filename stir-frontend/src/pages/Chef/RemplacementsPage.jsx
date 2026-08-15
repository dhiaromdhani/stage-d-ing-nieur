import { useEffect, useState } from "react";

import api from "../../services/api";

import {
    getRemplacements,
    createRemplacement,
    updateRemplacement,
    deleteRemplacement
} from "../../services/replacementService";

import "./RemplacementsPage.css";


function RemplacementsPage() {

    const [users, setUsers] = useState([]);

    const [remplacements, setRemplacements] =
        useState([]);

    const [editingId, setEditingId] =
        useState(null);

    const [loading, setLoading] =
        useState(true);


    const [form, setForm] = useState({

        employeeAbsentId: "",

        replacementEmployeeId: "",

        startDate: "",

        endDate: "",

        tasks: ""
    });


    // =========================================================
    // Chargement
    // =========================================================

    const loadData = async () => {

        try {

            setLoading(true);


            const userResponse =
                await api.get("/users");


            const currentEmail =
                localStorage.getItem("email");


            const currentUser =
                userResponse.data.find(
                    user =>
                        user.email === currentEmail
                );


            if (currentUser) {

                const departmentUsers =
                    userResponse.data.filter(
                        user =>
                            user.department ===
                            currentUser.department
                    );

                setUsers(
                    departmentUsers.filter(
                        user =>
                            user.role?.name !==
                            "ROLE_CHEF"
                    )
                );
            }


            const data =
                await getRemplacements();


            setRemplacements(data);


        } catch (error) {

            console.error(error);

            alert(
                "Impossible de charger les données."
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


        if (
            form.employeeAbsentId ===
            form.replacementEmployeeId
        ) {

            alert(
                "L'employé absent et le remplaçant doivent être différents."
            );

            return;
        }


        try {

            if (editingId) {

                await updateRemplacement(
                    editingId,
                    form
                );

            } else {

                await createRemplacement(
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
                "Erreur lors de l'opération."
            );
        }
    };


    // =========================================================
    // Edit
    // =========================================================

    const handleEdit = (item) => {

        setEditingId(item.id);

        setForm({

            employeeAbsentId:
                item.employeeAbsentId,

            replacementEmployeeId:
                item.replacementEmployeeId,

            startDate:
                item.startDate,

            endDate:
                item.endDate,

            tasks:
                item.tasks || ""
        });


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };


    // =========================================================
    // Delete
    // =========================================================

    const handleDelete = async (id) => {

        if (
            !window.confirm(
                "Supprimer ce remplacement ?"
            )
        ) {
            return;
        }


        try {

            await deleteRemplacement(id);

            await loadData();

        } catch (error) {

            console.error(error);

            alert(
                "Impossible de supprimer."
            );
        }
    };


    // =========================================================
    // Reset
    // =========================================================

    const resetForm = () => {

        setEditingId(null);

        setForm({

            employeeAbsentId: "",

            replacementEmployeeId: "",

            startDate: "",

            endDate: "",

            tasks: ""
        });
    };


    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        return new Date(date)
            .toLocaleDateString("fr-FR");
    };


    return (

        <div className="remplacements-page">

            <div className="remplacements-header">

                <div>

                    <h1>
                        Gestion des remplacements
                    </h1>

                    <p>
                        Organisez la continuité des tâches
                        pendant les absences des employés.
                    </p>

                </div>

            </div>


            {/* ================================================= */}
            {/* FORM */}
            {/* ================================================= */}

            <div className="remplacement-card">

                <h2>

                    {editingId
                        ? "Modifier un remplacement"
                        : "Planifier un remplacement"
                    }

                </h2>


                <form
                    onSubmit={handleSubmit}
                    className="remplacement-form"
                >

                    <div className="form-row">

                        <div className="form-group">

                            <label>
                                Employé absent
                            </label>

                            <select
                                name="employeeAbsentId"
                                value={
                                    form.employeeAbsentId
                                }
                                onChange={handleChange}
                                required
                            >

                                <option value="">
                                    Sélectionner
                                </option>

                                {users.map(
                                    user => (

                                        <option
                                            key={user.id}
                                            value={user.id}
                                        >

                                            {user.firstName}
                                            {" "}
                                            {user.lastName}

                                        </option>
                                    )
                                )}

                            </select>

                        </div>


                        <div className="form-group">

                            <label>
                                Employé remplaçant
                            </label>

                            <select
                                name="replacementEmployeeId"
                                value={
                                    form.replacementEmployeeId
                                }
                                onChange={handleChange}
                                required
                            >

                                <option value="">
                                    Sélectionner
                                </option>

                                {users.map(
                                    user => (

                                        <option
                                            key={user.id}
                                            value={user.id}
                                        >

                                            {user.firstName}
                                            {" "}
                                            {user.lastName}

                                        </option>
                                    )
                                )}

                            </select>

                        </div>

                    </div>


                    <div className="form-row">

                        <div className="form-group">

                            <label>
                                Début
                            </label>

                            <input
                                type="date"
                                name="startDate"
                                value={
                                    form.startDate
                                }
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Fin
                            </label>

                            <input
                                type="date"
                                name="endDate"
                                value={
                                    form.endDate
                                }
                                onChange={handleChange}
                                required
                            />

                        </div>

                    </div>


                    <div className="form-group">

                        <label>
                            Tâches couvertes
                        </label>

                        <textarea
                            name="tasks"
                            value={form.tasks}
                            onChange={handleChange}
                            rows="4"
                            placeholder="Exemple : suivi des demandes, traitement des emails, contrôle quotidien..."
                            required
                        />

                    </div>


                    <div className="form-actions">

                        <button
                            type="submit"
                            className="btn-primary"
                        >

                            {editingId
                                ? "Modifier"
                                : "Créer le remplacement"
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
            {/* LIST */}
            {/* ================================================= */}

            <div className="remplacement-card">

                <h2>
                    Remplacements de l'équipe
                </h2>


                {loading ? (

                    <div className="empty-state">
                        Chargement...
                    </div>

                ) : remplacements.length === 0 ? (

                    <div className="empty-state">

                        Aucun remplacement planifié.

                    </div>

                ) : (

                    <div className="remplacement-list">

                        {remplacements.map(
                            item => (

                                <div
                                    className="remplacement-item"
                                    key={item.id}
                                >

                                    <div className="replacement-info">

                                        <div className="replacement-title">

                                            <strong>
                                                {
                                                    item.employeeAbsentName
                                                }
                                            </strong>

                                            <span>
                                                →
                                            </span>

                                            <strong>
                                                {
                                                    item.replacementEmployeeName
                                                }
                                            </strong>

                                        </div>


                                        <div className="replacement-date">

                                            {formatDate(
                                                item.startDate
                                            )}

                                            {" → "}

                                            {formatDate(
                                                item.endDate
                                            )}

                                        </div>


                                        <p>

                                            <strong>
                                                Tâches :
                                            </strong>

                                            {" "}

                                            {item.tasks}

                                        </p>

                                    </div>


                                    <div className="replacement-actions">

                                        <button
                                            className="btn-edit"
                                            onClick={() =>
                                                handleEdit(item)
                                            }
                                        >
                                            Modifier
                                        </button>


                                        <button
                                            className="btn-delete"
                                            onClick={() =>
                                                handleDelete(
                                                    item.id
                                                )
                                            }
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

        </div>
    );
}


export default RemplacementsPage;