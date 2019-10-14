import { ApiError } from "./api-error";

/**
 * Represents HTTP response.
 */
export class HttpResponse {
  httpCode: number;

  constructor(httpCode: number) {
    this.httpCode = 0;
    this.httpCode = httpCode;
  }
}

/**
 * Represents success response with only 1 page.
 */
export class SuccessResponse extends HttpResponse {
  data: object;
  code: number;

  constructor(data: object, code?: number, httpCode = 200) {
    super(httpCode);
    this.data = data;
    this.code = code || httpCode;
  }

  toJSON() {
    return {
      data: Object.assign(this.data, { code: this.code })
    };
  }
}

/**
 * ErrorResponse
 */
export class ErrorResponse extends HttpResponse {
  message: string;
  code: number;

  constructor(message: string, code?: number, httpCode = 500) {
    super(httpCode);
    this.message = message;
    this.code = code || httpCode;
  }

  toJSON() {
    return {
      error: {
        httpCode: this.httpCode,
        message: this.message,
        code: this.code
      }
    };
  }
}

/**
 * Represents bad request (:400) response.
 */
export class BadRequestResponse extends HttpResponse {
  errors: ApiError;
  message: string;
  code: number;

  constructor(errors: ApiError, code?: number) {
    super(400);
    this.message = "Bad Request";
    this.errors = errors;
    this.code = code || 400;
  }

  toJSON() {
    return {
      error: {
        errors: this.errors,
        httpCode: this.httpCode,
        message: this.message,
        code: this.code
      }
    };
  }
}

/**
 * Represents not found (:404) response.
 */
export class NotFoundResponse extends HttpResponse {
  message: string;
  code: number;

  constructor(message: string, code?: number) {
    super(404);
    this.message = "Not Found";
    this.message = message;
    this.code = code || 404;
  }

  toJSON() {
    return {
      error: {
        httpCode: this.httpCode,
        message: this.message,
        code: this.code
      }
    };
  }
}

/**
 * Represents register error response.
 */
export class RegisterErrorResponse extends HttpResponse {
  message: string;
  code: number;

  constructor(message: string, code?: number) {
    super(409); // 409 Conflict
    this.message = message;
    this.code = code || 409;
  }

  toJSON() {
    return {
      error: {
        httpCode: this.httpCode,
        message: this.message,
        code: this.code
      }
    };
  }
}

/**
 * Represents auth (login) error response.
 */
export class AuthErrorResponse extends HttpResponse {
  message: string;
  code: number;

  constructor(message: string, code?: number, httpCode = 400) {
    super(httpCode);
    this.message = "";
    this.message = message;
    this.httpCode = httpCode;
    this.code = code || httpCode;
  }
  static missingAuthToken() {
    return new AuthErrorResponse("Missing authorization token", 401);
  }
  static authRequired() {
    return new AuthErrorResponse("Authorization required", 401);
  }

  toJSON() {
    return {
      error: {
        httpCode: this.httpCode,
        message: this.message,
        code: this.code
      }
    };
  }
}
