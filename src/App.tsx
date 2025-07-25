import './App.css'

import { BrowserRouter, Route, Routes } from 'react-router-dom';

import FormPage from './FormPage'; // Import FormPage component
import  ResultPage  from './ResultPage'; // Import ResultPage component

console.log("VITE_API_BASE_URL:", import.meta.env.VITE_API_BASE_URL);
console.log("All import.meta.env:", import.meta.env);

const App= () => {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FormPage />} />
        <Route path="/result" element={<ResultPage />} />
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
