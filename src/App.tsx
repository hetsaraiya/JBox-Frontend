import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { FolderView } from './pages/FolderView';
import { FileView } from './pages/FileView';
import { ThemeToggle } from './components/ThemeToggle';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <ThemeToggle />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/folder" element={<FolderView />} />
          <Route path="/file" element={<FileView />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}