#!/usr/bin/env bash
ansible-galaxy collection install openstack.cloud:1.10.0

ansible-playbook --flush-cache -v -i hosts -u ubuntu setup-environment.yaml