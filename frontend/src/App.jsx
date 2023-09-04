import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';

function App() {
  const [country] = useState({
    name: 'Thailand',
    flag: 'https://cdn.ipregistry.co/flags/emojitwo/th.svg',
  });
  return (
    <>
      <BrowserRouter>
        <div>
          <Routes>
            <Route path="/" element={<HomeScreen country={country} />} />
            <Route path="/signin" element={<LoginScreen country={country} />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;