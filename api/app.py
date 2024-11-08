from flask import Flask, request, jsonify
from sec_api import QueryApi
import os

app = Flask(__name__)

# Replace with your actual SEC API key
SEC_API_KEY = os.environ.get('SEC_API_KEY', 'your_sec_api_key_here')
queryApi = QueryApi(api_key=SEC_API_KEY)

def fetch_financial_data(ticker):
    query = {
        "query": {
            "query_string": {
                "query": f"ticker:{ticker} AND formType:\"10-Q\""
            }
        },
        "from": "0",
        "size": "4",
        "sort": [{"filedAt": {"order": "desc"}}]
    }

    response = queryApi.get_filings(query)
    filings = response['filings']

    # Process the filings and calculate metrics
    # This is a simplified example and may need to be adjusted based on the actual data structure
    metrics = {
        'grossMarginPercentage': 0,
        'netOperatingMarginPercentage': 0,
        'operatingLeverage': 0,
        'financialLeverage': 0,
        'totalLeverage': 0,
        'debtToEquityRatio': 0,
        'quickRatio': 0,
        'currentRatio': 0,
        'returnOnEquity': 0
    }

    for filing in filings:
        # Extract relevant financial data from the filing
        # This is a placeholder and should be replaced with actual data extraction logic
        sales = filing.get('sales', 0)
        cogs = filing.get('costOfGoodsSold', 0)
        ebit = filing.get('ebit', 0)
        totalLiabilities = filing.get('totalLiabilities', 0)
        totalEquity = filing.get('totalEquity', 0)
        currentAssets = filing.get('currentAssets', 0)
        currentLiabilities = filing.get('currentLiabilities', 0)
        netIncome = filing.get('netIncome', 0)

        # Calculate metrics
        metrics['grossMarginPercentage'] += (sales - cogs) / sales if sales else 0
        metrics['netOperatingMarginPercentage'] += ebit / sales if sales else 0
        metrics['debtToEquityRatio'] += totalLiabilities / totalEquity if totalEquity else 0
        metrics['quickRatio'] += (currentAssets - filing.get('inventory', 0)) / currentLiabilities if currentLiabilities else 0
        metrics['currentRatio'] += currentAssets / currentLiabilities if currentLiabilities else 0
        metrics['returnOnEquity'] += netIncome / totalEquity if totalEquity else 0

    # Average the metrics over the 4 quarters
    for key in metrics:
        metrics[key] /= len(filings)

    return metrics

@app.route('/api/metrics')
def get_metrics():
    ticker = request.args.get('ticker')
    if not ticker:
        return jsonify({"error": "Ticker is required"}), 400

    try:
        metrics = fetch_financial_data(ticker)
        return jsonify(metrics)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
