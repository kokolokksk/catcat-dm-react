import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import App from './App';
import './styles/index.css';

const root = createRoot(document.getElementById('root')!);
window.danmuApi.mainProcessMessage((_event: any, value: any) => {
  console.info(value);
});
window.danmuApi.createWindowsName((_event: any, data: any) => {
  console.info(data);
  if (data === 'yin') {
    root.render(<App />);
  } else {
    root.render(
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );
  }
});
// window.removeLoading();
