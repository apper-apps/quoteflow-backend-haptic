import React, { useState } from "react";
import QuoteBuilder from "@/components/organisms/QuoteBuilder";
import QuotesList from "@/components/organisms/QuotesList";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Quotes = () => {
  const [view, setView] = useState("list"); // 'list' or 'builder'
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleQuoteCreated = () => {
    setRefreshTrigger(prev => prev + 1);
    setView("list");
  };

  const handleQuoteSelect = (quote) => {
    // Handle quote selection for detailed view
    console.log("Selected quote:", quote);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Quotes Management</h1>
          <p className="text-gray-600 mt-1">
            Create, manage, and track your quotations
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Button
            variant={view === "list" ? "primary" : "outline"}
            icon="List"
            onClick={() => setView("list")}
          >
            View Quotes
          </Button>
          <Button
            variant={view === "builder" ? "primary" : "outline"}
            icon="Plus"
            onClick={() => setView("builder")}
          >
            New Quote
          </Button>
        </div>
      </div>

      {view === "builder" ? (
        <QuoteBuilder onQuoteCreated={handleQuoteCreated} />
      ) : (
        <QuotesList key={refreshTrigger} onQuoteSelect={handleQuoteSelect} />
      )}

      {view === "list" && (
        <Card className="p-6 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20" variant="premium">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-primary to-secondary rounded-full">
                <ApperIcon name="Lightbulb" className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Pro Tips for Better Quotes</h3>
                <p className="text-sm text-gray-600">
                  Use competitive markup rates and detailed product descriptions to increase acceptance rates.
                </p>
              </div>
            </div>
            <Button variant="ghost" icon="ExternalLink">
              Learn More
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Quotes;