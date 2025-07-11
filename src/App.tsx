import './App.css'

import { BrowserRouter, Route, Routes } from 'react-router-dom';

import FormPage from './FormPage'; // Import FormPage component
import  ResultPage  from './ResultPage'; // Import ResultPage component

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
