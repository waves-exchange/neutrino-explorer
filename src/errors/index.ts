import { Middleware } from 'koa';
import { pick } from 'ramda';

export abstract class ServerError extends Error {
    public readonly code: number;
    public readonly message: string;
    public readonly details?: string;

    protected constructor(code: number, message: string, details?: string) {
        super(message);
        this.code = code;
        this.message = message;
        this.details = details;

        Object.setPrototypeOf(this, ServerError.prototype);
    }
}

export class AuthError extends ServerError {
    constructor(details?: string) {
        super(401, 'Unauthorized', details);
    }
}

export class NotFound extends ServerError {
    constructor() {
        super(404, 'NotFound');
    }
}

export class InternalError extends ServerError {
    constructor(details?: string) {
        super(500, details ?? 'InternalServerError');
    }
}

export class BadRequest extends ServerError {
    constructor(details?: string) {
        super(400, 'BadRequest', details);
    }
}

export class PermissionDenied extends ServerError {
    constructor(details?: string) {
        super(403, 'PermissionDenied', details);
    }
}

export const applyErrorM: Middleware = (ctx, next) =>
    next()
        .catch((error) => {
            const errorInstance = error instanceof ServerError
                ? error
                : new InternalError(error.message);

            const method = errorInstance.code === 500
                ? 'error'
                : 'warn';

            ctx.status = errorInstance.code;
            ctx.body = {
                type: 'error',
                ...pick(['message', 'details'], errorInstance)
            };
            console[method](`Error: ${errorInstance.code}, ${errorInstance.message}. Details: ${errorInstance.details}`);
            if (method === 'error') {
                console[method](error.stack || errorInstance.stack);
            }
        });

