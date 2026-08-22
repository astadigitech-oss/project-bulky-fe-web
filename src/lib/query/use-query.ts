import axios, { AxiosError } from "axios";
import { useQuery, UseQueryOptions, QueryKey } from "@tanstack/react-query";

import { buildProxyUrl } from "./utils";
import { QueryParams } from "./types";

type UseApiQueryOptions<T> = Omit<
  UseQueryOptions<T, AxiosError, T, QueryKey>,
  "queryKey" | "queryFn"
>;

export interface UseApiQueryProps<T> extends UseApiQueryOptions<T> {
  key: QueryKey;
  endpoint: string;
  params?: QueryParams;
  searchParams?: Record<
    string,
    string | number | boolean | (string | number | boolean)[] | undefined
  >;
}

export function useApiQuery<T = any>({
  key,
  endpoint,
  params,
  searchParams,
  ...options
}: UseApiQueryProps<T>) {
  const urlWithParams = buildProxyUrl(endpoint, searchParams);

  return useQuery<T, AxiosError>({
    queryKey: key,
    queryFn: async () => {
      // Same-origin proxy call; the httpOnly session cookie is sent
      // automatically by the browser, no Authorization header needed here.
      const res = await axios.get(urlWithParams, { params });
      return res.data as T;
    },
    ...options,
  });
}
