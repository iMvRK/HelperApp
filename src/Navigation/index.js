import React from 'react';
import { AuthProvider } from './AuthProvider.android';
import Routes from './Routes';

const Providers = () => {
  return (
      // wrapping the main application inside the authentication 
      <AuthProvider>
        <Routes/>
      </AuthProvider>
    );
}

export default Providers;