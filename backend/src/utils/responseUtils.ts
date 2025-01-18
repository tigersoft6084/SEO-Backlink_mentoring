export const handleNoDataResponse = (marketPlaceName : string): Response => {

    return new Response(
        JSON.stringify({
            message: `No backlink data was fetched from ${marketPlaceName}.`,
        }),
        {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
        }
    );
};

export const handleSuccessResponse = (data: unknown, marketPlaceName : string): Response => {

    return new Response(
        JSON.stringify({
            message: `Backlink data was successfully fetched from ${marketPlaceName}`,
            results: data,
        }),
        {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        }
    );
};
