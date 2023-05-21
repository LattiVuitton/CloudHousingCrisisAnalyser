import yfinance as yf
import json
import couchdb
import traceback

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
start_date = "2022-01-01"
end_date = "2023-05-17"

# CouchDB info
db_url = 'http://admin:password@172.26.132.178:5984/'
dbname = 'economic_data'

def pushToCouch(json_string):
    """
    Inserts a document into a CouchDB database.

    Args:
        data: A JSON string containing the data to be inserted into CouchDB.
        
    Returns:
        None
    """
    
    try:
        # Connect to the CouchDB server using the given URL and credentials
        server = couchdb.Server(db_url)
    except:
        print("Failed to connect to server")

    try:
        # Select the database to use
        db = server[dbname]

        # Save the data to the database
        db.save(json.loads(json_string))

    # Handle any other error
    except Exception:
        print("Failed to push to CouchDB")
        traceback.print_exc()

def main_function():

    """
    Inserts historical data within the specified time period for tickers given
    into CouchDB.

    """

    # Iterate over the tickers and retrieve the data
    for ticker_tuple in TICKERS:

        data = ticker_tuple[0].history(
            start=start_date, 
            end=end_date, 
            interval="1h"
        )

        # Create a list to hold the data for each day
        price_history = []

        # Iterate over each row in the data and extract the required information
        for index, row in data.iterrows():

            date = index.strftime("%Y-%m-%d")
            hour = index.strftime("%H")
            closing_price = row["Close"]
            price_history.append({"date": date, "hour": hour, "closingPrice": closing_price})

        # Create a dictionary to store the data for each ticker
        ticker_data = {
            "Ticker Code":ticker_tuple[0].ticker,
            "Description":ticker_tuple[1],
            "Price History":price_history  
        }

        # Convert the dictionary to JSON format
        json_str = json.dumps(ticker_data, indent=4)

        pushToCouch(json_str)
        print("Stock data saved to Couch: ", ticker_data['Description'])
    
    print("Completed data push")

main_function()