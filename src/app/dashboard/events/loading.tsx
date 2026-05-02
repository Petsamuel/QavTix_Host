import MetricsContainerLoader from "@/components/loaders/MetricsContainerLoader";
import TableLoader from "@/components/loaders/TableLoader";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingEventsPage() {
    return (
        <div>
            <MetricsContainerLoader />

            <div className="grid grid-cols-1 md:grid-cols-[1fr_22em] gap-6 mt-10">
                <div className="space-y-6">
                    <MetricsContainerLoader />
                    <Skeleton className="rounded-2xl w-full h-100 bg-[#E0E0E0] overflow-hidden" />
                </div>

                <div className="flex flex-col gap-6">
                    <Skeleton className="rounded-2xl w-full h-70 bg-[#E0E0E0] overflow-hidden" />
                    <Skeleton className="rounded-2xl w-full h-70 bg-[#E0E0E0] overflow-hidden" />
                </div>
            </div>
            <TableLoader />
        </div>
    )
}