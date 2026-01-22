#!/bin/bash

# Brews and Bytes - PM2 Management Utility
# Helper script to quickly interact with the running application.

APP_NAME="brews-and-bytes"

function show_usage {
    echo "Usage: bash scripts/manage.sh {status|logs|stop|restart|monitor}"
    echo "  status  : Show application status"
    echo "  logs    : View real-time logs"
    echo "  stop    : Stop the application"
    echo "  restart : Restart the application"
    echo "  monitor : Open PM2 dashboard monitor"
}

if [ -z "$1" ]; then
    show_usage
    exit 1
fi

case "$1" in
    status)
        pm2 status $APP_NAME
        ;;
    logs)
        pm2 logs $APP_NAME
        ;;
    stop)
        pm2 stop $APP_NAME
        ;;
    restart)
        pm2 restart $APP_NAME
        ;;
    monitor)
        pm2 monit
        ;;
    *)
        echo "❌ Unknown command: $1"
        show_usage
        exit 1
        ;;
esac
