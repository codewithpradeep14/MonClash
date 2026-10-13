import React, { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAppStore } from './store/useAppStore'
import Sidebar, { MobileHeader } from './components/Sidebar'
import { ToastContainer } from './components/ui'

// Pages
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import SpotArena from './pages/SpotArena'
import PerpsArena from './pages/PerpsArena'
import Missions from './pages/Missions'
import Leaderboard from './pages/Leaderboard'
import Competitions from './pages/Competitions'
import Profile from './pages/Profile'
import AchievementsPage from './pages/Achievements'
import SettingsPage from './pages/Settings'
import AgoraHub from './pages/AgoraHub'

const PAGE_COMPONENTS: Record<string, React.ComponentType> = {
  dashboard: Dashboard,
  spot: SpotArena,
  perps: PerpsArena,
  agora: AgoraHub,
  missions: Missions,
  leaderboard: Leaderboard,
  competitions: Competitions,
  profile: Profile,
  achievements: AchievementsPage,
  settings: SettingsPage,
}

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
}

function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { currentPage } = useAppStore()
  const PageComponent = PAGE_COMPONENTS[currentPage] || Dashboard

  return (
    <div className="flex h-screen bg-bg-primary overflow-hidden">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <MobileHeader mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              variants={pageVariants}
              initial="initial"
              animate="enter"
              exit="exit"
              className="min-h-full"
            >
              <PageComponent />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <ToastContainer />
    </div>
  )
}

import WalletModal from './components/WalletModal'
import EmailAuthModal from './components/EmailAuthModal'

export default function App() {
  const { currentPage, theme } = useAppStore()

  // Sync document root class with theme
  React.useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light')
    } else {
      document.documentElement.classList.remove('light')
    }
  }, [theme])

  if (currentPage === 'landing') {
    return (
      <>
        <AnimatePresence>
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Landing />
          </motion.div>
        </AnimatePresence>
        <WalletModal />
        <EmailAuthModal />
        <ToastContainer />
      </>
    )
  }

  return (
    <>
      <AppLayout />
      <WalletModal />
      <EmailAuthModal />
    </>
  )
}
