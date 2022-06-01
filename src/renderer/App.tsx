import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DanmuWindow from './pages/DanmuWindow';
import Setting from './pages/Setting';

const App = () => {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/index.html" element={<Setting />} />
        <Route path="/index.html#dmWindow" element={<DanmuWindow />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
