import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from '../../../Layout';
import { Dashboard } from '../../../../Dashboard';


export const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        
      </Route>
    </Routes>
  );
};
