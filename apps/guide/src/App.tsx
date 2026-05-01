import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './auth/AuthGate'
import Open from './routes/Open'
import Login from './routes/Login'
import Home from './routes/Home'
import Account from './routes/Account'
import Trip from './routes/Trip'
import Day from './routes/Day'
import StopDetail from './routes/StopDetail'

// DEV PREVIEW: RequireAuth wrappers temporarily removed so the UI is browsable
// without the Worker running. Re-wrap before deploying — see git history.
export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/open" element={<Open />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/trip/:tripId" element={<Trip />} />
        <Route path="/trip/:tripId/day/:dayN" element={<Day />} />
        <Route path="/stop/:stopId" element={<StopDetail />} />
        <Route path="/account" element={<Account />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
