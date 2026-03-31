import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Loader from './components/Loader';

// Pages - Lazy loaded for better performance
const Home = lazy(() => import('./components/pages/Home'));
const Listings = lazy(() => import('./components/pages/Listings'));
const ListingDetail = lazy(() => import('./components/pages/ListingDetail'));
const CreateListing = lazy(() => import('./components/pages/CreateListing'));
const MyListings = lazy(() => import('./components/pages/MyListings'));
const Messages = lazy(() => import('./components/pages/Messages'));
const Profile = lazy(() => import('./components/pages/Profile'));
const About = lazy(() => import('./components/pages/About'));
const Login = lazy(() => import('./components/pages/Login'));
const Register = lazy(() => import('./components/pages/Register'));

// Loading fallback
const PageLoader = () => (
  <div className="flex justify-center items-center min-h-screen">
    <Loader />
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Navbar />
          <main className="flex-grow">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/listings" element={<Listings />} />
                <Route path="/listing/:id" element={<ListingDetail />} />
                <Route path="/create-listing" element={<CreateListing />} />
                <Route path="/my-listings" element={<MyListings />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
