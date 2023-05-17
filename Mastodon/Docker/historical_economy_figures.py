import yfinance as yf

# Create a ticker object for each asset
TICKERS = [

    # Australian Economy
    yf.Ticker("^AORD"),     # All Ordinaries
    yf.Ticker("^AXJO"),     # ASX 200
    yf.Ticker("AUDUSD=X"),  # Aussie Dollar

    # Global Economy
    yf.Ticker("^GSPC"), # S&P 500
    yf.Ticker("^DJI"),  # Dow Jones Industrial Average
    yf.Ticker("^FTSE"), # FTSE 100
    yf.Ticker("^N225"), # Nikkei 225

    # Misc
    yf.Ticker("BTC-USD"), # Bitcoin
    yf.Ticker("GC=F")    # Gold Price
]

# Set the start and end dates for the data
start_date = "2022-05-17"
end_date = "2023-05-17"

# Define the interval for data retrieval
interval = "1h"  # Daily data

# Download the data for each ticker
for ticker in TICKERS[:1]:
    data = ticker.history(start=start_date, end=end_date, interval=interval)
    print(f"Stock data for ticker '{ticker.ticker}': '{len(data)}'")

print("\n")
for line in data['Close']:
    print(line)