import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';
import {persistor, store } from './app/store/store';
import App from './App';
import './styles/index.css';
import ErrorBoundary from './features/auth/errorhandler/ErrorBoundary';
import { BASENAME } from './features/auth/common/constants';
import { PersistGate } from 'redux-persist/integration/react';

import ToastContainer from './components/ToastContainer';
const queryClient = new QueryClient(
  {
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        cacheTime: 1000 * 60 * 30, 
        staleTime: 1000 * 60 * 30,
      },
    },
  }
);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
<ErrorBoundary screen="Application">
     <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter basename={BASENAME}>
        <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="loader">Loading...</div></div>}> 
        <App />
        </Suspense>
        </BrowserRouter>
      </QueryClientProvider>
       <ToastContainer />
      </PersistGate>
    </Provider>
</ErrorBoundary>

          
 
 
);