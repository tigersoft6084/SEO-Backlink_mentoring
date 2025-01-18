type ErrorDetails = {
    message: string;
    context: string;
    type: string;
    causes: string[];
    timestamp: string;
    stack?: string;
    };

type ErrorStatus = {
    status: number;
    causes: string[];
};