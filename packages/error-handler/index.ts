export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;
    public readonly details?: any;

    constructor(message:string, statusCode:number, isOperational = true, details?: any)
    {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.details = details;
        Error.captureStackTrace(this);
    }
}


// Not found error
export class NotFoundError extends AppError{
    constructor(message = "Ressources not found") {
        super(message, 404);
    }
}

// Valiudation Error (use for Joi/zod/react-hook-form validation errors)

export class ValidationError extends AppError {
    constructor(message = "Invalid request data", details?: any) {
        super(message, 400, true,details);
    }
}

// Authentication Error
export class AuthError extends AppError {
    constructor(message = "Unauthorized") {
        super(message, 401);
    }
}

// Forbidden Error (For Insufficient Premissions)
export class ForbiddenError extends AppError {
    constructor(message = "Forbidden access"){
        super(message, 403);
    }
}

// Database Error (For MongoDB/Postgres Error)
export class DatabaseError extends AppError {
    constructor(message = "Database error", details?: any) {
        super(message, 500, true, details);
    }
}

// Ratelimiting Error

export class RatelimitError extends AppError {
    constructor(message = "Too many request, please try again later") {
        super(message, 429);
    }
}