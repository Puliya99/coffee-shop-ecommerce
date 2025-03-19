import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { CartContext } from '../../context/CartContext'

const Navbar = () => {
  const { currentUser, logout, isAdmin } = useContext(AuthContext)
  const { cart } = useContext(CartContext)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="bg-amber-900 text-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-xl font-bold">
            Coffee Shop
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-amber-200 transition">
              Home
            </Link>
            <Link to="/products" className="hover:text-amber-200 transition">
              Menu
            </Link>
            <Link to="/about" className="hover:text-amber-200 transition">
              About
            </Link>
            <Link to="/contact" className="hover:text-amber-200 transition">
              Contact
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/cart"
              className="flex items-center hover:text-amber-200 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {cart.length > 0 && (
                <span className="bg-amber-500 text-xs rounded-full h-5 w-5 flex items-center justify-center ml-1">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </Link>

            {currentUser ? (
              <div className="relative">
                <button
                  className="flex items-center hover:text-amber-200 transition"
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  <span className="mr-1">
                    {currentUser.email.split('@')[0]}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <Link
                      to="/my-account"
                      className="block px-4 py-2 text-gray-800 hover:bg-amber-100"
                      onClick={() => setMenuOpen(false)}
                    >
                      My Account
                    </Link>

                    <Link
                      to="/my-orders"
                      className="block px-4 py-2 text-gray-800 hover:bg-amber-100"
                      onClick={() => setMenuOpen(false)}
                    >
                      My Orders
                    </Link>

                    {isAdmin() && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-gray-800 hover:bg-amber-100"
                        onClick={() => setMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}

                    <button
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-amber-100"
                      onClick={() => {
                        logout()
                        setMenuOpen(false)
                      }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-x-2">
                <Link to="/login" className="hover:text-amber-200 transition">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-amber-600 px-3 py-1 rounded hover:bg-amber-700 transition"
                >
                  Sign Up
                </Link>
              </div>
            )}

            <button
              className="md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4">
            <Link
              to="/"
              className="block py-2 hover:text-amber-200"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/products"
              className="block py-2 hover:text-amber-200"
              onClick={() => setMenuOpen(false)}
            >
              Menu
            </Link>
            <Link
              to="/about"
              className="block py-2 hover:text-amber-200"
              onClick={() => setMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block py-2 hover:text-amber-200"
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
