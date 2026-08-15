import RoleOverviewPage from "./RoleOverviewPage";

export default function DirecteurOverviewPage() {
    return (
        <RoleOverviewPage
            status="PENDING_DIRECTEUR"
            roleLabel="Directeur"
            validationPath="/directeur/validation-conges"
        />
    );
}