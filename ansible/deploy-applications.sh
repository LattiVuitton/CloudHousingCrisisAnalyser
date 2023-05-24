#!/usr/bin/env bash

#
# Part of Assignment 2 - COMP90024 2023 Semester 1
# Cluster and Cloud Computing
# The University of Melbourne 
#
# Team 49:
#  * Navdeep Beniwal (1279517)
#  * Aditya Desu (1000447)
#  * Hieu (Nick) Huu (1329582)
#  * Jonathan Latti (1083374)
#  * Patricia Widjojo (913557)
#

# Deploying CouchDB containers
# Uncomment next line to deploy
# ansible-playbook --flush-cache -v -i hosts -u ubuntu deploy-couchdb-containers.yaml

# Setup the CouchDB Cluster
# Uncomment next line to deploy
# ./setup-couchdb-cluster.sh

# Deploying housing-crisis analyser: Twitter data processing and SUDO data processing
# Uncomment next line to deploy
# ansible-playbook --flush-cache -v -i hosts -u ubuntu housing-crisis-analyser.yaml

# Deploy Swarm Services
# Uncomment next line to deploy
# ansible-playbook --flush-cache -v -i hosts -u ubuntu deploy-system-services.yaml

