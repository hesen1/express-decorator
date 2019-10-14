/**
 * Describes API error.
 */
export class ApiError {
  domain: string;
  reason: string;
  message: string;

  constructor(reason: string, message: string) {
    this.domain = "ErrorDomain";
    this.reason = reason;
    this.message = message;
  }
}
