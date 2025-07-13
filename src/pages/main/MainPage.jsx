import  { useState } from "react";
import Sidebar from './../../components/other/Sidebar';
import Dashboard from './../dashboard/Dashboard';
import ProductsPage from './../Product/ProductPage';
import CategoriesPage from './../category/CategoryPage';
import OrdersPage from './../orders/OrderPage';
import CustomersPage from "./../customer/CustomerPage";
import MessagingPage from "./../messages/MessagePage"; // Import the messaging component

const MainPage = () => {
  const [selectedSection, setSelectedSection] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleSelect = (section) => {
    setSelectedSection(section);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        onSelect={handleSelect}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        selectedSection={selectedSection} // Pass the selected section to highlight active item
      />

      {/* Main Content */}
      <div
        className={`flex-1 overflow-y-auto transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <div className="p-6">
          {/* Render the selected section */}
          {selectedSection === "dashboard" && <Dashboard/>}
          {selectedSection === "products" && <ProductsPage/>}
          {selectedSection === "categories" && <CategoriesPage/>}
          {selectedSection === "orders" && <OrdersPage/>}
          {selectedSection === "customers" && <CustomersPage/>}
          {selectedSection === "messages" && <MessagingPage/>} {/* Add messaging page */}
        </div>
      </div>
    </div>
  );
};

export default MainPage;