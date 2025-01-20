import { Payload, Where, WhereField } from "payload";
import { COLLECTION_NAME_BACKLINK } from "@/global/strings.ts";
import { ErrorHandler } from "@/handlers/errorHandler.ts";
import { ExpiredDomainData } from "@/types/backlink.ts";

export const fetchExpiredDomainsService = async (
    payload: Payload,
    req: {
        query: {
            limit?: string;
            page?: string;
            minTF?: string;
            maxTF?: string;
            minCF?: string;
            maxCF?: string;
            minRD?: string;
            maxRD?: string;
            minRefIps?: string;
            maxRefIps?: string;
            minRefEdu?: string;
            maxRefEdu?: string;
            minRefGov?: string;
            maxRefGov?: string;
            TTF?: string;
            Domain?: string;
            Language?: string;
        };
    }
): Promise<ExpiredDomainData[] | Response> => {
    const limit = Math.max(parseInt(req.query.limit || "25", 10), 1);
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const currentTime = new Date().toISOString();

    const parseNumeric = (value?: string): number | undefined => {
        const num = parseInt(value || '', 10);
        return isNaN(num) ? undefined : num;
    };

    // Initialize the `where` condition
    const where: Where = {
        and: [
            { Expiry_Date: { less_than: currentTime } }, // Only expired domains
        ],
    };

    // Add numeric filters for TF, CF, RD
    if (req.query.minTF || req.query.maxTF) {
        const tfCondition: WhereField = {};
        const minTF = parseNumeric(req.query.minTF);
        const maxTF = parseNumeric(req.query.maxTF);
        if (minTF !== undefined) tfCondition.greater_than_equal = minTF;
        if (maxTF !== undefined) tfCondition.less_than_equal = maxTF;
        where.and?.push({ TF: tfCondition });
    }


    if (req.query.minCF || req.query.maxCF) {
        const cfCondition: WhereField = {};
        if (req.query.minCF) cfCondition.greater_than_equal = parseInt(req.query.minCF, 10);
        if (req.query.maxCF) cfCondition.less_than_equal = parseInt(req.query.maxCF, 10);
        where.and?.push({ CF: cfCondition });
    }

    if (req.query.minRD || req.query.maxRD) {
        const rdCondition: WhereField = {};
        if (req.query.minRD) rdCondition.greater_than_equal = parseInt(req.query.minRD, 10);
        if (req.query.maxRD) rdCondition.less_than_equal = parseInt(req.query.maxRD, 10);
        where.and?.push({ RD: rdCondition });
    }

    // Add numeric filters for Ref_Ips, Ref_Edu, Ref_Gov
    if (req.query.minRefIps || req.query.maxRefIps) {
        const refIpsCondition: WhereField = {};
        if (req.query.minRefIps) refIpsCondition.greater_than_equal = parseInt(req.query.minRefIps, 10);
        if (req.query.maxRefIps) refIpsCondition.less_than_equal = parseInt(req.query.maxRefIps, 10);
        where.and?.push({ Ref_Ips: refIpsCondition });
    }

    if (req.query.minRefEdu || req.query.maxRefEdu) {
        const refEduCondition: WhereField = {};
        if (req.query.minRefEdu) refEduCondition.greater_than_equal = parseInt(req.query.minRefEdu, 10);
        if (req.query.maxRefEdu) refEduCondition.less_than_equal = parseInt(req.query.maxRefEdu, 10);
        where.and?.push({ Ref_Edu: refEduCondition });
    }

    if (req.query.minRefGov || req.query.maxRefGov) {
        const refGovCondition: WhereField = {};
        if (req.query.minRefGov) refGovCondition.greater_than_equal = parseInt(req.query.minRefGov, 10);
        if (req.query.maxRefGov) refGovCondition.less_than_equal = parseInt(req.query.maxRefGov, 10);
        where.and?.push({ Ref_Gov: refGovCondition });
    }

    // Add exact match filters
    if (req.query.TTF) where.and?.push({ TTF: { equals: req.query.TTF } });
    if (req.query.Domain) where.and?.push({ Domain: { equals: req.query.Domain } });
    if (req.query.Language) where.and?.push({ Language: { equals: req.query.Language } });

    try {
        console.log("Constructed Where Clause:", JSON.stringify(where, null, 2)); // Debugging

        const result = await payload.find({
            collection: COLLECTION_NAME_BACKLINK,
            where,
            limit,
            page,
        });

        if (result.docs.length === 0) return [];

        return result.docs.map((item) => ({
            Domain: item.Domain,
            TF: item.TF ?? 0,
            CF: item.CF ?? 0,
            RD: item.RD ?? 0,
            TTF: item.TTF ?? null,
            Ref_Ips: item.Ref_Ips ?? 0,
            Ref_Edu: item.Ref_Edu ?? 0,
            Ref_Gov: item.Ref_Gov ?? 0,
            Language: item.Language ?? null,
        }));
    } catch (error) {
        const { errorDetails, status } = ErrorHandler.handle(error, "Error fetching expired domains");
        return new Response(JSON.stringify(errorDetails), {
            status,
            headers: { "Content-Type": "application/json" },
        });
    }
};
