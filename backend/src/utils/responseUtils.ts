/**
     * Enhanced error handler that provides detailed insights into possible issues.
     * @param error The error object caught during execution.
     * @param context Optional context to describe where the error occurred.
     * @returns A Response object with a detailed error message and appropriate status code.
 */
export const handleErrorResponse = (error: Error, context: string = 'Unknown'): Response => {

    const { statusCode, possibleCauses } = determineErrorStatusAndCauses(error);

    const errorDetails = {
        message: 'An error occurred during the process.',
        context,
        errorType: error.name || 'UnknownError',
        errorMessage: error.message || 'No error message available.',
        stackTrace: error.stack || 'No stack trace available.',
        possibleCauses,
        timestamp: new Date().toISOString(),
    };

    return new Response(JSON.stringify(errorDetails), {
        status: statusCode,
        headers: { 'Content-Type': 'application/json' },
    });
};

/**
 * Determines the appropriate HTTP status code and potential causes based on the error.
 * @param error The error object.
 * @returns An object containing the status code and an array of possible causes.
 */
const determineErrorStatusAndCauses = (error : Error): { statusCode: number; possibleCauses: string[] } => {

    let statusCode = 500; // Default to Internal Server Error
    const causes: string[] = [];

    if (error.message?.includes('Invalid data')) {
        statusCode = 400; // Bad Request
        causes.push('The data fetched from the external service may be malformed or incomplete.');
        causes.push('Ensure the external service is returning valid data.');
    } else if (error.message?.includes('NetworkError')) {
        statusCode = 503; // Service Unavailable
        causes.push('There may be a network issue preventing data fetching.');
        causes.push('Check internet connectivity or the availability of the external API.');
    } else if (error.message?.includes('PayloadError')) {
        statusCode = 422; // Unprocessable Entity
        causes.push('An issue occurred while interacting with the Payload CMS.');
        causes.push('Verify the collection schema and ensure the API is accessible.');
    } else if (error.stack?.includes('SyntaxError')) {
        statusCode = 500; // Internal Server Error
        causes.push('The response data might not be in the expected format (e.g., JSON).');
        causes.push('Check the API response structure for inconsistencies.');
    } else if (error.message?.includes('AuthorizationError')) {
        statusCode = 401; // Unauthorized
        causes.push('User authentication failed. Verify credentials or access token.');
        causes.push('Ensure the user has the correct permissions for this action.');
    } else if (error.message?.includes('NotFoundError')) {
        statusCode = 404; // Not Found
        causes.push('The requested resource was not found.');
        causes.push('Check the resource identifier or URL.');
    } else {
        causes.push('The issue is unknown; further debugging may be required.');
    }

    return { statusCode, possibleCauses: causes };
};

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
