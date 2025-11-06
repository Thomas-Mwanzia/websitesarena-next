"use client";

import React from 'react';
import { AuthProvider } from '@/context/page';

export default function RootClient({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
