import MetricsContainerLoader from "@/components/loaders/MetricsContainerLoader";
import TableLoader from "@/components/loaders/TableLoader";
import WithdrawalFormLoader from "@/components/loaders/WithdrawalFormLoader";

export default function FinancialPageLoader() {
    return (
        <div>
            <MetricsContainerLoader />
            
            <div className="grid grid-cols-1 md:grid-cols-[22em_1fr] gap-6 mt-10">
                <WithdrawalFormLoader />
                <TableLoader />
            </div>
        </div>
    )
}