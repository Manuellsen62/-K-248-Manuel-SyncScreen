import React, { useState } from 'react';
import { AppStateProvider, useAppState } from './state/AppStateContext';
import { PhoneFrame } from './components/PhoneFrame';
import { LoginScreen } from './components/LoginScreen';
import { HomeScreen } from './components/HomeScreen';
import { TeamScreen } from './components/TeamScreen';
import { PersonalScreen } from './components/PersonalScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { SimulationPanel } from './components/SimulationPanel';
import { Sparkles, HelpCircle, Smartphone, ArrowRight, Zap, RefreshCw } from 'lucide-react';

function SyncSpaceAppContent() {
  const { currentUser, isGlockeOpen, setGlockeOpen, notifications, markNotificationsAsRead } = useAppState();
  const [activeTab, setActiveTab] = useState<string>('home');

  // Multi-route display router
  const renderActiveScreen = () => {
    if (!currentUser) {
      return <LoginScreen />;
    }

    // Toggle notification list inside the phone's screen
    if (isGlockeOpen) {
      const relevantNotifs = notifications.filter(n => n.targetRole === 'all' || n.targetRole === currentUser.id);
      return (
        <div className="flex-1 p-4 space-y-3 slide-enter font-sans">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <h3 className="font-display font-bold text-xs text-slate-500 uppercase tracking-widest">Alle Mitteilungen</h3>
            <button 
              onClick={() => {
                setGlockeOpen(false);
              }}
              className="text-2xs text-sky-500 hover:underline font-bold"
            >
              Schließen
            </button>
          </div>

          {relevantNotifs.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              Keine ungelesenen Benachrichtigungen vorhanden.
            </div>
          ) : (
            <div className="space-y-2">
              {relevantNotifs.map(n => (
                <div key={n.id} className="p-3 bg-white border border-slate-100 rounded-xl space-y-1">
                  <p className="text-xs font-bold text-slate-800">{n.title}</p>
                  <p className="text-[10px] text-slate-500 leading-normal">{n.text}</p>
                  <span className="text-[8px] text-slate-400 font-medium block pt-1">{n.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    switch (activeTab) {
      case 'home':
        return <HomeScreen setActiveTab={setActiveTab} />;
      case 'team':
        return <TeamScreen />;
      case 'persoenlich':
        return <PersonalScreen />;
      case 'profil':
        return <ProfileScreen />;
      default:
        return <HomeScreen setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:items-center md:justify-center bg-transparent p-0 md:p-6 lg:p-8 overflow-x-hidden">
      {/* Split emulator layout with only the Mockup and the Controller */}
      <div className="w-full flex flex-col md:flex-row items-center md:items-start md:justify-center gap-6 xl:gap-12">
        
        {/* iPhone screen container - full screen on mobile, device mockup on desktop */}
        <div className="w-full md:w-auto flex justify-center">
          <PhoneFrame activeTab={activeTab} setActiveTab={setActiveTab}>
            {renderActiveScreen()}
          </PhoneFrame>
        </div>

        {/* Right column: Simulation Action Deck - Hidden on mobile, visible next to the phone on desktop */}
        <div className="hidden md:block w-full max-w-[420px] xl:max-w-[440px] shrink-0">
          <SimulationPanel />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppStateProvider>
      <SyncSpaceAppContent />
    </AppStateProvider>
  );
}
