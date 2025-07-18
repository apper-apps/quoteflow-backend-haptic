import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import StatCard from "@/components/molecules/StatCard";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { toast } from "react-toastify";
import { quotesService } from "@/services/api/quotesService";
import { productsService } from "@/services/api/productsService";
import { format, subDays, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";

const Reports = () => {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState("month"); // 'week', 'month', 'year'
  const [selectedMetric, setSelectedMetric] = useState("revenue");

  useEffect(() => {
    loadReports();
  }, [dateRange]);

  const loadReports = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [quotes, products] = await Promise.all([
        quotesService.getAll(),
        productsService.getAll()
      ]);

      const now = new Date();
      let startDate, endDate;

      switch (dateRange) {
        case "week":
          startDate = subDays(now, 7);
          endDate = now;
          break;
        case "month":
          startDate = startOfMonth(now);
          endDate = endOfMonth(now);
          break;
        case "year":
          startDate = startOfYear(now);
          endDate = endOfYear(now);
          break;
        default:
          startDate = startOfMonth(now);
          endDate = endOfMonth(now);
      }

      const filteredQuotes = quotes.filter(quote => {
        const quoteDate = new Date(quote.createdAt);
        return quoteDate >= startDate && quoteDate <= endDate;
      });

      // Calculate metrics
      const totalQuotes = filteredQuotes.length;
      const acceptedQuotes = filteredQuotes.filter(q => q.status === "accepted");
      const rejectedQuotes = filteredQuotes.filter(q => q.status === "rejected");
      const pendingQuotes = filteredQuotes.filter(q => q.status === "sent");

      const totalRevenue = acceptedQuotes.reduce((sum, q) => sum + q.totalCustomerCurrency, 0);
      const totalProfit = acceptedQuotes.reduce((sum, q) => {
        const profit = q.items?.reduce((itemSum, item) => {
          const product = products.find(p => p.Id === item.productId);
          if (product) {
            return itemSum + ((item.finalPricePerUnitRMB - product.realCostRMB) * item.quantity);
          }
          return itemSum;
        }, 0) || 0;
        return sum + profit;
      }, 0);

      const acceptanceRate = totalQuotes > 0 ? (acceptedQuotes.length / totalQuotes) * 100 : 0;
      const averageQuoteValue = acceptedQuotes.length > 0 ? totalRevenue / acceptedQuotes.length : 0;

      // Top products by revenue
      const productRevenue = new Map();
      acceptedQuotes.forEach(quote => {
        quote.items?.forEach(item => {
          const product = products.find(p => p.Id === item.productId);
          if (product) {
            const revenue = item.finalPricePerUnitRMB * item.quantity;
            productRevenue.set(product.name, (productRevenue.get(product.name) || 0) + revenue);
          }
        });
      });

      const topProducts = Array.from(productRevenue.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, revenue]) => ({ name, revenue }));

      // Customer performance
      const customerData = new Map();
      filteredQuotes.forEach(quote => {
        if (!customerData.has(quote.customerId)) {
          customerData.set(quote.customerId, {
            totalQuotes: 0,
            acceptedQuotes: 0,
            totalValue: 0
          });
        }
        
        const customer = customerData.get(quote.customerId);
        customer.totalQuotes++;
        
        if (quote.status === "accepted") {
          customer.acceptedQuotes++;
          customer.totalValue += quote.totalCustomerCurrency;
        }
      });

      const topCustomers = Array.from(customerData.entries())
        .sort((a, b) => b[1].totalValue - a[1].totalValue)
        .slice(0, 5)
        .map(([customerId, data]) => ({ customerId, ...data }));

      setReports({
        period: {
          range: dateRange,
          startDate,
          endDate
        },
        metrics: {
          totalQuotes,
          acceptedQuotes: acceptedQuotes.length,
          rejectedQuotes: rejectedQuotes.length,
          pendingQuotes: pendingQuotes.length,
          totalRevenue,
          totalProfit,
          acceptanceRate,
          averageQuoteValue
        },
        topProducts,
        topCustomers
      });
    } catch (err) {
      setError("Failed to load reports");
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  const formatRMB = (amount) => {
    return `¥${amount.toFixed(2)}`;
  };

  if (loading) {
    return <Loading variant="cards" rows={8} />;
  }

  if (error) {
    return <Error message={error} onRetry={loadReports} />;
  }

  if (!reports) {
    return (
      <Empty
        title="No report data available"
        message="Reports are generated from your quotes and products data."
        icon="BarChart3"
        variant="data"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">
            Track your quotation performance and business metrics
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Button
            variant={dateRange === "week" ? "primary" : "outline"}
            onClick={() => setDateRange("week")}
            size="sm"
          >
            Last 7 Days
          </Button>
          <Button
            variant={dateRange === "month" ? "primary" : "outline"}
            onClick={() => setDateRange("month")}
            size="sm"
          >
            This Month
          </Button>
          <Button
            variant={dateRange === "year" ? "primary" : "outline"}
            onClick={() => setDateRange("year")}
            size="sm"
          >
            This Year
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Quotes"
          value={reports.metrics.totalQuotes}
          icon="FileText"
          trend={reports.metrics.totalQuotes > 0 ? "up" : null}
          trendValue={`${reports.metrics.pendingQuotes} pending`}
          gradient
        />
        
        <StatCard
          title="Acceptance Rate"
          value={`${reports.metrics.acceptanceRate.toFixed(1)}%`}
          icon="TrendingUp"
          trend={reports.metrics.acceptanceRate > 50 ? "up" : "down"}
          trendValue={`${reports.metrics.acceptedQuotes} accepted`}
          gradient
        />
        
        <StatCard
          title="Total Revenue"
          value={formatCurrency(reports.metrics.totalRevenue)}
          icon="DollarSign"
          trend={reports.metrics.totalRevenue > 0 ? "up" : null}
          trendValue={`${formatCurrency(reports.metrics.averageQuoteValue)} avg`}
          gradient
        />
        
        <StatCard
          title="Total Profit"
          value={formatRMB(reports.metrics.totalProfit)}
          icon="TrendingUp"
          trend={reports.metrics.totalProfit > 0 ? "up" : null}
          trendValue="Gross profit"
          gradient
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card className="p-6" variant="premium">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Top Products by Revenue</h3>
            <ApperIcon name="Package" className="h-5 w-5 text-primary" />
          </div>
          
          {reports.topProducts.length === 0 ? (
            <div className="text-center py-8">
              <ApperIcon name="Package" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No product data available</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between p-3 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">Product</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">{formatRMB(product.revenue)}</p>
                    <p className="text-sm text-gray-500">Revenue</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Top Customers */}
        <Card className="p-6" variant="premium">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Top Customers by Value</h3>
            <ApperIcon name="Users" className="h-5 w-5 text-primary" />
          </div>
          
          {reports.topCustomers.length === 0 ? (
            <div className="text-center py-8">
              <ApperIcon name="Users" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No customer data available</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.topCustomers.map((customer, index) => (
                <div key={customer.customerId} className="flex items-center justify-between p-3 bg-gradient-to-r from-secondary/5 to-primary/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-secondary to-primary rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{customer.customerId}</p>
                      <p className="text-sm text-gray-500">
                        {customer.totalQuotes} quotes • {Math.round((customer.acceptedQuotes / customer.totalQuotes) * 100)}% accepted
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-secondary">{formatCurrency(customer.totalValue)}</p>
                    <p className="text-sm text-gray-500">Total value</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Quote Status Breakdown */}
      <Card className="p-6" variant="premium">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Quote Status Breakdown</h3>
          <ApperIcon name="PieChart" className="h-5 w-5 text-primary" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gradient-to-r from-success/10 to-green-100 rounded-lg">
            <div className="text-2xl font-bold text-success mb-2">
              {reports.metrics.acceptedQuotes}
            </div>
            <div className="text-sm text-gray-600">Accepted</div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-r from-warning/10 to-yellow-100 rounded-lg">
            <div className="text-2xl font-bold text-warning mb-2">
              {reports.metrics.pendingQuotes}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-r from-error/10 to-red-100 rounded-lg">
            <div className="text-2xl font-bold text-error mb-2">
              {reports.metrics.rejectedQuotes}
            </div>
            <div className="text-sm text-gray-600">Rejected</div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-r from-primary/10 to-blue-100 rounded-lg">
            <div className="text-2xl font-bold text-primary mb-2">
              {reports.metrics.totalQuotes}
            </div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
        </div>
      </Card>

      {/* Export Options */}
      <Card className="p-6 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20" variant="premium">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-primary to-secondary rounded-full">
              <ApperIcon name="Download" className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Export Reports</h3>
              <p className="text-sm text-gray-600">
                Download detailed reports in PDF or Excel format for further analysis.
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" icon="FileText">
              Export PDF
            </Button>
            <Button variant="primary" icon="Download">
              Export Excel
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Reports;