import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Homepage from './routes/homepage/Homepage';
import DashboardPage from './routes/dashboardPage/DashboardPage';
import ChatPage from './routes/chatPage/ChatPage';  
import RootLayout from './layouts/rootLayout/RootLayout';
import DashboardLayout from './layouts/dashboardLayout/DashboardLayout';
import { ClerkProvider } from '@clerk/clerk-react';
import SignInPage from './routes/signInPage/signInPage';
import SignUpPage from './routes/signUpPage/signUpPage';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;



const router = createBrowserRouter([
    {
        element: <RootLayout/>,
        children: [
        {
          path: "/",
          element: <Homepage />
        },
        {
          path: "/sign-in/",
          element: <SignInPage />
        },
        {
          path: "/sign-up/",
          element: <SignUpPage />
        },
        {
          element: <DashboardLayout/>,
          children: [
              {
                path: "/dashboard",
                element: <DashboardPage/>,
              },
              {
                path: "/dashboard/chats/:id",
                element: <ChatPage />,
              },
            ],
          },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
  </ClerkProvider>
);