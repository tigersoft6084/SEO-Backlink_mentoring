"use client";

import { useEffect } from 'react';
import Lottie from "lottie-react";
import Filters from "../../../components/ui/Expired_Filters";
import ExpiredDomainsTable from "../../../components/ui/Expired_Table";
import useExpiredFilterView from "../../../hooks/useExpiredFilterView";
import LoadingExpiredDomains from '../../../components/forms/PreloadExpiredDomain';
import emptyAnimation from '../../../../public/lottie/noResultsFound.json';

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
            {loading ? (
                <LoadingExpiredDomains />
            ) : expiredDomainsData.length === 0 ? (
                // ✅ Show empty animation when no expired domains exist
                <div className="flex flex-col items-center justify-center h-96">
                    <Lottie animationData={emptyAnimation} className="w-80 h-80" />
                    <p className="text-gray-500 dark:text-gray-300 text-lg font-semibold mt-4">
                        No expired domains found. Try adjusting your filters!
                    </p>
                </div>
            ) : (
                <ExpiredDomainsTable rows={expiredDomainsData} />
            )}
            {/* Show error message if there's an error */}
            {error && <p className="text-center text-red-500">{error}</p>}
        </div>
    );
}
