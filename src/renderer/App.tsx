import { useState } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import RouteConfig from './route/RouteConfig';
import Setting from './pages/Setting';
import './tailwind.css';

const App = () => {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<RouteConfig />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
