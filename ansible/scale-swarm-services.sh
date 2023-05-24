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

ansible-playbook --flush-cache -v -i hosts -u ubuntu scale-swarm-services.yaml