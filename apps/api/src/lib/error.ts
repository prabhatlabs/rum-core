type ErrorName = "InternalServerError" | "UnauthorizedUserError" | "ValueError" | "NotFoundError" | "LimitExceeded"

export default class APIErrorResponse extends Error {

    public error: string;
    public code: number;

    constructor(name: ErrorName, error: string, message: string, code: number) {
        super(message)
        this.name = name
        this.error = error
        this.code = code
    }
}