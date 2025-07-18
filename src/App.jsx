import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from '@/components/Layout';
import Dashboard from '@/components/pages/Dashboard';
import CustomerDashboard from '@/components/pages/CustomerDashboard';
import AgentDashboard from '@/components/pages/AgentDashboard';
import Quotes from '@/components/pages/Quotes';
import Products from '@/components/pages/Products';
import Customers from '@/components/pages/Customers';
import Reports from '@/components/pages/Reports';
import Settings from '@/components/pages/Settings';
function App() {
  return (
    <div className="App">
<Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard/customer" element={<CustomerDashboard />} />
          <Route path="dashboard/agent" element={<AgentDashboard />} />
          <Route path="quotes" element={<Quotes />} />
          <Route path="products" element={<Products />} />
          <Route path="customers" element={<Customers />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
    </div>
  );
}

export default App;