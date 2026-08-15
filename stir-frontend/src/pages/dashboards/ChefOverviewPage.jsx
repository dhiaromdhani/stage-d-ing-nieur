import RoleOverviewPage from "./RoleOverviewPage";

export default function ChefOverviewPage() {
    return (
        <RoleOverviewPage
            status="PENDING_CHEF"
            roleLabel="Chef de service"
            validationPath="/chef/validation-conges"
        />
    );
}