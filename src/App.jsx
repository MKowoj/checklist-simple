import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ChecklistView from './views/ChecklistView';
import DashboardView from './views/DashboardView';

export default function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Lista de Verificación</Link>
        <Link to="/tablero">Tablero</Link>
      </nav>
      <Routes>
        <Route path="/" element={<ChecklistView />} />
        <Route path="/tablero" element={<DashboardView />} />
      </Routes>
    </Router>
  );
}