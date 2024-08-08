

import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import Login from "./routes/Login";
import MainPage from "./routes/MainPage";
import WarningPage from './routes/WarningPage';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/main-page" element={<MainPage />} />
        <Route path="/warning-page" element={<WarningPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
export default App;


