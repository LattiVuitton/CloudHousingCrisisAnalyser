#!/usr/bin/env bash

# Uncomment to deploy
# Deploying Couchdb containers
# ansible-playbook --flush-cache -v -i hosts -u ubuntu deploy-couchdb-containers.yaml

# Uncomment to deploy
## Setup the CouchDb Cluster
# ./setup-couchdb-cluster.sh

# Uncomment to deploy
# Deploying housing-crisis analyser
# ansible-playbook --flush-cache -v -i hosts -u ubuntu housing-crisis-analyser.yaml

# Deploy Swarm Services
ansible-playbook --flush-cache -v -i hosts -u ubuntu deploy-system-services.yaml

