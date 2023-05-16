FROM python:3.8
ADD requirements.txt /
RUN pip install -r requirements.txt
RUN curl -L -o twitter-data.zip https://www.dropbox.com/s/r6l4ke6h858bzph/twitter-huge.json.zip?dl=0
RUN unzip twitter-data.zip
RUN mv $PWD/mnt/ext100/twitter-huge.json  $PWD 
ADD twitterDataConfig.py /
ADD processor.py /
CMD ["python", "processor.py"]