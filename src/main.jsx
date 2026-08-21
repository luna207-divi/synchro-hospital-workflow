import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { AuthProvider } from './context/AuthContext';
import { RoleProvider } from './context/RoleContext';
import { DemoProvider } from './context/DemoContext';
import { WorkflowProvider } from './context/WorkflowContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { router } from './router';
import './styles/globals.css';

/* ============================================================
   SYNCHRO — Application Entry Point
   
   Provider stack (outermost → innermost):
   1. ErrorBoundary — Application-level safety fallback
   2. QueryClientProvider — TanStack Query cache
   3. AuthProvider — Supabase Auth state
   4. RoleProvider — Active role & RBAC nav filtering
   5. WorkflowProvider — Shared patient & hospital telemetry
   6. DemoProvider — Connected demo scenario state
   7. RouterProvider — react-router route tree
   ============================================================ */

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RoleProvider>
            <WorkflowProvider>
              <DemoProvider>
                <RouterProvider router={router} />
              </DemoProvider>
            </WorkflowProvider>
          </RoleProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
