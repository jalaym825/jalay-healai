import React from 'react'
import ReactDOM, { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import Cookies from 'universal-cookie';
import './index.css'
import { Toaster } from "./UIs/shadcn-ui/sonner.jsx";

export const cookies = new Cookies(); 

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  // <React.StrictMode>
  <BrowserRouter>
      <App />
      <Toaster />
  </BrowserRouter>
  // </React.StrictMode>
);