import yfinance as yf
import json

# Create a ticker object for each asset
TICKERS = [

    # Australian Economy
    (yf.Ticker("^AORD"), "All Ordinaries"),
    (yf.Ticker("^AXJO"), "ASX 200"),
    (yf.Ticker("AUDUSD=X"), "Aussie Dollar"),

    # Global Economy
    (yf.Ticker("^GSPC"), "S&P 500"),
    (yf.Ticker("^DJI"), "Dow Jones Industrial Average"),
    (yf.Ticker("^FTSE"), "FTSE 100"),
    (yf.Ticker("^N225"), "Nikkei 225"),

    # Misc
    (yf.Ticker("BTC-USD"), "Bitcoin"),
    (yf.Ticker("GC=F"), "Gold Price")
]

# Set the start and end dates for the data
start_date = "2022-05-17"
end_date = "2023-05-17"

# Iterate over the tickers and retrieve the data
for ticker_tuple in TICKERS:

    data = ticker_tuple[0].history(start=start_date, end=end_date, interval="1h")

    # Create a list to hold the data for each day
    price_history = []

    # Iterate over each row in the data and extract the required information
    for index, row in data.iterrows():
        date = index.strftime("%Y-%m-%d")
        closing_price = row["Close"]
        price_history.append({"date": date, "closingPrice": closing_price})

    # Create a dictionary to store the data for each ticker
    ticker_data = {
        "Ticker Code":ticker_tuple[0].ticker,
        "Description":ticker_tuple[1],
        "Price History":price_history  
    }

    # Convert the dictionary to JSON format
    json_str = json.dumps(ticker_data, indent=4)

# # Save the JSON data to a file
filename = "stock_data.json"
with open(filename, "w") as file:
    file.write(json_str)

print(f"Stock data saved to {filename}")