# Cloud Housing Crisis Analyser
## For COMP90024

Check out our project: http://172.26.136.103:3000/

This repository contains the source code for the report on the Australian Economy and Housing Sentiment Analyser. The report was created as part of COMP90024 Cluster and Cloud Computing Assignment 2.

Overview
The report investigates the overall Australian sentiment on housing and the economy amidst post-COVID recovery. The analysis is based on data from Twitter, Mastodon, and SUDO, with an emphasis on the time frame between February to August 2022.

The report is divided into three main sections:

Scenarios and Findings - This section presents the findings of the analysis, organized by scenario.
User Guide - This section provides instructions on how to deploy and use the system.
System Design and Architecture - This section provides a detailed overview of the system design and architecture.
Requirements
To deploy and use the system, you will need the following:

A computer with a recent version of Python installed.
The following Python packages:
ansible
numpy
pandas
matplotlib
nltk
couchdb
A Mastodon account.

System Design and Architecture
The system is designed to be scalable and fault-tolerant. The system is deployed on a cluster of Docker containers. The CouchDB database is also deployed on a cluster of nodes. This architecture allows the system to handle large amounts of data and to continue to operate even if some of the components fail.

The system is designed to be easy to use. The user interface is simple and intuitive. The system also provides a detailed report of the analysis results.

Coding
The system is coded in Python for the harvesters, with a Node.js backend and a React.js front end. The following Python packages are used:

numpy: For mathematical operations
pandas: For data manipulation
matplotlib: For data visualization
nltk: For natural language processing
couchdb: For database access
ansible: For deployment
The system is divided into two main components:

The data processing component: This component is responsible for collecting data from Twitter, Mastodon, and SUDO, and processing it into a format that can be analyzed.
The analysis component: This component is responsible for analyzing the data and generating the results of the analysis.

Outcomes of the Report
