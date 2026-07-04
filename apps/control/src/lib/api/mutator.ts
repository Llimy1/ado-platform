const baseUrl = process.env.NEXT_PUBLIC_ADO_API_ORIGIN ?? "http://localhost:8080";

/**
 * orval's "fetch" client passes every request through this function and
 * expects `{ data, status, headers }` back, regardless of HTTP status —
 * it never throws. Unwrapping the ApiResponse<T> envelope (success/failure)
 * happens one layer up, in the domain client (e.g. projectClient.ts), since
 * this mutator has no knowledge of any single endpoint's business meaning.
 */
export async function adoFetch<T>(url: string, options: RequestInit): Promise<T> {
  const response = await fetch(`${baseUrl}${url}`, options);
  const data = await response.json();
  return { data, status: response.status, headers: response.headers } as T;
}
