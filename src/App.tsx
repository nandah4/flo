import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Notes from './pages/Notes';
import Tasks from './pages/Tasks';
import Home from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/tasks" element={<Tasks />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
