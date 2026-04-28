import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import CountdownDisplay from './components/CountdownDisplay';
import TasksScreen from './screens/TasksScreen';
import StatsScreen from './screens/StatsScreen';
import ProjectsScreen from './screens/ProjectsScreen';
import AccountScreen from './screens/AccountScreen';
import AuthScreen from './screens/AuthScreen';
import { TimerProvider } from './context/TimerContext';
import { Settings } from 'lucide-react';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem('token');
    return token && token !== 'undefined' && token !== 'null';
  });
  const [activeTab, setActiveTab] = useState('tasks');

  // التأكد من وجود التوكن عند التحميل الأول
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && token !== 'undefined' && token !== 'null') {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setActiveTab('tasks');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    setIsAuthenticated(false);
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'tasks':
        return <TasksScreen />;
      case 'stats':
        return <StatsScreen />;
      case 'projects':
        return <ProjectsScreen />;
      case 'account':
        return <AccountScreen onLogout={handleLogout} />;
      case 'timer':
      default:
        return (
          <div className="flex flex-col flex-1 h-full relative">
            <CountdownDisplay minutes="00" seconds="52" />
          </div>
        );
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#003B46] text-white overflow-hidden tracking-wide text-lg">
        <AuthScreen onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <TimerProvider>
      <div className="flex min-h-screen bg-[#003B46] text-white relative overflow-hidden tracking-wide text-lg" dir="rtl">
        {/* Background glow effects */}
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[radial-gradient(circle,rgba(52,165,147,0.15)_0%,rgba(0,59,70,0)_70%)] z-0 pointer-events-none blur-3xl"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-[radial-gradient(circle,rgba(52,165,147,0.1)_0%,rgba(0,59,70,0)_70%)] z-0 pointer-events-none blur-3xl"></div>

        {/* Main Layout */}
        <div className="relative z-10 flex w-full h-screen">

          {/* Sidebar */}
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col relative p-10 h-full overflow-y-auto">
            {renderScreen()}
          </main>
        </div>
      </div>
    </TimerProvider>
  );
}

export default App;
