import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './AppTODO';
import { ApiProvider } from '@reduxjs/toolkit/dist/query/react';
import { apiSlice } from './features/api/apiSlice';

ReactDOM.render(
  <React.StrictMode>
    <ApiProvider api={apiSlice}>
      <App />
    </ApiProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
