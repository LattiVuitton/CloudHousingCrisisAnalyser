import logging
import os
import subprocess
import time

import sys

rank = int(sys.argv[1])

# Will be permanent for each processor (set at launch)
# rank = 1

# Is an environment variable that can be changed
num_processors = 1

# Create logs folder if it does not exist
logs_folder = os.path.join(os.path.expanduser('~'), 'logs')
os.makedirs(logs_folder, exist_ok=True)

# Configure logging to write to the error log file
logging.basicConfig(filename=os.path.join(logs_folder, 'errors.log'), level=logging.ERROR)
logging.error("Starting distr script.")

counter = 0
while True:

    counter += 1

    if counter == 100000:
        try:
            logging.error("Trying")
            logging.error(str(time.now()))
            print(time.now())
            
            # Source the .bashrc file before checking the environment variable
            subprocess.run(["bash", "-c", "source ~/.bashrc"], shell=False)

            current_value = int(os.environ.get('NUM_PROCESSORS'))
            if current_value != num_processors:
                logging.error("Changing process count")
                num_processors = current_value

        except:
            logging.error("err2: %s", str(1))

        counter = 0
        logging.error("Here")
        logging.error("My rank : %d", rank)
        logging.error("num_processors: %d", num_processors)
        # print("My rank print:", rank)
