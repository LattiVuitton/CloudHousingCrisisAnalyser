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

# Spinning up a new couchDb docker container on 4th vm.
ansible-playbook --flush-cache -v -i hosts -u ubuntu deploy-additional-couchdb-container.yaml

export declare nodes=(172.26.136.103 172.26.131.253 172.26.132.178 172.26.136.145) # all possible nodes in the system
export nodeToAdd=172.26.136.145
export user='admin'
export pass='password'
export port='5984'

echo "Adding new node to the cluster..."
# Adding the newly instantiated couchdb container to the cluster
curl -X PUT "http://${user}:${pass}@${masternode}:5984/_node/_local/_nodes/couchdb@${nodeToAdd}" -d {}


echo "Checking cluster configurations..."
# Check whether the cluster configuration is correct:
for node in "${nodes[@]}"; do  curl -X GET "http://${user}:${pass}@${node}:5984/_membership"; done

