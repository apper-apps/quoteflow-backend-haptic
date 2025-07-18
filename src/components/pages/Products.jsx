import React, { useState } from "react";
import ProductCatalog from "@/components/organisms/ProductCatalog";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";
import { productsService } from "@/services/api/productsService";

const Products = () => {
  const [view, setView] = useState("catalog"); // 'catalog' or 'add'
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    supplierLinks: [""],
    realCostRMB: 0,
    quotationBaseRMB: 0,
    realDomesticShippingRMB: 0,
    quotedDomesticShippingRMB: 0,
    realInternationalShippingRMB: 0,
    quotedInternationalShippingRMB: 0,
    specifications: {
      category: "",
      dimensions: "",
      weight: ""
    },
    supplierNotes: ""
  });

  const handleInputChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSupplierLinkChange = (index, value) => {
    const newLinks = [...formData.supplierLinks];
    newLinks[index] = value;
    setFormData(prev => ({ ...prev, supplierLinks: newLinks }));
  };

  const addSupplierLink = () => {
    setFormData(prev => ({
      ...prev,
      supplierLinks: [...prev.supplierLinks, ""]
    }));
  };

  const removeSupplierLink = (index) => {
    const newLinks = formData.supplierLinks.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, supplierLinks: newLinks }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Product name is required");
      return;
    }

    setLoading(true);
    
    try {
      const productData = {
        ...formData,
        supplierLinks: formData.supplierLinks.filter(link => link.trim()),
        images: [] // Could be extended to handle image uploads
      };

      await productsService.create(productData);
      
      toast.success("Product added successfully!");
      
      // Reset form
      setFormData({
        name: "",
        supplierLinks: [""],
        realCostRMB: 0,
        quotationBaseRMB: 0,
        realDomesticShippingRMB: 0,
        quotedDomesticShippingRMB: 0,
        realInternationalShippingRMB: 0,
        quotedInternationalShippingRMB: 0,
        specifications: {
          category: "",
          dimensions: "",
          weight: ""
        },
        supplierNotes: ""
      });
      
      setRefreshTrigger(prev => prev + 1);
      setView("catalog");
    } catch (error) {
      toast.error("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const productCategories = [
    { value: "electronics", label: "Electronics" },
    { value: "clothing", label: "Clothing & Apparel" },
    { value: "home", label: "Home & Garden" },
    { value: "sports", label: "Sports & Outdoors" },
    { value: "automotive", label: "Automotive" },
    { value: "industrial", label: "Industrial" },
    { value: "other", label: "Other" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Products Management</h1>
          <p className="text-gray-600 mt-1">
            Manage your product catalog and supplier information
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Button
            variant={view === "catalog" ? "primary" : "outline"}
            icon="Package"
            onClick={() => setView("catalog")}
          >
            View Catalog
          </Button>
          <Button
            variant={view === "add" ? "primary" : "outline"}
            icon="Plus"
            onClick={() => setView("add")}
          >
            Add Product
          </Button>
        </div>
      </div>

      {view === "add" ? (
        <Card className="p-6" variant="premium">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Add New Product</h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Product Name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter product name"
                required
              />
              
              <FormField
                type="select"
                label="Category"
                value={formData.specifications.category}
                onChange={(e) => handleInputChange("specifications.category", e.target.value)}
                options={productCategories}
                placeholder="Select category"
              />
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Supplier Links
              </label>
              {formData.supplierLinks.map((link, index) => (
                <div key={index} className="flex space-x-2">
                  <FormField
                    value={link}
                    onChange={(e) => handleSupplierLinkChange(index, e.target.value)}
                    placeholder="https://supplier-link.com"
                    className="flex-1"
                  />
                  {formData.supplierLinks.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      icon="X"
                      onClick={() => removeSupplierLink(index)}
                      className="text-error"
                    />
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                icon="Plus"
                onClick={addSupplierLink}
              >
                Add Supplier Link
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-900">Real Costs (Internal)</h4>
                <FormField
                  type="number"
                  label="Real Product Cost (RMB)"
                  value={formData.realCostRMB}
                  onChange={(e) => handleInputChange("realCostRMB", parseFloat(e.target.value) || 0)}
                  step="0.01"
                  min="0"
                  required
                />
                <FormField
                  type="number"
                  label="Real Domestic Shipping (RMB)"
                  value={formData.realDomesticShippingRMB}
                  onChange={(e) => handleInputChange("realDomesticShippingRMB", parseFloat(e.target.value) || 0)}
                  step="0.01"
                  min="0"
                />
                <FormField
                  type="number"
                  label="Real International Shipping (RMB)"
                  value={formData.realInternationalShippingRMB}
                  onChange={(e) => handleInputChange("realInternationalShippingRMB", parseFloat(e.target.value) || 0)}
                  step="0.01"
                  min="0"
                />
              </div>

              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-900">Quotation Base</h4>
                <FormField
                  type="number"
                  label="Quotation Base Price (RMB)"
                  value={formData.quotationBaseRMB}
                  onChange={(e) => handleInputChange("quotationBaseRMB", parseFloat(e.target.value) || 0)}
                  step="0.01"
                  min="0"
                  required
                />
                <FormField
                  type="number"
                  label="Quoted Domestic Shipping (RMB)"
                  value={formData.quotedDomesticShippingRMB}
                  onChange={(e) => handleInputChange("quotedDomesticShippingRMB", parseFloat(e.target.value) || 0)}
                  step="0.01"
                  min="0"
                />
                <FormField
                  type="number"
                  label="Quoted International Shipping (RMB)"
                  value={formData.quotedInternationalShippingRMB}
                  onChange={(e) => handleInputChange("quotedInternationalShippingRMB", parseFloat(e.target.value) || 0)}
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                label="Dimensions"
                value={formData.specifications.dimensions}
                onChange={(e) => handleInputChange("specifications.dimensions", e.target.value)}
                placeholder="L x W x H"
              />
              <FormField
                label="Weight"
                value={formData.specifications.weight}
                onChange={(e) => handleInputChange("specifications.weight", e.target.value)}
                placeholder="e.g., 2.5 kg"
              />
            </div>

            <FormField
              label="Supplier Notes"
              value={formData.supplierNotes}
              onChange={(e) => handleInputChange("supplierNotes", e.target.value)}
              placeholder="Additional notes about the supplier or product"
            />

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setView("catalog")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={loading}
              >
                Add Product
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        <ProductCatalog key={refreshTrigger} />
      )}

      {view === "catalog" && (
        <Card className="p-6 bg-gradient-to-r from-secondary/5 to-primary/5 border-secondary/20" variant="premium">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-secondary to-primary rounded-full">
                <ApperIcon name="Package" className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Product Management Tips</h3>
                <p className="text-sm text-gray-600">
                  Keep accurate supplier links and cost information to ensure profitable quotes.
                </p>
              </div>
            </div>
            <Button variant="ghost" icon="ExternalLink">
              Best Practices
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Products;