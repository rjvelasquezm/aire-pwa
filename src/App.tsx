import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Explore from './pages/Explore';
import History from './pages/History';
import Settings from './pages/Settings';
import TechniqueDetail from './pages/TechniqueDetail';
import Session from './pages/Session';

function TabBar() {
  const location = useLocation();
  const isSession = location.pathname.startsWith('/session');
  if (isSession) return null;

  return (
    <nav className="tab-bar">
      <NavLink to="/" end className={({ isActive }) => isActive ? 'tab-item active' : 'tab-item'}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0"/><path d="M12 8v4l2 2"/></svg>
        <span className="tab-label">Home</span>
      </NavLink>
      <NavLink to="/explore" className={({ isActive }) => isActive ? 'tab-item active' : 'tab-item'}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <span className="tab-label">Explore</span>
      </NavLink>
      <NavLink to="/history" className={({ isActive }) => isActive ? 'tab-item active' : 'tab-item'}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
        <span className="tab-label">History</span>
      </NavLink>
      <NavLink to="/settings" className={({ isActive }) => isActive ? 'tab-item active' : 'tab-item'}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
        <span className="tab-label">Settings</span>
      </NavLink>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <div className="page-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/technique/:id" element={<TechniqueDetail />} />
            <Route path="/session/:id" element={<Session />} />
            <Route path="/history" element={<History />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
        <TabBar />
      </div>
    </BrowserRouter>
  );
}
