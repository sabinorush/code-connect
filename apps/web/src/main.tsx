import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router'
import './style.css'
import { AuthProvider } from './auth/AuthProvider'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { PublicOnlyRoute } from './routes/PublicOnlyRoute'
import { LoginPage } from './components/pages/LoginPage/LoginPage'
import { CadastroPage } from './components/pages/CadastroPage/CadastroPage'
import { HomePage } from './components/pages/HomePage/HomePage'
import { NotFound } from './components/pages/NotFound/NotFound'

const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/home" replace /> },
  {
    path: '/login',
    element: (
      <PublicOnlyRoute>
        <LoginPage />
      </PublicOnlyRoute>
    ),
  },
  {
    path: '/cadastro',
    element: (
      <PublicOnlyRoute>
        <CadastroPage />
      </PublicOnlyRoute>
    ),
  },
  {
    path: '/home',
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
  },
  { path: '*', element: <NotFound /> },
])

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
