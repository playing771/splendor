import { ChangeEventHandler, SyntheticEvent, useState } from 'react';
import { BrowserRouter, Route, Navigate, Routes } from 'react-router-dom';
import { Nullable } from '../../utils/typescript';
import { GlobalStateProvider } from './context';
import { GamePage } from './pages/GamePage';
import { LoginPage } from './pages/LoginPage';
import { RoomPage } from './pages/RoomPage';


function App() {
  return (
    <GlobalStateProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/room" element={<RoomPage />} />
          <Route path="/game" element={<GamePage />} />
        </Routes>
      </BrowserRouter>
    </GlobalStateProvider>
  );
}

export default App;
