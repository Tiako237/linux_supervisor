#!/bin/bash

# Backup de la config actuelle
cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup

# Configuration sécurisée
cat > /etc/ssh/sshd_config <<EOF
Port 22
Protocol 2
PermitRootLogin no
PubkeyAuthentication yes
PasswordAuthentication no
PermitEmptyPasswords no
ChallengeResponseAuthentication no
UsePAM yes
X11Forwarding no
PrintMotd no
AcceptEnv LANG LC_*
Subsystem sftp /usr/lib/openssh/sftp-server
AllowUsers bunec-admin
MaxAuthTries 3
ClientAliveInterval 300
ClientAliveCountMax 2
EOF

# Redémarrage SSH
systemctl restart sshd

echo "✅ SSH hardened successfully"