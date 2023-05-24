export declare nodes=(172.26.136.103 172.26.131.253 172.26.132.178) # using default vm nodes for clustering setup
export masternode=172.26.136.103
export declare othernodes=`echo ${nodes[@]} | sed s/${masternode}//`
export size=${#nodes[@]}
export user='admin'
export pass='password'
export port='5984'
export VERSION='3.2.1'
export cookie='a192aeb9904e6590849337933b000c99'

# Set up the CouchDB cluster
echo "Enabling the cluster..."
for node in ${othernodes} 
do
    curl -XPOST "http://${user}:${pass}@${masternode}:5984/_cluster_setup" \
      --header "Content-Type: application/json"\
      --data "{\"action\": \"enable_cluster\", \"bind_address\":\"0.0.0.0\",\
             \"username\": \"${user}\", \"password\":\"${pass}\", \"port\": \"5984\",\
             \"remote_node\": \"${node}\", \"node_count\": \"$(echo ${nodes[@]} | wc -w)\",\
             \"remote_current_user\":\"${user}\", \"remote_current_password\":\"${pass}\"}"
done

# Adding nodes to the CouchDB cluster
echo "Adding nodes to the cluster..."
for node in ${othernodes}
do
    curl -XPOST "http://${user}:${pass}@${masternode}:5984/_cluster_setup"\
      --header "Content-Type: application/json"\
      --data "{\"action\": \"add_node\", \"host\":\"${node}\",\
             \"port\": \"5984\", \"username\": \"${user}\", \"password\":\"${pass}\"}"
done


# Finish the cluster setup
echo "Finishing cluster setup..."
curl -XPOST "http://${user}:${pass}@${masternode}:5984/_cluster_setup"\
    --header "Content-Type: application/json" --data "{\"action\": \"finish_cluster\"}"


echo "Checking cluster configurations..."
# Check whether the cluster configuration is correct:
for node in "${nodes[@]}"; do  curl -X GET "http://${user}:${pass}@${node}:5984/_membership"; done

# Creating the DBs on the cluster
echo "Creating twitter_data database..."
curl -X PUT "http://${user}:${pass}@${masternode}:5984/twitter_data" 

echo "Creating mastodon_data database..."
curl -X PUT "http://${user}:${pass}@${masternode}:5984/mastodon_data_copy"

echo "Creating sudo income database..."
curl -X PUT "http://${user}:${pass}@${masternode}:5984/sudo_income_data_copy" 

echo "Creating sudo rental database..."
curl -X PUT "http://${user}:${pass}@${masternode}:5984/sudo_rental_data_copy"

echo "Creating historical economic database..."
curl -X PUT "http://${user}:${pass}@${masternode}:5984/historical_economic_data_copy"

