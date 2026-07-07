import type { ApiFieldError } from "@/generated/api/aDOPlatformAPI.schemas";
import { AdoApiError } from "./errors";

export function unwrapAdoResponse<T>(envelope: {
  success?: boolean;
  code?: string;
  message?: string;
  data?: T;
  errors?: ApiFieldError[];
}): T {
  if (envelope.success && envelope.data !== undefined) {
    return envelope.data;
  }

  throw new AdoApiError(
    envelope.code ?? "UNKNOWN",
    envelope.message ?? "요청을 처리하지 못했습니다.",
    (envelope.errors ?? []).map((error) => ({
      field: error.field ?? "",
      message: error.message ?? "",
    })),
  );
}
