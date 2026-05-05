import React, { Suspense } from 'react'
import Navbar from '../components/Navbar'
import SearchBar from '../components/SearchBar'
import Footer from '../components/Footer'
import Chat from '../components/Chat'
import Sidebar from '../components/admincomponent/Sidebar'
import AdminNavbar from '../components/admincomponent/Navbar'

const LoadingFallback = () => (
  <div className='flex items-center justify-center min-h-screen'>
    <div className='text-center'>
      <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4'></div>
      <p className='text-gray-600'>Loading...</p>
    </div>
  </div>
)

export const PublicLayout = ({ children }) => (
  <>
    <Navbar />
    <SearchBar />
    <Suspense fallback={<LoadingFallback />}>
      {children}
    </Suspense>
    <Footer />
  </>
)

export const ProtectedLayout = ({ children, withChat = false }) => (
  <>
    <Navbar />
    <SearchBar />
    <Suspense fallback={<LoadingFallback />}>
      {children}
    </Suspense>
    <Footer />
    {withChat && <Chat />}
  </>
)

export const AdminLayout = ({ children }) => (
  <div className='flex flex-col min-h-screen'>
    <AdminNavbar />
    <div className='flex flex-1'>
      <Sidebar />
      <div className='w-full p-4 sm:p-8 overflow-auto'>
        <Suspense fallback={<LoadingFallback />}>
          {children}
        </Suspense>
      </div>
    </div>
  </div>
)
