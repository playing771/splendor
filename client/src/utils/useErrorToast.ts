import { AxiosError } from 'axios';
import React, { useCallback } from 'react';
import { toast } from 'react-hot-toast';



export const useErrorToast = () => {
  const toastError = useCallback((axiosError: AxiosError<string>)=>{
    const text = axiosError.response?.data ? axiosError.response?.data : axiosError.message;
    toast(text, { style: { backgroundColor: '#c12e35', color: 'white' }, duration: 3000 });
  },[])

  return toastError;
};
