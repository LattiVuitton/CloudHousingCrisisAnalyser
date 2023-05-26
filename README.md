# Cloud Housing Crisis Analyser
## For COMP90024

Check out our project: http://172.26.136.103:3000/

Video Link: https://www.youtube.com/watch?v=Q2B4XuQ-8Lc

Report: [Group 49](./Group%2049%20Assignment%202%20Final%20Report.pdf)

This repository contains the source code for the report on the Australian Economy and Housing Sentiment Analyser. The report was created as part of COMP90024 Cluster and Cloud Computing Assignment 2.

## Overview

The report investigates the overall Australian sentiment on housing and the economy amidst post-COVID recovery. The analysis is based on data from Twitter, Mastodon, and SUDO, with an emphasis on the time frame between February to August 2022.

The report is divided into three main sections:

- Scenarios and Findings - This section presents the findings of the analysis, organized by scenario.
- User Guide - This section provides instructions on how to deploy and use the system.
- System Design and Architecture - This section provides a detailed overview of the system design and architecture.

## System Deployment
1. Ensure ansible is installed
2. Clone repository
3. Update ip of instances under ansible/hosts if required
4. Run `cd ansible`
5. Run `./setup-environment.sh`
6. From ansible/deploy-applications.sh, uncomment relevant parts to:
  - Deploy CouchDB containers
  - Setup CouchDB clusters
  - Run Twitter, SUDO, and Yahoo Finance data processing
  - Deploy SWARM services
7. Run `./deploy-applications.sh`

## Scaling Instructions
1. From the project root directory, run cd ansible
2. To scale CouchDB clusters run `./scale-couchdb-cluster.sh`
- Note: You will need to configure the scale number for the service you want to replicate in deploy-swarm-service.yaml under roles.
3. To scale SWARM services run `./scale-swarm-services.sh`


## System Design and Architecture
The system is designed to be scalable and fault-tolerant. and is deployed on a cluster of Docker containers. The CouchDB database is also deployed on a cluster of nodes. This architecture allows the system to handle large amounts of data and to continue to operate even if some of the components fail. It is also designed with user experience in mind and is easy to use with simple and intuitive user interface. For more details please refer to submitted [report](./Group%2049%20Assignment%202%20Final%20Report.pdf).

## Coding
Largely, the system is divided into two main components:
- The data processing component: This component is responsible for collecting data from Twitter, Mastodon, and SUDO, and processing it into a format that can be analyzed.
- The analysis component: This component is responsible for analyzing the data and generating the results of the analysis.

The system is coded in Python for the harvesters and data processors, with a Node.js backend and a React.js front end. The following Python packages were used:
- numpy: For mathematical operations
- pandas: For data manipulation
- matplotlib: For data visualization
- nltk: For natural language processing
- couchdb: For database access
- ansible: For deployment

## Outcomes and Analysis
For outcomes and analysis of our scenarios please refer to [report](./Group%2049%20Assignment%202%20Final%20Report.pdf) attached as part of submission. 

## Screenshots
<img width="1416" alt="Screen Shot 2023-05-26 at 11 32 36" src="https://github.com/LattiVuitton/CloudHousingCrisisAnalyser/assets/80323885/a6a1c2e0-9a4e-4e59-af40-9c08ab5b364b">


<img width="1512" alt="Screen Shot 2023-05-26 at 11 17 58" src="https://github.com/LattiVuitton/CloudHousingCrisisAnalyser/assets/80323885/ae4df917-7774-41f1-afe9-2f37f6f93401">


<img width="1368" alt="Screen Shot 2023-05-26 at 11 34 13" src="https://github.com/LattiVuitton/CloudHousingCrisisAnalyser/assets/80323885/fbe241f3-8137-4420-8089-1e2a0895bbbe">





