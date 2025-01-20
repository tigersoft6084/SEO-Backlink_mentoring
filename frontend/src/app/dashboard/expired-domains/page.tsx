"use client";

import Filters from "../../../components/ui/Expired_Filters";
// import ExpiredDomainsTable from "../../../components/ui/Expired_Table";
import useExpiredFilterView from "../../../hooks/useExpiredFilterView";

// import DomainsTable from "./DomainsTable";

export default function ExpiredDomains() {
    const { filters, expiredDomainsData, loading, error, updateFilters, fetchDomains } = useExpiredFilterView();

    return (
        <div className="flex-1 p-6">
            <Filters
                filters={filters}
                updateFilters={updateFilters}
                onFilter={fetchDomains}
            />
            {loading && <p className="text-center">Loading...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}
            {/* <ExpiredDomainsTable rows={expiredDomainsData} /> */}
        </div>
    );
}
