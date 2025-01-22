import { Payload, Where, WhereField } from "payload";
import { COLLECTION_NAME_BACKLINK } from "@/globals/strings.ts";
import { ErrorHandler } from "@/handlers/errorHandler.ts";
import { ExpiredDomainData } from "@/types/backlink.ts";

export const fetchExpiredDomainsService = async (
    payload: Payload,
    req: {
        query: {
            limit?: string;
            page?: string;
            minTF?: number;
            maxTF?: number;
            minCF?: number;
            maxCF?: number;
            minRD?: number;
            maxRD?: number;
            minRefIps?: number;
            maxRefIps?: number;
            minRefEdu?: number;
            maxRefEdu?: number;
            minRefGov?: number;
            maxRefGov?: number;
            TTF?: string;
            Domain?: string;
            Language?: string;
        };
    }
): Promise< { totalExpiredDomains : number, expiredDomains : ExpiredDomainData[] } | Response> => {
    const limit = Math.max(parseInt(req.query.limit || "10", 10), 1);
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const currentTime = new Date().toISOString();

    // Initialize the `where` condition
    const where: Where = {
        and: [
            { expiry_date: { less_than: currentTime } }, // Only expired domains
        ],
    };

    // Add numeric filters for TF, CF, RD
    if (req.query.minTF || req.query.maxTF) {
        const tfCondition: WhereField = {};
        const minTF = req.query.minTF;
        const maxTF = req.query.maxTF;
        if (minTF !== undefined) tfCondition.greater_than_equal = minTF;
        if (maxTF !== undefined) tfCondition.less_than_equal = maxTF;
        where.and?.push({ tf: tfCondition });
    }


    if (req.query.minCF || req.query.maxCF) {
        const cfCondition: WhereField = {};
        if (req.query.minCF) cfCondition.greater_than_equal = req.query.minCF;
        if (req.query.maxCF) cfCondition.less_than_equal = req.query.maxCF;
        where.and?.push({ cf: cfCondition });
    }

    if (req.query.minRD || req.query.maxRD) {
        const rdCondition: WhereField = {};
        if (req.query.minRD) rdCondition.greater_than_equal = req.query.minRD;
        if (req.query.maxRD) rdCondition.less_than_equal = req.query.maxRD;
        where.and?.push({ rd: rdCondition });
    }

    // Add numeric filters for Ref_Ips, Ref_Edu, Ref_Gov
    if (req.query.minRefIps || req.query.maxRefIps) {
        const refIpsCondition: WhereField = {};
        if (req.query.minRefIps) refIpsCondition.greater_than_equal = req.query.minRefIps;
        if (req.query.maxRefIps) refIpsCondition.less_than_equal = req.query.maxRefIps;
        where.and?.push({ ref_ips: refIpsCondition });
    }

    if (req.query.minRefEdu || req.query.maxRefEdu) {
        const refEduCondition: WhereField = {};
        if (req.query.minRefEdu) refEduCondition.greater_than_equal = req.query.minRefEdu;
        if (req.query.maxRefEdu) refEduCondition.less_than_equal = req.query.maxRefEdu;
        where.and?.push({ ref_edu: refEduCondition });
    }

    if (req.query.minRefGov || req.query.maxRefGov) {
        const refGovCondition: WhereField = {};
        if (req.query.minRefGov) refGovCondition.greater_than_equal = req.query.minRefGov;
        if (req.query.maxRefGov) refGovCondition.less_than_equal = req.query.maxRefGov;
        where.and?.push({ ref_gov: refGovCondition });
    }

    // Add exact match filters
    if (req.query.TTF) where.and?.push({ ttf: { equals: req.query.TTF } });
    if (req.query.Domain) where.and?.push({ domain: { equals: req.query.Domain } });
    if (req.query.Language) where.and?.push({ language: { equals: req.query.Language } });

    try {
        console.log("Constructed Where Clause:", JSON.stringify(where, null, 2)); // Debugging

        // Fetch the total count of expired domains (without pagination or other filters)
        const totalExpiredDomainsResponse  = await payload.count({
            collection: COLLECTION_NAME_BACKLINK,
            where: {
                and: [
                    { expiry_date: { less_than: currentTime } }, // Only expired domains
                ],
            },
        });

        const totalExpiredDomains = totalExpiredDomainsResponse.totalDocs;

        const result = await payload.find({
            collection: COLLECTION_NAME_BACKLINK,
            where,
            limit,
            page,
        });

        if (result.docs.length === 0) return { totalExpiredDomains, expiredDomains: [] };

        // Map the results to match the expected format
        const expiredDomains = result.docs.map((item) => ({
            domain: item.domain,
            tf: item.tf ?? 0,
            cf: item.cf ?? 0,
            rd: item.rd ?? 0,
            ttf: item.ttf ?? null,
            ref_ips: item.ref_ips ?? 0,
            ref_edu: item.ref_edu ?? 0,
            ref_gov: item.ref_gov ?? 0,
            language: item.language ?? null,
        }));

        // const filteredDomains = expiredDomains.filter((domain) => domain.CF !== 0);
        return { totalExpiredDomains, expiredDomains};
    } catch (error) {
        const { errorDetails, status } = ErrorHandler.handle(error, "Error fetching expired domains");
        return new Response(JSON.stringify(errorDetails), {
            status,
            headers: { "Content-Type": "application/json" },
        });
    }
};
