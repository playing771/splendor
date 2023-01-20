import { AxiosError } from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ILoginDTO } from '../../../../interfaces/api';
import { Nullable } from '../../../../utils/typescript';
import { Api } from '../../Api';

import cn from 'classnames';

import styles from './style.module.css';
import { useAuth } from '../../AuthProvider/context';

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState<Nullable<string>>(null);
  const navigate = useNavigate()
  const { update } = useAuth()

  const handleChange = (e: any) => {
    setUsername(e.target.value);
  };

  const handleLogin = async () => {
    if (!username) return

    try {

      const response = await Api.post<ILoginDTO>(`auth/login`, { username });
      await update();
      console.log('login response', response);

      navigate('/rooms');
    } catch (error) {
      const axiosError = error as AxiosError;
      setError(axiosError.message);
    }

  }

  return (
    <div
      className={cn(styles.Container)}
      style={{
        maxWidth: 800,
        margin: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <label>
        Name:
        <input
          onChange={handleChange}
          placeholder="Enter your name"
          value={username}
        />
      </label>
      <button onClick={handleLogin}>Login</button>
      {error && <h3>{error}</h3>}
    </div>
  );
}
