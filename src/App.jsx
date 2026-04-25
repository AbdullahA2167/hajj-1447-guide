// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PilgrimSelect } from './components/users/PilgrimSelect';
import { UserShell } from './components/layout/UserShell';
import { ItineraryTab } from './components/itinerary/ItineraryTab';
import { UmrahTab } from './components/umrah/UmrahTab';
import { HajjTab } from './components/hajj/HajjTab';
import { DuasTab } from './components/duas/DuasTab';
import { ProfileTab } from './components/users/ProfileTab';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<PilgrimSelect />} />
      <Route path="/user/:id" element={<UserShell />}>
        <Route index element={<Navigate to="itinerary" replace />} />
        <Route path="itinerary" element={<ItineraryTab />} />
        <Route path="umrah" element={<UmrahTab />} />
        <Route path="hajj" element={<HajjTab />} />
        <Route path="duas" element={<DuasTab />} />
        <Route path="profile" element={<ProfileTab />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}