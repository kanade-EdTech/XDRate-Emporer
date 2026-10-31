import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { EmperorApp } from './app/EmperorApp';

const rootElement = document.getElementById('root');

if (rootElement === null) {
  throw new Error('The application root element is missing.');
}

createRoot(rootElement).render(
  <StrictMode>
    <EmperorApp />
  </StrictMode>,
);
