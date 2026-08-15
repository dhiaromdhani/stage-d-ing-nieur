import RoleOverviewPage from "./RoleOverviewPage";

export default function SousDirecteurOverviewPage() {
    return (
        <RoleOverviewPage
            status="PENDING_SOUS_DIRECTEUR"
            roleLabel="Sous-directeur"
            validationPath="/sous-directeur/validation-conges"
        />
    );
}