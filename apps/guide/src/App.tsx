import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, RequireAuth } from './auth/AuthGate'
import Open from './routes/Open'
import Login from './routes/Login'
import Home from './routes/Home'
import Account from './routes/Account'
import Trip from './routes/Trip'
import Day from './routes/Day'
import StopDetail from './routes/StopDetail'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/open" element={<Open />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />
        <Route
          path="/trip/:tripId"
          element={
            <RequireAuth>
              <Trip />
            </RequireAuth>
          }
        />
        <Route
          path="/trip/:tripId/day/:dayN"
          element={
            <RequireAuth>
              <Day />
            </RequireAuth>
          }
        />
        <Route
          path="/stop/:stopId"
          element={
            <RequireAuth>
              <StopDetail />
            </RequireAuth>
          }
        />
        <Route
          path="/account"
          element={
            <RequireAuth>
              <Account />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
