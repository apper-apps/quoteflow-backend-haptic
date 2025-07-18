import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";
import { quotesService } from "@/services/api/quotesService";
import { productsService } from "@/services/api/productsService";

const QuoteBuilder = ({ onQuoteCreated }) => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [quoteData, setQuoteData] = useState({
    customerId: "",
    currency: "USD",
    markupPercentage: 15,
    exchangeRate: 7.2
  });
  const [loading, setLoading] = useState(false);
  const [calculations, setCalculations] = useState({
    totalRMB: 0,
    totalCustomerCurrency: 0,
    totalProfit: 0
  });

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    calculateTotals();
  }, [selectedProducts, quoteData]);

  const loadProducts = async () => {
    try {
      const productsData = await productsService.getAll();
      setProducts(productsData);
    } catch (error) {
      toast.error("Failed to load products");
    }
  };

  const calculateTotals = () => {
    let totalRMB = 0;
    let totalProfit = 0;

    selectedProducts.forEach(item => {
      const product = products.find(p => p.Id === item.productId);
      if (product) {
        const markupMultiplier = 1 + (quoteData.markupPercentage / 100);
        const finalProductPrice = product.quotationBaseRMB * markupMultiplier;
        const finalShippingPrice = (product.quotedDomesticShippingRMB + product.quotedInternationalShippingRMB) * markupMultiplier;
        
        const itemTotal = (finalProductPrice * item.quantity) + finalShippingPrice;
        totalRMB += itemTotal;
        
        const productProfit = (finalProductPrice - product.realCostRMB) * item.quantity;
        const shippingProfit = finalShippingPrice - (product.realDomesticShippingRMB + product.realInternationalShippingRMB);
        totalProfit += productProfit + shippingProfit;
      }
    });

    const exchangeRateWithBuffer = quoteData.exchangeRate * 1.03;
    const totalCustomerCurrency = totalRMB / exchangeRateWithBuffer;

    setCalculations({
      totalRMB,
      totalCustomerCurrency,
      totalProfit
    });
  };

  const addProduct = (productId) => {
    if (selectedProducts.find(item => item.productId === productId)) {
      toast.error("Product already added to quote");
      return;
    }

    setSelectedProducts([
      ...selectedProducts,
      { productId, quantity: 1 }
    ]);
  };

  const updateQuantity = (productId, quantity) => {
    setSelectedProducts(selectedProducts.map(item =>
      item.productId === productId ? { ...item, quantity: Math.max(1, quantity) } : item
    ));
  };

  const removeProduct = (productId) => {
    setSelectedProducts(selectedProducts.filter(item => item.productId !== productId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedProducts.length === 0) {
      toast.error("Please add at least one product to the quote");
      return;
    }

    setLoading(true);
    
    try {
      const quoteItems = selectedProducts.map(item => {
        const product = products.find(p => p.Id === item.productId);
        const markupMultiplier = 1 + (quoteData.markupPercentage / 100);
        const finalPricePerUnitRMB = product.quotationBaseRMB * markupMultiplier;
        const finalShippingRMB = (product.quotedDomesticShippingRMB + product.quotedInternationalShippingRMB) * markupMultiplier;
        
        return {
          productId: item.productId,
          quantity: item.quantity,
          finalPricePerUnitRMB,
          finalShippingRMB,
          profitMargin: ((finalPricePerUnitRMB - product.realCostRMB) / finalPricePerUnitRMB) * 100
        };
      });

      const quote = {
        customerId: quoteData.customerId,
        currency: quoteData.currency,
        exchangeRate: quoteData.exchangeRate,
        markupPercentage: quoteData.markupPercentage,
        items: quoteItems,
        totalRMB: calculations.totalRMB,
        totalCustomerCurrency: calculations.totalCustomerCurrency,
        status: "draft"
      };

      await quotesService.create(quote);
      
      toast.success("Quote created successfully!");
      
      // Reset form
      setSelectedProducts([]);
      setQuoteData({
        customerId: "",
        currency: "USD",
        markupPercentage: 15,
        exchangeRate: 7.2
      });
      
      if (onQuoteCreated) {
        onQuoteCreated();
      }
    } catch (error) {
      toast.error("Failed to create quote");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount, currency = "RMB") => {
    const symbols = { USD: "$", EUR: "€", GBP: "£", RMB: "¥" };
    return `${symbols[currency] || currency} ${amount.toFixed(2)}`;
  };

  return (
    <div className="space-y-6">
      <Card className="p-6" variant="premium">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">New Quote</h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <FormField
              label="Customer ID"
              value={quoteData.customerId}
              onChange={(e) => setQuoteData({ ...quoteData, customerId: e.target.value })}
              placeholder="CUST-001"
              required
            />
            
            <FormField
              type="select"
              label="Currency"
              value={quoteData.currency}
              onChange={(e) => setQuoteData({ ...quoteData, currency: e.target.value })}
              options={[
                { value: "USD", label: "USD - US Dollar" },
                { value: "EUR", label: "EUR - Euro" },
                { value: "GBP", label: "GBP - British Pound" },
                { value: "JPY", label: "JPY - Japanese Yen" }
              ]}
              required
            />
            
            <FormField
              type="number"
              label="Markup %"
              value={quoteData.markupPercentage}
              onChange={(e) => setQuoteData({ ...quoteData, markupPercentage: parseFloat(e.target.value) || 0 })}
              min="0"
              max="100"
              step="0.1"
              required
            />
            
            <FormField
              type="number"
              label="Exchange Rate"
              value={quoteData.exchangeRate}
              onChange={(e) => setQuoteData({ ...quoteData, exchangeRate: parseFloat(e.target.value) || 0 })}
              step="0.01"
              min="0"
              required
            />
          </div>

          {/* Product Selection */}
          <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-900">Add Products</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-60 overflow-y-auto">
              {products.map((product) => (
                <Card
                  key={product.Id}
                  className="p-4 cursor-pointer hover:shadow-lg transition-all"
                  onClick={() => addProduct(product.Id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">{product.name}</h5>
                      <p className="text-sm text-gray-600">{formatCurrency(product.quotationBaseRMB)}</p>
                    </div>
                    <ApperIcon name="Plus" className="h-5 w-5 text-primary" />
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Selected Products */}
          {selectedProducts.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-900">Selected Products</h4>
              <div className="space-y-3">
                {selectedProducts.map((item) => {
                  const product = products.find(p => p.Id === item.productId);
                  if (!product) return null;

                  const markupMultiplier = 1 + (quoteData.markupPercentage / 100);
                  const finalPrice = product.quotationBaseRMB * markupMultiplier;
                  const subtotal = finalPrice * item.quantity;

                  return (
                    <Card key={item.productId} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">{product.name}</h5>
                          <p className="text-sm text-gray-600">
                            {formatCurrency(finalPrice)} × {item.quantity} = {formatCurrency(subtotal)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 1)}
                            className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                            min="1"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            icon="X"
                            onClick={() => removeProduct(item.productId)}
                            className="text-error hover:text-error"
                          />
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Calculations */}
          {selectedProducts.length > 0 && (
            <Card className="p-6 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Quote Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Total (RMB)</p>
                  <p className="text-2xl font-bold text-primary animate-number">
                    {formatCurrency(calculations.totalRMB)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Total ({quoteData.currency})</p>
                  <p className="text-2xl font-bold gradient-text animate-number">
                    {formatCurrency(calculations.totalCustomerCurrency, quoteData.currency)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Profit</p>
                  <p className="text-2xl font-bold text-success animate-number">
                    {formatCurrency(calculations.totalProfit)}
                  </p>
                </div>
              </div>
            </Card>
          )}

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setSelectedProducts([]);
                setQuoteData({
                  customerId: "",
                  currency: "USD",
                  markupPercentage: 15,
                  exchangeRate: 7.2
                });
              }}
            >
              Clear
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              disabled={selectedProducts.length === 0}
            >
              Create Quote
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default QuoteBuilder;