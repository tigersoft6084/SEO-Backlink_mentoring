"use client";

import { useEffect } from 'react';
import Filters from "../../../components/ui/Expired_Filters";
import ExpiredDomainsTable from "../../../components/ui/Expired_Table";
import useExpiredFilterView from "../../../hooks/useExpiredFilterView";
import LoadingExpiredDomains from '../../../components/forms/PreloadExpiredDomain';

export default function ExpiredDomains() {
    const { filters, expiredDomainsData, loading, error, updateFilters, fetchDomains, fetchDomainsOnMount } = useExpiredFilterView();

    // Fetch expired domains when component mounts
    useEffect(() => {
        fetchDomainsOnMount();
    }, [fetchDomainsOnMount]); // Runs only once when the component mounts

    return (
        <div className="flex-1 p-6">
            <Filters
                filters={filters}
                updateFilters={updateFilters}
                onFilter={fetchDomains}
            />
            {/* Show loading animation while data is loading */}
            {loading ? <LoadingExpiredDomains /> : <ExpiredDomainsTable rows={expiredDomainsData} />}

            {/* Show error message if there's an error */}
            {error && <p className="text-center text-red-500">{error}</p>}
        </div>
    );
}
