#!/bin/bash

# Configuration DNS Server
# Variables paramétrables
DOMAIN_NAME="${DOMAIN_NAME:-example.local}"
DNS_FORWARDER="${DNS_FORWARDER:-8.8.8.8}"
VM_IP="${VM_IP:-192.168.1.10}"

# Installation BIND9
apt-get update
apt-get install -y bind9 bind9utils bind9-doc

# Configuration named.conf.options
cat > /etc/bind/named.conf.options <<EOF
options {
    directory "/var/cache/bind";
    recursion yes;
    allow-query { any; };
    forwarders {
        $DNS_FORWARDER;
    };
    dnssec-validation auto;
    listen-on-v6 { any; };
};
EOF

# Configuration de la zone
cat > /etc/bind/named.conf.local <<EOF
zone "$DOMAIN_NAME" {
    type master;
    file "/etc/bind/db.$DOMAIN_NAME";
};
EOF

# Fichier de zone
cat > /etc/bind/db.$DOMAIN_NAME <<EOF
\$TTL    604800
@       IN      SOA     ns1.$DOMAIN_NAME. admin.$DOMAIN_NAME. (
                              2         ; Serial
                         604800         ; Refresh
                          86400         ; Retry
                        2419200         ; Expire
                         604800 )       ; Negative Cache TTL
;
@       IN      NS      ns1.$DOMAIN_NAME.
ns1     IN      A       $VM_IP
@       IN      A       $VM_IP
EOF

# Redémarrage du service
systemctl restart bind9
systemctl enable bind9

# Vérification
named-checkconf
named-checkzone $DOMAIN_NAME /etc/bind/db.$DOMAIN_NAME

echo "✅ DNS Server configured successfully"