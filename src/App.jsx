import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import CountdownDisplay from './components/CountdownDisplay';
import TasksScreen from './screens/TasksScreen';
import StatsScreen from './screens/StatsScreen';
import ProjectsScreen from './screens/ProjectsScreen';
import { Settings } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('timer');

  const renderScreen = () => {
    switch (activeTab) {
      case 'tasks':
        return <TasksScreen />;
      case 'stats':
        return <StatsScreen />;
      case 'projects':
        return <ProjectsScreen />;
      case 'timer':
      default:
        return (
          <div className="flex flex-col flex-1 h-full relative">
            <div className="absolute top-0 left-0 z-20">
              <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_5px_20px_rgba(0,0,0,0.04)] hover:scale-105 hover:shadow-[0_8px_25px_rgba(0,0,0,0.08)] transition-all text-brand-gray hover:text-brand-dark">
                <Settings size={20} />
              </button>
            </div>
            <CountdownDisplay minutes="00" seconds="52" />
          </div>
        );
    }
  };

  return (
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
  );
}

export default App;
