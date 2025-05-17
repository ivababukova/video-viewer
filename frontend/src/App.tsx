import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import AppLayout from './components/AppLayout';
import Dashboard from './pages/Dashboard';
import VideoDetail from './pages/VideoDetail';

const App: React.FC = () => {
  return (
    <ConfigProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="videos/:id" element={<VideoDetail />} />
            {/* Add more routes as needed */}
          </Route>
        </Routes>
      </Router>
    </ConfigProvider>
  );
};

export default App;