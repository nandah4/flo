import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Notes from './pages/Notes';
import Tasks from './pages/Tasks';
import Timer from './pages/Timer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Planning from './pages/Planning';
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
          <Route path="/planning" element={<Planning />} />
          <Route path="/timer" element={<Timer />} />
        </Routes>
      </BrowserRouter>
    </QuestProvider>
  );
}

export default App;
