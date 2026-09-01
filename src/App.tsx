import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { CommandPalette } from './components/layout/CommandPalette';
import { AICopilotDrawer } from './components/layout/AICopilotDrawer';
import { ToastContainer } from './components/layout/ToastContainer';

// 11 Module Views
import { OverviewView } from './components/modules/overview/OverviewView';
import { DataSourcesView } from './components/modules/sources/DataSourcesView';
import { SqlWorkspaceView } from './components/modules/sql/SqlWorkspaceView';
import { DataModelingView } from './components/modules/modeling/DataModelingView';
import { DashboardBuilderView } from './components/modules/dashboards/DashboardBuilderView';
import { PerformanceView } from './components/modules/performance/PerformanceView';
import { DebugCenterView } from './components/modules/debug/DebugCenterView';
import { AccessControlView } from './components/modules/access/AccessControlView';
import { DeploymentCenterView } from './components/modules/deployments/DeploymentCenterView';
import { IntegrationHubView } from './components/modules/integrations/IntegrationHubView';
import { SettingsView } from './components/modules/settings/SettingsView';

const MainLayout: React.FC = () => {
  const { currentSection, theme, density } = useApp();

  const renderCurrentView = () => {
    switch (currentSection) {
      case 'overview':
        return <OverviewView />;
      case 'sources':
        return <DataSourcesView />;
      case 'sql':
        return <SqlWorkspaceView />;
      case 'modeling':
        return <DataModelingView />;
      case 'dashboards':
        return <DashboardBuilderView />;
      case 'performance':
        return <PerformanceView />;
      case 'debug':
        return <DebugCenterView />;
      case 'access':
        return <AccessControlView />;
      case 'deployments':
        return <DeploymentCenterView />;
      case 'integrations':
        return <IntegrationHubView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <OverviewView />;
    }
  };

  const getThemeClass = () => {
    switch (theme) {
      case 'cyber':
        return 'theme-cyber bg-[#0b1120] text-slate-100';
      case 'midnight':
        return 'theme-midnight bg-[#030712] text-emerald-50';
      case 'contrast':
        return 'theme-contrast bg-[#000000] text-white';
      default:
        return 'theme-obsidian bg-[#080b11] text-slate-100';
    }
  };

  return (
    <div className={`flex min-h-screen w-full ${getThemeClass()} ${density === 'compact' ? 'text-xs' : 'text-sm'} selection:bg-cyan-500/25 selection:text-cyan-200 font-sans antialiased overflow-x-hidden`}>
      {/* Left Collapsible Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Top Header */}
        <Header />

        {/* Dynamic Viewport Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {renderCurrentView()}
        </main>
      </div>

      {/* Global Command Palette (Ctrl+K) */}
      <CommandPalette />

      {/* Persistent AI Copilot Side Drawer */}
      <AICopilotDrawer />

      {/* Toast Notification Stack */}
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;
