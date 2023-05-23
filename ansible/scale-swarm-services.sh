#!/usr/bin/env bash

ansible-playbook --flush-cache -v -i hosts -u ubuntu scale-swarm-services.yaml