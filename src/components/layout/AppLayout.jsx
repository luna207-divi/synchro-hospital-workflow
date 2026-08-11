import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import './AppLayout.css';

/**
 * SYNCHRO App Layout
 * 
 * Grid layout:
 * - Left: Fixed sidebar navigation
 * - Right: Header + scrollable content area
 */
export const AppLayout = ({ 
  children, 
  activeNav, 
  onNavSelect, 
  pageTitle, 
  breadcrumb,
  onAlertClick,
  onOpenSearch
}) => {
  return (
    <div className="synchro-app-layout">
      <Sidebar 
        activeNav={activeNav} 
        onNavSelect={onNavSelect} 
      />
      <div className="synchro-main-area">
        <Header 
          pageTitle={pageTitle}
          breadcrumb={breadcrumb}
          onAlertClick={onAlertClick}
          onOpenSearch={onOpenSearch}
        />
        <main className="synchro-content">
          <div key={activeNav} className="app-view-container">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
