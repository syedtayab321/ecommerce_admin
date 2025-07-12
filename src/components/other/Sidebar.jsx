import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutAdmin } from "../../redux/slices/authSlice";
import {
  FaHome,
  FaBox,
  FaTags,
  FaShoppingCart,
  FaStar,
  FaUsers,
  FaCog,
  FaImage,
  FaComments,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaUserCircle,
  FaStore,
} from "react-icons/fa";
import LogoutModal from './LogoutModal';

const navItems = [
  {
    category: "Overview",
    items: [
      { text: "Dashboard", icon: FaHome, link: "dashboard" }
    ]
  },
  {
    category: "Products",
    items: [
      { text: "All Products", icon: FaBox, link: "products" },
      { text: "Categories", icon: FaTags, link: "categories" },
    ]
  },
  {
    category: "Sales",
    items: [
      { text: "Orders", icon: FaShoppingCart, link: "orders", notification: 12 },
    ]
  },
  {
    category: "Customers",
    items: [
      { text: "Customers", icon: FaUsers, link: "customers" },
      { text: "Reviews", icon: FaStar, link: "reviews" },
      { text: "Messages", icon: FaComments, link: "messages" }
    ]
  },
];

const Sidebar = ({ onSelect, isOpen, setIsOpen }) => {
  const [activeItem, setActiveItem] = useState("dashboard");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await dispatch(logoutAdmin()).unwrap();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setShowLogoutModal(false);
    }
  };

  const handleClick = (link) => {
    setActiveItem(link);
    onSelect(link);
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 ease-in-out ${
        isOpen ? "w-64" : "w-20"
      } shadow-xl`}
    >
      {/* Header Section */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {isOpen ? (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <h1 className="text-xl font-bold">Shop Admin</h1>
          </div>
        ) : (
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-sm">S</span>
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-300 hover:text-white focus:outline-none"
        >
          {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* User Profile Quick View */}
      {isOpen && (
        <div className="p-4 border-b border-gray-700 flex items-center space-x-3">
          <div className="relative">
            <FaUserCircle className="h-10 w-10 text-gray-300" />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></span>
          </div>
          <div>
            <p className="font-medium">Shop Owner</p>
            <p className="text-xs text-gray-400">Admin</p>
          </div>
        </div>
      )}

      {/* Sidebar Menu */}
      <nav className="flex-1 overflow-y-auto py-4 scrollbar-hide">
        {navItems.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-4">
            {isOpen && section.category && (
              <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                {section.category}
              </h3>
            )}
            <ul className="space-y-1 px-2">
              {section.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                  <button
                    onClick={() => handleClick(item.link)}
                    className={`flex w-full items-center gap-3 rounded-lg p-3 transition-all duration-200 ${
                      activeItem === item.link
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-gray-300 hover:bg-gray-700"
                    } ${!isOpen ? "justify-center" : ""}`}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {isOpen && (
                      <span className="text-sm font-medium flex-1 text-left">
                        {item.text}
                      </span>
                    )}
                    {item.notification && (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {item.notification}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Bottom Menu */}
      <div className="p-4 border-t border-gray-700 space-y-2">
        <button
          onClick={() => setShowLogoutModal(true)}
          className={`flex w-full items-center gap-3 rounded-lg p-3 text-gray-300 hover:bg-gray-700 transition-all duration-200 ${
            !isOpen ? "justify-center" : ""
          }`}
        >
          <FaSignOutAlt className="h-5 w-5" />
          {isOpen && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>

      {/* Logout Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onLogout={handleLogout}
      />
    </div>
  );
};

export default Sidebar;