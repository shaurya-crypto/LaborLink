export class ApiResponse<T> {
  public success: boolean;
  public message: string;
  public data: T | null;
  public meta?: any;
  public errors?: any;

  constructor(success: boolean, message: string, data: T | null = null, meta?: any, errors?: any) {
    this.success = success;
    this.message = message;
    this.data = data;
    if (meta) this.meta = meta;
    if (errors) this.errors = errors;
  }

  static success<T>(message: string, data: T | null = null, meta?: any) {
    return new ApiResponse(true, message, data, meta);
  }

  static error(message: string, errors?: any) {
    return new ApiResponse(false, message, null, undefined, errors);
  }
}
