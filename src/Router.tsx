import { Navigate, Outlet, Route, Routes } from 'react-router'

import { AppLayout } from '@/layout'
import { useAuthStore } from '@/stores'

import {
  Company,
  ForgotPassword,
  Home,
  NotFound,
  Receipts,
  Signin,
  Signup,
  VerifyEmail
} from './pages'

const useAuthState = () => {
  const isSignedIn = useAuthStore((state) => !!state.user)
  const isVerified = useAuthStore((state) => !!state.user?.emailVerified)
  return { isSignedIn, isVerified }
}

const PrivateRoute = () => {
  const { isSignedIn, isVerified } = useAuthState()
  if (!isSignedIn) return <Navigate to="/signin" replace />
  if (!isVerified) return <Navigate to="/verify-email" replace />
  return <Outlet />
}

const PublicRoute = () => {
  const { isSignedIn, isVerified } = useAuthState()
  if (!isSignedIn) return <Outlet />
  if (!isVerified) return <Navigate to="/verify-email" replace />
  return <Navigate to="/" replace />
}

const VerifyEmailRoute = () => {
  const { isSignedIn, isVerified } = useAuthState()
  if (!isSignedIn) return <Navigate to="/signin" replace />
  if (isVerified) return <Navigate to="/" replace />
  return <Outlet />
}

export const Router = () => (
  <Routes>
    <Route element={<PublicRoute />}>
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Route>
    <Route element={<VerifyEmailRoute />}>
      <Route path="/verify-email" element={<VerifyEmail />} />
    </Route>
    <Route element={<PrivateRoute />}>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/receipts" element={<Receipts />} />
        <Route path="/company" element={<Company />} />
      </Route>
    </Route>
    <Route path="*" element={<NotFound />} />
  </Routes>
)
