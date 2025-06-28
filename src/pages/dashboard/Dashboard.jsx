import React from 'react';
import { FiTrendingUp, FiDollarSign, FiUsers, FiPackage } from 'react-icons/fi';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Components
import MetricCard from './../../components/Dashboard/MetricsCard';
import RecentOrders from './../../components/Dashboard/RecentOrders';
import SalesChart from './../../components/Dashboard/SalesChart';
import TrafficSources from './../../components/Dashboard/TrafficSources';
import TopProducts from './../../components/Dashboard/TopProducts';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 md:p-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>
        
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard 
            title="Total Revenue" 
            value="$24,780" 
            change="12.5%" 
            isIncrease={true} 
            icon={<FiDollarSign className="text-blue-500" />}
          />
          <MetricCard 
            title="Total Orders" 
            value="1,248" 
            change="8.3%" 
            isIncrease={true} 
            icon={<FiPackage className="text-green-500" />}
          />
          <MetricCard 
            title="New Customers" 
            value="324" 
            change="-2.1%" 
            isIncrease={false} 
            icon={<FiUsers className="text-purple-500" />}
          />
          <MetricCard 
            title="Conversion Rate" 
            value="3.42%" 
            change="0.7%" 
            isIncrease={true} 
            icon={<FiTrendingUp className="text-amber-500" />}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 bg-white p-4 rounded-xl shadow-sm">
            <SalesChart />
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <TrafficSources />
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-4 rounded-xl shadow-sm">
            <RecentOrders />
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <TopProducts />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;