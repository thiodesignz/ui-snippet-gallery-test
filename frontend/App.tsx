import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import Header from './components/Header';
import Home from './pages/Home';
import SnippetDetail from './pages/SnippetDetail';
import Profile from './pages/Profile';
import Upload from './pages/Upload';
import Login from './pages/Login';

const queryClient = new QueryClient();

function AppInner() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/snippet/:id" element={<SnippetDetail />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
        <Toaster />
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppInner />
    </QueryClientProvider>
  );
}
