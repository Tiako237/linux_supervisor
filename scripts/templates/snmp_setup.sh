#!/bin/bash

# Installation SNMP
apt-get update
apt-get install -y snmpd snmp

# Configuration SNMPD
cat > /etc/snmp/snmpd.conf <<EOF
# Listening
agentAddress udp:161

# Community (à changer en production)
rocommunity public default

# System info
syslocation "BUNEC Datacenter"
syscontact admin@bunec.cm

# Monitoring
includeAllDisks 10%
load 12 10 5
EOF

# Redémarrage
systemctl restart snmpd
systemctl enable snmpd

# Vérification
snmpwalk -v2c -c public localhost system

echo "✅ SNMP configured successfully"