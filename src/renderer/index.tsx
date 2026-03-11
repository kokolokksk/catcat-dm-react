import { createRoot } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import App from './App';
import './styles/index.css';
import './tauri/electronCompat';

const root = createRoot(document.getElementById('root')!);
const isYin = window.location.search === '?yin';
if (isYin) {
  root.render(<App />);
} else {
  root.render(
    <ChakraProvider>
      <App />
    </ChakraProvider>
  );
}
