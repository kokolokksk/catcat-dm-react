import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import App from './App';
import './styles/index.css';

const root = createRoot(document.getElementById('root')!);
window.danmuApi.mainProcessMessage((_event: any, value: any) => {
  console.info(value);
});
root.render(<App />);

// window.removeLoading();
