import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MetricCard = ({ title, value }) => (
  <div className="bg-white shadow-md rounded-lg p-4">
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

const App = () => {
  const [ticker, setTicker] = useState('');
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMetrics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/metrics?ticker=${ticker}`);
      setMetrics(response.data);
    } catch (err) {
      setError('Error fetching data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <h1 className="text-2xl font-semibold mb-6">Financial Metrics App</h1>
          <div className="mb-4">
            <input
              type="text"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              placeholder="Enter ticker symbol"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={fetchMetrics}
            disabled={loading || !ticker}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Fetch Metrics'}
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          {metrics && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <MetricCard title="Gross Margin %" value={metrics.grossMarginPercentage.toFixed(2) + '%'} />
              <MetricCard title="Net Operating Margin %" value={metrics.netOperatingMarginPercentage.toFixed(2) + '%'} />
              <MetricCard title="Operating Leverage" value={metrics.operatingLeverage.toFixed(2)} />
              <MetricCard title="Financial Leverage" value={metrics.financialLeverage.toFixed(2)} />
              <MetricCard title="Total Leverage" value={metrics.totalLeverage.toFixed(2)} />
              <MetricCard title="Debt to Equity Ratio" value={metrics.debtToEquityRatio.toFixed(2)} />
              <MetricCard title="Quick Ratio" value={metrics.quickRatio.toFixed(2)} />
              <MetricCard title="Current Ratio" value={metrics.currentRatio.toFixed(2)} />
              <MetricCard title="Return on Equity" value={metrics.returnOnEquity.toFixed(2) + '%'} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
