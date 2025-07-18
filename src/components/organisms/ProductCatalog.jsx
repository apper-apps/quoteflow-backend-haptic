import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { productsService } from "@/services/api/productsService";

const ProductCatalog = ({ onProductSelect, selectionMode = false }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productsService.getAll();
      setProducts(data);
    } catch (err) {
      setError("Failed to load products");
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    if (!searchTerm) {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.specifications?.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.supplierNotes?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const formatCurrency = (amount, currency = "RMB") => {
    const symbols = { USD: "$", EUR: "€", GBP: "£", RMB: "¥" };
    return `${symbols[currency] || currency} ${amount.toFixed(2)}`;
  };

  const getSupplierBadge = (links) => {
    if (!links || links.length === 0) return null;
    
    const firstLink = links[0];
    if (firstLink.includes("1688")) return "1688";
    if (firstLink.includes("alibaba")) return "Alibaba";
    if (firstLink.includes("aliexpress")) return "AliExpress";
    return "Supplier";
  };

  if (loading) {
    return <Loading variant="cards" rows={6} />;
  }

  if (error) {
    return <Error message={error} onRetry={loadProducts} />;
  }

  if (products.length === 0) {
    return (
      <Empty
        title="No products found"
        message="Start by adding products to your catalog to build quotes."
        actionLabel="Add Product"
        icon="Package"
        variant="data"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-bold text-gray-900">Product Catalog</h2>
        <div className="w-full sm:w-80">
          <SearchBar
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClear={() => setSearchTerm("")}
          />
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <Empty
          title="No products match your search"
          message="Try adjusting your search criteria or browse all products."
          actionLabel="Clear Search"
          onAction={() => setSearchTerm("")}
          icon="Search"
          variant="search"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card
              key={product.Id}
              className={`overflow-hidden transition-all duration-200 ${
                selectionMode ? "cursor-pointer hover:shadow-premium-hover hover:scale-[1.02]" : ""
              }`}
              onClick={selectionMode ? () => onProductSelect(product) : undefined}
              variant="premium"
            >
              <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-gray-100 to-gray-200">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                    <ApperIcon name="Package" className="h-12 w-12 text-primary" />
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {product.name}
                  </h3>
                  {getSupplierBadge(product.supplierLinks) && (
                    <Badge variant="info" size="sm">
                      {getSupplierBadge(product.supplierLinks)}
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Base Price</span>
                    <span className="font-semibold text-primary">
                      {formatCurrency(product.quotationBaseRMB)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Shipping</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(product.quotedDomesticShippingRMB + product.quotedInternationalShippingRMB)}
                    </span>
                  </div>
                  
                  {product.specifications?.category && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Category</span>
                      <Badge variant="secondary" size="sm">
                        {product.specifications.category}
                      </Badge>
                    </div>
                  )}
                </div>
                
                {product.supplierNotes && (
                  <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                    {product.supplierNotes}
                  </p>
                )}
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {product.supplierLinks?.length || 0} supplier(s)
                    </span>
                    {selectionMode ? (
                      <Button variant="ghost" size="sm" icon="Plus">
                        Add to Quote
                      </Button>
                    ) : (
                      <Button variant="ghost" size="sm" icon="ExternalLink">
                        View Details
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductCatalog;