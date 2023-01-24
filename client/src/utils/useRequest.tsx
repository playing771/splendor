import { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Api } from "../Api";

export const useRequest = <D,>(url: string) => {
  const [data, setData] = useState<D>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const navigate = useNavigate();

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

      if (axiosError.response?.status === 401){ 
        navigate('/login')
      }

      setError(axiosError.message);
    }
    finally {
      setIsLoading(false);
    }
  },[url, navigate])

  useEffect(() => {
    request()
  }, [url]);

  return { data, isLoading, error, refetch }
}