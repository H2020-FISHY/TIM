#!/usr/bin/env bash
set -euo pipefail

#expecting interfaces as envronment variable following patter:
#INTERFACES_UP="eth0:123.123.123.123/24 eth1:124.124.124.3/26"
if [[ "$(whoami)" == "root" ]]; then
	INTERFACES_UP=${INTERFACES_UP:-}
	echo $INTERFACES_UP
	INTERFACE_DEFS=($INTERFACES_UP)
	echo >&2 "Configuring IP addresses, expecting config in environment variable like this: INTERFACES_UP=\"eth0:123.123.123.123/24 eth1:124.124.124.3/26\""
	for i in "${!INTERFACE_DEFS[@]}"
	do
		IF=$(cut -d : -f 1 <<< ${INTERFACE_DEFS[$i]})
		IP=$(cut -d : -f 2 <<< ${INTERFACE_DEFS[$i]})
		if [[ -n $(ip address show $IF | grep $IP) ]]; then
			echo >&2 "address $IP for interface $IF is already set"
		else	
			echo >&2 "setting $IF address to $IP..."
			if ip addr add $IP dev $IF; then
				echo >&2 "IP $IP for interface $IF set successfully"
				echo >&2 "bringing up interface $IF..."
				else
				echo >&2 "unable to set IP address for interface $IF"
			fi
		fi
		if ip link set $IF up; then
			echo >&2 "brought $IF up successfully"
			else
			echo >&2 "unable to bring up interface $IF"
		fi
	done
	echo >&2 "Interfaces:"
	ip addr sh
fi

# allow the container to be started with `--user`
if [[ "$1" == rabbitmq* ]] && [ "$(id -u)" = '0' ]; then
	if [ "$1" = 'rabbitmq-server' ]; then
		find /var/lib/rabbitmq \! -user rabbitmq -exec chown rabbitmq '{}' +
	fi

	exec su-exec rabbitmq "$BASH_SOURCE" "$@"
fi

deprecatedEnvVars=(
	RABBITMQ_DEFAULT_PASS_FILE
	RABBITMQ_DEFAULT_USER_FILE
	RABBITMQ_MANAGEMENT_SSL_CACERTFILE
	RABBITMQ_MANAGEMENT_SSL_CERTFILE
	RABBITMQ_MANAGEMENT_SSL_DEPTH
	RABBITMQ_MANAGEMENT_SSL_FAIL_IF_NO_PEER_CERT
	RABBITMQ_MANAGEMENT_SSL_KEYFILE
	RABBITMQ_MANAGEMENT_SSL_VERIFY
	RABBITMQ_SSL_CACERTFILE
	RABBITMQ_SSL_CERTFILE
	RABBITMQ_SSL_DEPTH
	RABBITMQ_SSL_FAIL_IF_NO_PEER_CERT
	RABBITMQ_SSL_KEYFILE
	RABBITMQ_SSL_VERIFY
	RABBITMQ_VM_MEMORY_HIGH_WATERMARK
)
hasOldEnv=
for old in "${deprecatedEnvVars[@]}"; do
	if [ -n "${!old:-}" ]; then
		echo >&2 "error: $old is set but deprecated"
		hasOldEnv=1
	fi
done
if [ -n "$hasOldEnv" ]; then
	echo >&2 'error: deprecated environment variables detected'
	echo >&2
	echo >&2 'Please use a configuration file instead; visit https://www.rabbitmq.com/configure.html to learn more'
	echo >&2
	exit 1
fi

# if long and short hostnames are not the same, use long hostnames
if [ -z "${RABBITMQ_USE_LONGNAME:-}" ] && [ "$(hostname)" != "$(hostname -s)" ]; then
	: "${RABBITMQ_USE_LONGNAME:=true}"
fi

exec "$@"
