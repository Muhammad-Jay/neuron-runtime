// apps/frontend/app/(root)/dashboard/schedules/page.tsx
'use client';

import { MaintenanceState } from '@/components/maintenance/Maintenance';

export default function SchedulesPage() {
    // Keeping the logic dormant for now
    const isUnderConstruction = true;

    if (isUnderConstruction) {
        return (
            <MaintenanceState
                title="Temporal Engine"
                description="The scheduling orchestration layer is currently undergoing internal calibration. Check back soon for automated deployment capabilities."
            />
        );
    }

    return (
        <div>
            {/* Your full schedule code from before goes here */}
        </div>
    );
}