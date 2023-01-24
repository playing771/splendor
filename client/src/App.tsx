import { BrowserRouter, Route, Navigate, Routes } from 'react-router-dom';

import { GamePage } from './pages/GamePage';
import { LoginPage } from './pages/LoginPage';
import { RoomPage } from './pages/RoomPage';
import Modal from 'react-modal';
import { Toaster } from 'react-hot-toast';
import { RoomsPage } from './pages/RoomsPage';
import { AuthProvider } from './AuthProvider';

Modal.setAppElement('#root');

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster />
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/rooms/:roomId" element={<RoomPage />} />
          <Route path="/games/:gameId" element={<GamePage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
