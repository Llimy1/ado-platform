/** Error codes defined by GlobalExceptionHandler / ErrorCode in apps/api. */
export const KNOWN_ADO_ERROR_CODES = [
  "VALIDATION_FAILED",
  "PROJECT_NOT_FOUND",
  "PROJECT_KEY_ALREADY_EXISTS",
  "ROADMAP_NOT_FOUND",
  "JOB_KEY_ALREADY_EXISTS",
  "JOB_NOT_FOUND",
  "JOB_ATTEMPT_NOT_FOUND",
  "ARTIFACT_NOT_FOUND",
  "INVALID_JOB_STATUS_TRANSITION",
] as const;

export type KnownAdoErrorCode = (typeof KNOWN_ADO_ERROR_CODES)[number];

export interface AdoApiFieldError {
  field: string;
  message: string;
}

export class AdoApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly fieldErrors: AdoApiFieldError[] = [],
  ) {
    super(message);
    this.name = "AdoApiError";
  }
}
