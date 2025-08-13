
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { WalletProvider } from './contexts/WalletContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Create from './pages/Create'
import Search from './pages/Search'
import Marketplace from './pages/Marketplace'
import Leaderboard from './pages/Leaderboard'
import Profile from './pages/Profile'
import MemeDetail from './pages/MemeDetail'

function App() {
  return (
    <WalletProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
          <Navbar />
          <main className="pt-20">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create" element={<Create />} />
              <Route path="/search" element={<Search />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/meme/:id" element={<MemeDetail />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
            </Routes>
          </main>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              },
            }}
          />
        </div>
      </Router>
    </WalletProvider>
  )
}

export default App
