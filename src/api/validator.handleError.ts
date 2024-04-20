interface ValidatorHandleErrorOptions {
    field: string;
    message: string;
}

export class ValidatorHandleError extends Error {
    field: string;
    message: string;

    constructor({ field, message }: ValidatorHandleErrorOptions) {
        super(message);
        this.field = field;
        this.message = message;
    }
}