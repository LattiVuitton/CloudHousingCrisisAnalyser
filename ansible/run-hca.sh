#!/usr/bin/env bash

ansible-galaxy collection install openstack.cloud:1.10.0

ansible-playbook -i hosts -u ubuntu housing-crisis-analyser.yaml