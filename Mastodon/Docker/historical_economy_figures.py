import yfinance as yf

# Create a ticker object for each asset
TICKERS = [

    # Australian Economy
    yf.Ticker("^AORD"),     # All Ordinaries
    yf.Ticker("^AXJO"),     # ASX 200
    yf.Ticker("^AUDUSD=X"), # Aussie Dollar

    # Global Economy
    yf.Ticker("^GSPC"), # S&P 500
    yf.Ticker("^DJI"),  # Dow Jones Industrial Average
    yf.Ticker("FTSE"),  # FTSE 100
    yf.Ticker("^N225"), # Nikkei 225

    # Misc
    yf.Ticker("BTC-USD"), # Bitcoin
    yf.Ticker("XAU=X"),   # Gold Price
    yf.Ticker("DXY"),     # American Dollar
]
