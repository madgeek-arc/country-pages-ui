#!/bin/bash

# Create Nginx configuration
CONF_TMPL=/etc/nginx/nginx.conf.txt
FILE=/etc/nginx/conf.d/nginx.conf
EMAIL_ARG="--register-unsafely-without-email"
ADD_SERVER_NAME=""

if [ $ENABLE_SSL == "TRUE" ]; then
    apk add certbot-nginx
fi
if [ -f "$FILE" ]; then
    echo "Nginx configuration already exists: $FILE "
else
    echo "Creating Nginx configuration: $FILE"

    [ ! -z ${SERVER_NAME+x} ] && export ADD_SERVER_NAME="server_name ${SERVER_NAME}";
    envsubst '${ADD_SERVER_NAME} ${PLATFORM_API_ENDPOINT} ${STATS_API_ENDPOINT}' < $CONF_TMPL > $FILE

    rm /etc/nginx/conf.d/default.conf || echo "File '/etc/nginx/conf.d/default.conf' already deleted. OK"
    nginx -t
    cat /etc/nginx/conf.d/nginx.conf
    nginx -s reload

    if [ ! "$ENABLE_SSL" == "TRUE" ]; then
      echo "Simple Configuration"
    else
      echo "Using SSL Configuration"

      if [ ! -z ${SSL_EMAIL+x} ]; then
          EMAIL_ARG="-m $SSL_EMAIL"
      fi

      certbot install --cert-name $SERVER_NAME || certbot --nginx -d $SERVER_NAME --non-interactive --agree-tos $EMAIL_ARG

      nginx -t
      cat /etc/nginx/conf.d/nginx.conf
      nginx -s reload
    fi
fi

nginx -g "daemon off;"

# renew SSL loop
if [ $ENABLE_SSL == "TRUE" ]; then
    trap exit TERM; while :; do certbot renew; sleep 12h & wait ${!}; done;
fi
