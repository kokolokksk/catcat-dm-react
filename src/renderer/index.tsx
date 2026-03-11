import { createRoot } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import App from './App';
import './styles/index.css';
import './tauri/electronCompat';

const root = createRoot(document.getElementById('root')!);
const isYin = window.location.search === '?yin';
const isDmWindow = window.location.search === '?dmWindow';
if (isDmWindow) {
  document.documentElement.classList.add('dm-window-html');
  document.body.classList.add('dm-window');
  document.getElementById('root')?.classList.add('dm-window-root');
}
if (isYin) {
  root.render(<App />);
} else {
  root.render(
    <ChakraProvider>
      <App />
    </ChakraProvider>
  );
}
