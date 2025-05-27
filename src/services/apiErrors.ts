export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly backendMessage: string;

  constructor(message: string, statusCode: number, backendMessage?: string) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.backendMessage = backendMessage || message; 

    Object.setPrototypeOf(this, ApiError.prototype);
  }
} 