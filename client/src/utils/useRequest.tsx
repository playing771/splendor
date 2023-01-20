import { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { Api } from "../Api";

export const useRequest = <D,>(url: string) => {
  const [data, setData] = useState<D>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const refetch = useCallback(() => {
    return request()
  }, [url])

  const request = useCallback(async ()=> {
    try {
      setIsLoading(true);
      const response = await Api.get<D>(url);
      setData(response.data);
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      setError(axiosError.message);
    }
    finally {
      setIsLoading(false);
    }
  },[url])

  useEffect(() => {
    request()
  }, [url]);

  return { data, isLoading, error, refetch }
}