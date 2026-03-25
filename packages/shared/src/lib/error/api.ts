type ErrorName =
    | "InternalServerError"
    | "UnauthorizedUserError"
    | "RateLimitError"
    | "ForbiddenError"
    | "ValidationError"
    | "ValueError"
    | "NotFoundError"
    | "LimitExceeded";

export class APIErrorResponse extends Error {
    public error: string;
    public code: number;

    constructor(name: ErrorName, error: string, message: string, code: number) {
        super(message);
        this.name = name;
        this.error = error;
        this.code = code;
    }
}
