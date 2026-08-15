import { LeaveDashboard } from "./ChefDashboard";

export default function DirecteurValidationCongesPage() {
    return (
        <LeaveDashboard
            status="PENDING_DIRECTEUR"
            title="Validation des congés — Directeur"
            role="Directeur"
        />
    );
}