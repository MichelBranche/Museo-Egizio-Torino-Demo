import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AudioProvider } from './context/AudioContext';
import { CartProvider } from './context/CartContext';
import { LanguageProvider } from './context/LanguageContext';
import { RouteHistorySync } from './routeHistory';
import HomePage from './pages/HomePage';
import AcquistaBigliettiPage from './pages/AcquistaBigliettiPage';
import ShopPage from './pages/ShopPage';
import VisitaPage from './pages/VisitaPage';
import RicercaPage from './pages/RicercaPage';
import NotiziePage from './pages/NotiziePage';
import IlMuseoPage from './pages/IlMuseoPage';

const App = () => (
  <BrowserRouter>
    <AudioProvider>
      <CartProvider>
        <LanguageProvider>
          <RouteHistorySync />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/biglietti" element={<AcquistaBigliettiPage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/visita" element={<VisitaPage />} />
            <Route path="/ricerca" element={<RicercaPage />} />
            <Route path="/notizie" element={<NotiziePage />} />
            <Route path="/il-museo" element={<IlMuseoPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </LanguageProvider>
      </CartProvider>
    </AudioProvider>
  </BrowserRouter>
);

export default App;
