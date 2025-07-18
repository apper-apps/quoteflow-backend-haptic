import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import TableRow from "@/components/molecules/TableRow";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { quotesService } from "@/services/api/quotesService";
import { format } from "date-fns";

const QuotesList = ({ onQuoteSelect }) => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuote, setSelectedQuote] = useState(null);

  useEffect(() => {
    loadQuotes();
  }, []);

  const loadQuotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await quotesService.getAll();
      setQuotes(data);
    } catch (err) {
      setError("Failed to load quotes");
      toast.error("Failed to load quotes");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount, currency = "RMB") => {
    const symbols = { USD: "$", EUR: "€", GBP: "£", RMB: "¥" };
    return `${symbols[currency] || currency} ${amount.toFixed(2)}`;
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "draft":
        return "default";
      case "sent":
        return "info";
      case "accepted":
        return "success";
      case "rejected":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "draft":
        return "FileText";
      case "sent":
        return "Send";
      case "accepted":
        return "CheckCircle";
      case "rejected":
        return "XCircle";
      default:
        return "FileText";
    }
  };

  const handleQuoteAction = async (quoteId, action) => {
    try {
      const quote = quotes.find(q => q.Id === quoteId);
      let newStatus = quote.status;
      
      switch (action) {
        case "send":
          newStatus = "sent";
          break;
        case "accept":
          newStatus = "accepted";
          break;
        case "reject":
          newStatus = "rejected";
          break;
        default:
          return;
      }
      
      await quotesService.update(quoteId, { ...quote, status: newStatus });
      setQuotes(quotes.map(q => q.Id === quoteId ? { ...q, status: newStatus } : q));
      toast.success(`Quote ${action}ed successfully`);
    } catch (err) {
      toast.error(`Failed to ${action} quote`);
    }
  };

  if (loading) {
    return <Loading variant="table" rows={5} />;
  }

  if (error) {
    return <Error message={error} onRetry={loadQuotes} />;
  }

  if (quotes.length === 0) {
    return (
      <Empty
        title="No quotes found"
        message="Create your first quote to get started with the quotation system."
        actionLabel="Create Quote"
        icon="Plus"
        variant="data"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Quotes</h2>
        <Button variant="primary" icon="Plus">
          New Quote
        </Button>
      </div>

      <Card className="overflow-hidden" variant="premium">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-primary/5 to-secondary/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quote ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {quotes.map((quote) => (
                <TableRow
                  key={quote.Id}
                  selected={selectedQuote === quote.Id}
                  onClick={() => setSelectedQuote(quote.Id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="p-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg mr-3">
                        <ApperIcon name="FileText" className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          QUO-{quote.Id.toString().padStart(4, "0")}
                        </div>
                        <div className="text-sm text-gray-500">
                          {quote.items?.length || 0} item(s)
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {quote.customerId}
                    </div>
                    <div className="text-sm text-gray-500">
                      {quote.currency} • {quote.markupPercentage}% markup
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={getStatusVariant(quote.status)}>
                      <ApperIcon name={getStatusIcon(quote.status)} className="h-3 w-3 mr-1" />
                      {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(quote.totalCustomerCurrency, quote.currency)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatCurrency(quote.totalRMB)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(new Date(quote.createdAt), "MMM dd, yyyy")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {quote.status === "draft" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="Send"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuoteAction(quote.Id, "send");
                          }}
                        >
                          Send
                        </Button>
                      )}
                      {quote.status === "sent" && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            icon="CheckCircle"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuoteAction(quote.Id, "accept");
                            }}
                          >
                            Accept
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            icon="XCircle"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuoteAction(quote.Id, "reject");
                            }}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="Eye"
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuoteSelect?.(quote);
                        }}
                      >
                        View
                      </Button>
                    </div>
                  </td>
                </TableRow>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default QuotesList;