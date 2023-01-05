import { AxiosError } from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ILoginDTO } from '../../../../interfaces/api';
import { Nullable } from '../../../../utils/typescript';
import { Api } from '../../Api';
import { useGlobalState } from '../../context';

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState<Nullable<string>>(null);
  const { setUserState } = useGlobalState()
  const navigate = useNavigate()

  const handleChange = (e: any) => {
    setUsername(e.target.value);
  };

  const handleLogin = async () => {
    if (!username) return

    try {

      const response = await Api.post<ILoginDTO>(`auth/login/${username}`);
      console.log('login response',response);
      
      setUserState({ username: response.data.name, userId: response.data.id })

      navigate('/room');
    } catch (error) {
      const axiosError = error as AxiosError;
      setError(axiosError.message);
    }

  }

  return (
    <div
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
