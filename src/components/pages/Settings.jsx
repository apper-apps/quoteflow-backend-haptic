import React, { useState } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Quotes from "@/components/pages/Quotes";
import FormField from "@/components/molecules/FormField";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(false);
  
  const [generalSettings, setGeneralSettings] = useState({
    defaultMarkup: 15,
    defaultCurrency: "USD",
    exchangeRates: {
      USD: 7.2,
      EUR: 7.8,
      GBP: 9.1,
      JPY: 0.05
    },
    autoSaveQuotes: true,
    notificationEmail: "admin@quoteflow.com"
  });

  const [visibilitySettings, setVisibilitySettings] = useState({
    customerView: {
      productName: true,
      images: true,
      quantity: true,
      finalPrice: true,
      totalPrice: true,
      specifications: true,
      realCost: false,
      supplierLinks: false,
      markupPercentage: false,
      profitMargin: false
    },
    agentView: {
      productName: true,
      images: true,
      quantity: true,
      finalPrice: true,
      totalPrice: true,
      specifications: true,
      realCost: true,
      supplierLinks: true,
      markupPercentage: true,
      profitMargin: true
    }
  });

  const [systemSettings, setSystemSettings] = useState({
    autoCalculation: true,
    bufferPercentage: 3,
    maxFileSize: 10,
    sessionTimeout: 30,
    backupFrequency: "daily",
    apiIntegration: {
      googleSheets: false,
      supabase: false,
      currencyAPI: true
    }
  });

  const tabs = [
    { id: "general", label: "General", icon: "Settings" },
    { id: "visibility", label: "Visibility Control", icon: "Eye" },
    { id: "system", label: "System", icon: "Cog" },
    { id: "agents", label: "Agents", icon: "Users" }
  ];

  const handleSave = async (section) => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`${section} settings saved successfully!`);
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          type="number"
          label="Default Markup Percentage"
          value={generalSettings.defaultMarkup}
          onChange={(e) => setGeneralSettings({
            ...generalSettings,
            defaultMarkup: parseFloat(e.target.value) || 0
          })}
          step="0.1"
          min="0"
          max="100"
        />
        
        <FormField
          type="select"
          label="Default Currency"
          value={generalSettings.defaultCurrency}
          onChange={(e) => setGeneralSettings({
            ...generalSettings,
            defaultCurrency: e.target.value
          })}
          options={[
            { value: "USD", label: "USD - US Dollar" },
            { value: "EUR", label: "EUR - Euro" },
            { value: "GBP", label: "GBP - British Pound" },
            { value: "JPY", label: "JPY - Japanese Yen" }
          ]}
        />
      </div>

      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-900">Exchange Rates</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(generalSettings.exchangeRates).map(([currency, rate]) => (
            <FormField
              key={currency}
              type="number"
              label={`${currency} Rate`}
              value={rate}
              onChange={(e) => setGeneralSettings({
                ...generalSettings,
                exchangeRates: {
                  ...generalSettings.exchangeRates,
                  [currency]: parseFloat(e.target.value) || 0
                }
              })}
              step="0.01"
              min="0"
            />
          ))}
        </div>
      </div>

      <FormField
        label="Notification Email"
        value={generalSettings.notificationEmail}
        onChange={(e) => setGeneralSettings({
          ...generalSettings,
          notificationEmail: e.target.value
        })}
        type="email"
      />

      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg">
        <div>
          <h5 className="font-medium text-gray-900">Auto-save Quotes</h5>
          <p className="text-sm text-gray-600">Automatically save quote drafts while building</p>
        </div>
        <Button
          variant={generalSettings.autoSaveQuotes ? "primary" : "outline"}
          size="sm"
          onClick={() => setGeneralSettings({
            ...generalSettings,
            autoSaveQuotes: !generalSettings.autoSaveQuotes
          })}
        >
          {generalSettings.autoSaveQuotes ? "Enabled" : "Disabled"}
        </Button>
      </div>

      <div className="flex justify-end">
        <Button
          variant="primary"
          onClick={() => handleSave("General")}
          loading={loading}
        >
          Save General Settings
        </Button>
      </div>
    </div>
  );

  const renderVisibilitySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6" variant="premium">
          <h4 className="text-md font-medium text-gray-900 mb-4">Customer View</h4>
          <div className="space-y-3">
            {Object.entries(visibilitySettings.customerView).map(([field, visible]) => (
              <div key={field} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium text-gray-900 capitalize">
                    {field.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                  <p className="text-sm text-gray-500">
                    {visible ? "Visible to customers" : "Hidden from customers"}
                  </p>
                </div>
                <Button
                  variant={visible ? "success" : "outline"}
                  size="sm"
                  onClick={() => setVisibilitySettings({
                    ...visibilitySettings,
                    customerView: {
                      ...visibilitySettings.customerView,
                      [field]: !visible
                    }
                  })}
                >
                  {visible ? "Visible" : "Hidden"}
                </Button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6" variant="premium">
          <h4 className="text-md font-medium text-gray-900 mb-4">Agent View</h4>
          <div className="space-y-3">
            {Object.entries(visibilitySettings.agentView).map(([field, visible]) => (
              <div key={field} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium text-gray-900 capitalize">
                    {field.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                  <p className="text-sm text-gray-500">
                    {visible ? "Visible to agents" : "Hidden from agents"}
                  </p>
                </div>
                <Button
                  variant={visible ? "success" : "outline"}
                  size="sm"
                  onClick={() => setVisibilitySettings({
                    ...visibilitySettings,
                    agentView: {
                      ...visibilitySettings.agentView,
                      [field]: !visible
                    }
                  })}
                >
                  {visible ? "Visible" : "Hidden"}
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button
          variant="primary"
          onClick={() => handleSave("Visibility")}
          loading={loading}
        >
          Save Visibility Settings
        </Button>
      </div>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          type="number"
          label="Exchange Rate Buffer (%)"
          value={systemSettings.bufferPercentage}
          onChange={(e) => setSystemSettings({
            ...systemSettings,
            bufferPercentage: parseFloat(e.target.value) || 0
          })}
          step="0.1"
          min="0"
          max="10"
        />
        
        <FormField
          type="number"
          label="Max File Size (MB)"
          value={systemSettings.maxFileSize}
          onChange={(e) => setSystemSettings({
            ...systemSettings,
            maxFileSize: parseInt(e.target.value) || 0
          })}
          min="1"
          max="100"
        />
        
        <FormField
          type="number"
          label="Session Timeout (minutes)"
          value={systemSettings.sessionTimeout}
          onChange={(e) => setSystemSettings({
            ...systemSettings,
            sessionTimeout: parseInt(e.target.value) || 0
          })}
          min="5"
          max="240"
        />
        
        <FormField
          type="select"
          label="Backup Frequency"
          value={systemSettings.backupFrequency}
          onChange={(e) => setSystemSettings({
            ...systemSettings,
            backupFrequency: e.target.value
          })}
          options={[
            { value: "hourly", label: "Hourly" },
            { value: "daily", label: "Daily" },
            { value: "weekly", label: "Weekly" },
            { value: "monthly", label: "Monthly" }
          ]}
        />
      </div>

      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-900">API Integrations</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(systemSettings.apiIntegration).map(([api, enabled]) => (
            <div key={api} className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg">
              <div>
                <h5 className="font-medium text-gray-900 capitalize">{api}</h5>
                <p className="text-sm text-gray-600">
                  {enabled ? "Connected" : "Disconnected"}
                </p>
              </div>
              <Badge variant={enabled ? "success" : "error"}>
                {enabled ? "Active" : "Inactive"}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          variant="primary"
          onClick={() => handleSave("System")}
          loading={loading}
        >
          Save System Settings
        </Button>
      </div>
    </div>
  );

  const renderAgentSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6" variant="premium">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-medium text-gray-900">Admin Agent</h4>
            <Badge variant="primary">Active</Badge>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">System Configuration</span>
              <ApperIcon name="CheckCircle" className="h-4 w-4 text-success" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Visibility Control</span>
              <ApperIcon name="CheckCircle" className="h-4 w-4 text-success" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Role Management</span>
              <ApperIcon name="CheckCircle" className="h-4 w-4 text-success" />
            </div>
          </div>
        </Card>

        <Card className="p-6" variant="premium">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-medium text-gray-900">Quotation Agent</h4>
            <Badge variant="success">Active</Badge>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Product Data Collection</span>
              <ApperIcon name="CheckCircle" className="h-4 w-4 text-success" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Supplier Management</span>
              <ApperIcon name="CheckCircle" className="h-4 w-4 text-success" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Quote Creation</span>
              <ApperIcon name="CheckCircle" className="h-4 w-4 text-success" />
            </div>
          </div>
        </Card>

        <Card className="p-6" variant="premium">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-medium text-gray-900">AI Extraction Agent</h4>
            <Badge variant="info">Active</Badge>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Link Processing</span>
              <ApperIcon name="CheckCircle" className="h-4 w-4 text-success" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Data Extraction</span>
              <ApperIcon name="CheckCircle" className="h-4 w-4 text-success" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Auto-Population</span>
              <ApperIcon name="CheckCircle" className="h-4 w-4 text-success" />
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6" variant="premium">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-md font-medium text-gray-900">Agent Performance</h4>
          <Button variant="outline" size="sm" icon="RefreshCw">
            Refresh Stats
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gradient-to-r from-primary/10 to-blue-100 rounded-lg">
            <div className="text-2xl font-bold text-primary mb-2">98.5%</div>
<div className="text-sm text-gray-600">System Uptime</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-r from-success/10 to-green-100 rounded-lg">
            <div className="text-2xl font-bold text-success mb-2">247</div>
            <div className="text-sm text-gray-600">Tasks Completed</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-r from-secondary/10 to-purple-100 rounded-lg">
            <div className="text-2xl font-bold text-secondary mb-2">&lt; 2s</div>
            <div className="text-sm text-gray-600">Avg Response Time</div>
          </div>
</div>
      </Card>

      <div className="flex justify-end">
        <Button
          variant="primary"
          onClick={() => handleSave("Agent")}
          loading={loading}
        >
          Save Agent Settings
        </Button>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return renderGeneralSettings();
      case "visibility":
        return renderVisibilitySettings();
      case "system":
        return renderSystemSettings();
      case "agents":
        return renderAgentSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Settings</h1>
        <p className="text-gray-600 mt-1">
          Configure your multi-agent quotation system
        </p>
      </div>

      <div className="flex space-x-1 p-1 bg-gray-100 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 flex-1 justify-center",
              activeTab === tab.id
                ? "bg-white text-primary shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            <ApperIcon name={tab.icon} className="h-4 w-4" />
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      <Card className="p-6" variant="premium">
        {renderTabContent()}
      </Card>
    </div>
  );
};

export default Settings;