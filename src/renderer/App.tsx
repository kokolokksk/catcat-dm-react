import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DanmuWindow from './pages/DanmuWindow';
import Setting from './pages/Setting';

const App = () => {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Setting />} />
        <Route path="/dmWindow" element={<DanmuWindow />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
