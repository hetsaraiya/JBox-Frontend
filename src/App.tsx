import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { FolderView } from './pages/FolderView';
import { ThemeToggle } from './components/ThemeToggle';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-lightBackground dark:bg-darkBackground transition-colors">
        <ThemeToggle />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/folder" element={<FolderView />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;