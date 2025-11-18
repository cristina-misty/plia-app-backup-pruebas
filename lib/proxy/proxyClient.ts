import axios, { AxiosRequestConfig, Method } from "axios";

export async function proxyCall<
  TResponse = unknown,
  TBody = Record<string, unknown>
>(
  endpoint: string,
  method: Method = "POST",
  body?: TBody,
  config?: AxiosRequestConfig
): Promise<TResponse> {
  const res = await axios.post<TResponse>(
    "/api/proxy",
    { endpoint, method, body },
    config
  );

  return res.data;
}
