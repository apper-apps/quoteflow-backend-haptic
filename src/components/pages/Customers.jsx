import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import TableRow from "@/components/molecules/TableRow";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { toast } from "react-toastify";
import { quotesService } from "@/services/api/quotesService";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [customers, searchTerm]);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Since we don't have a dedicated customers service, we'll extract customer data from quotes
      const quotes = await quotesService.getAll();
      
      // Create customer summary from quotes
      const customerMap = new Map();
      
      quotes.forEach(quote => {
        const customerId = quote.customerId;
        if (!customerMap.has(customerId)) {
          customerMap.set(customerId, {
            Id: customerId,
            customerId,
            totalQuotes: 0,
            totalValue: 0,
            acceptedQuotes: 0,
            lastQuoteDate: null,
            status: "active"
          });
        }
        
        const customer = customerMap.get(customerId);
        customer.totalQuotes++;
        
        if (quote.status === "accepted") {
          customer.acceptedQuotes++;
          customer.totalValue += quote.totalCustomerCurrency;
        }
        
        if (!customer.lastQuoteDate || new Date(quote.createdAt) > new Date(customer.lastQuoteDate)) {
          customer.lastQuoteDate = quote.createdAt;
        }
      });

      const customersData = Array.from(customerMap.values());
      setCustomers(customersData);
    } catch (err) {
      setError("Failed to load customers");
      toast.error("Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  const filterCustomers = () => {
    if (!searchTerm) {
      setFilteredCustomers(customers);
      return;
    }

    const filtered = customers.filter(customer =>
      customer.customerId.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCustomers(filtered);
  };

  const getCustomerStatus = (customer) => {
    const daysSinceLastQuote = customer.lastQuoteDate ? 
      Math.floor((new Date() - new Date(customer.lastQuoteDate)) / (1000 * 60 * 60 * 24)) : 
      999;
    
    if (daysSinceLastQuote <= 30) return "active";
    if (daysSinceLastQuote <= 90) return "inactive";
    return "dormant";
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "active":
        return "success";
      case "inactive":
        return "warning";
      case "dormant":
        return "error";
      default:
        return "default";
    }
  };

  const getAcceptanceRate = (customer) => {
    if (customer.totalQuotes === 0) return 0;
    return Math.round((customer.acceptedQuotes / customer.totalQuotes) * 100);
  };

  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return <Loading variant="table" rows={8} />;
  }

  if (error) {
    return <Error message={error} onRetry={loadCustomers} />;
  }

  if (customers.length === 0) {
    return (
      <Empty
        title="No customers found"
        message="Customer data is generated from quotes. Create some quotes to see customer information."
        actionLabel="Create Quote"
        icon="Users"
        variant="data"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Customers</h1>
          <p className="text-gray-600 mt-1">
            Track customer relationships and quote history
          </p>
        </div>
        
        <div className="w-full lg:w-80">
          <SearchBar
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClear={() => setSearchTerm("")}
          />
        </div>
      </div>

      {/* Customer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6" variant="premium">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold gradient-text">{customers.length}</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full">
              <ApperIcon name="Users" className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6" variant="premium">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Customers</p>
              <p className="text-2xl font-bold text-success">
                {customers.filter(c => getCustomerStatus(c) === "active").length}
              </p>
            </div>
            <div className="p-3 bg-gradient-to-r from-success/10 to-green-100 rounded-full">
              <ApperIcon name="UserCheck" className="h-6 w-6 text-success" />
            </div>
          </div>
        </Card>

        <Card className="p-6" variant="premium">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(customers.reduce((sum, c) => sum + c.totalValue, 0))}
              </p>
            </div>
            <div className="p-3 bg-gradient-to-r from-primary/10 to-blue-100 rounded-full">
              <ApperIcon name="DollarSign" className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6" variant="premium">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Acceptance Rate</p>
              <p className="text-2xl font-bold text-secondary">
                {customers.length > 0 ? 
                  Math.round(customers.reduce((sum, c) => sum + getAcceptanceRate(c), 0) / customers.length) : 0
                }%
              </p>
            </div>
            <div className="p-3 bg-gradient-to-r from-secondary/10 to-purple-100 rounded-full">
              <ApperIcon name="TrendingUp" className="h-6 w-6 text-secondary" />
            </div>
          </div>
        </Card>
      </div>

      {filteredCustomers.length === 0 ? (
        <Empty
          title="No customers match your search"
          message="Try adjusting your search criteria or browse all customers."
          actionLabel="Clear Search"
          onAction={() => setSearchTerm("")}
          icon="Search"
          variant="search"
        />
      ) : (
        <Card className="overflow-hidden" variant="premium">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-primary/5 to-secondary/5">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Quotes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acceptance Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Quote
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCustomers.map((customer) => (
                  <TableRow
                    key={customer.customerId}
                    selected={selectedCustomer === customer.customerId}
                    onClick={() => setSelectedCustomer(customer.customerId)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="p-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full mr-3">
                          <ApperIcon name="User" className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {customer.customerId}
                          </div>
                          <div className="text-sm text-gray-500">
                            Customer ID
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getStatusVariant(getCustomerStatus(customer))}>
                        {getCustomerStatus(customer).charAt(0).toUpperCase() + getCustomerStatus(customer).slice(1)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {customer.totalQuotes}
                      </div>
                      <div className="text-sm text-gray-500">
                        {customer.acceptedQuotes} accepted
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {getAcceptanceRate(customer)}%
                      </div>
                      <div className="text-sm text-gray-500">
                        Success rate
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(customer.totalValue)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Total revenue
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(customer.lastQuoteDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="FileText"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Navigate to customer quotes
                          }}
                        >
                          View Quotes
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="Plus"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Create new quote for customer
                          }}
                        >
                          New Quote
                        </Button>
                      </div>
                    </td>
                  </TableRow>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Customers;