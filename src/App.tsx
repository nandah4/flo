import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Notes from './pages/Notes';
import Tasks from './pages/Tasks';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import { QuestProvider } from './context/QuestContext';

function App() {
  return (
    <QuestProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/tasks" element={<Tasks />} />
        </Routes>
      </BrowserRouter>
    </QuestProvider>
  );
}

export default App;
