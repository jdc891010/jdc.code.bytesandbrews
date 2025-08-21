#!/bin/bash

# setup-database.sh - Script to set up Brews & Bytes database with Docker

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "docker-compose is not installed. Please install docker-compose first."
        exit 1
    fi
    
    print_success "Docker and docker-compose are installed"
}

# Function to check if we're in the right directory
check_directory() {
    if [[ ! -f "ddl.sql" ]] || [[ ! -f "brews_and_bytes_ddl.sql" ]]; then
        print_error "Please run this script from the database directory"
        exit 1
    fi
}

# Function to start heatmap database only
start_heatmap_db() {
    print_status "Starting heatmap database containers..."
    docker-compose -f docker-compose-simple.yml up -d
    print_success "Heatmap database containers started"
}

# Function to start application database only
start_app_db() {
    print_status "Starting application database containers..."
    docker-compose -f docker-compose-app-simple.yml up -d
    print_success "Application database containers started"
}

# Function to start both databases
start_both_dbs() {
    print_status "Starting both database containers..."
    docker-compose -f docker-compose-full-simple.yml up -d
    print_success "Both database containers started"
}

# Function to stop containers
stop_containers() {
    print_status "Stopping containers..."
    docker-compose -f docker-compose-simple.yml down 2>/dev/null || true
    docker-compose -f docker-compose-app-simple.yml down 2>/dev/null || true
    docker-compose -f docker-compose-full-simple.yml down 2>/dev/null || true
    print_success "Containers stopped"
}

# Function to show container status
show_status() {
    print_status "Checking container status..."
    echo "----------------------------------------"
    docker-compose -f docker-compose-simple.yml ps 2>/dev/null || true
    docker-compose -f docker-compose-app-simple.yml ps 2>/dev/null || true
    docker-compose -f docker-compose-full-simple.yml ps 2>/dev/null || true
    echo "----------------------------------------"
}

# Function to show connection information
show_connection_info() {
    echo
    print_success "Database Setup Complete!"
    echo "========================================"
    echo
    echo "Heatmap Database:"
    echo "  Host: localhost"
    echo "  Port: 5432"
    echo "  Database: brews_and_bytes_heatmap"
    echo "  Username: postgres"
    echo "  Password: postgres"
    echo
    echo "Application Database:"
    echo "  Host: localhost"
    echo "  Port: 5433"
    echo "  Database: brews_and_bytes_app"
    echo "  Username: postgres"
    echo "  Password: postgres"
    echo
    echo "Adminer Interfaces:"
    echo "  Heatmap DB Adminer: http://localhost:8080"
    echo "  Application DB Adminer: http://localhost:8081"
    echo
    echo "Use these credentials to connect to the databases."
    echo
}

# Function to wait for database to be ready
wait_for_db() {
    local container_name=$1
    local timeout=60
    local count=0
    
    print_status "Waiting for $container_name to be ready..."
    
    while ! docker exec $container_name pg_isready -U postgres > /dev/null 2>&1; do
        sleep 1
        count=$((count + 1))
        
        if [ $count -ge $timeout ]; then
            print_error "Timeout waiting for $container_name to be ready"
            exit 1
        fi
    done
    
    print_success "$container_name is ready"
}

# Function to show logs
show_logs() {
    local container_name=$1
    print_status "Showing logs for $container_name (last 20 lines):"
    docker logs $container_name --tail 20 2>/dev/null || true
    echo
}

# Main script logic
main() {
    print_status "Brews & Bytes Database Setup Script"
    echo "========================================"
    echo
    
    # Check prerequisites
    check_docker
    check_directory
    
    # Parse command line arguments
    case "${1:-both}" in
        heatmap)
            stop_containers
            start_heatmap_db
            wait_for_db "brews_and_bytes_db"
            show_logs "brews_and_bytes_db"
            show_connection_info
            ;;
        app|application)
            stop_containers
            start_app_db
            wait_for_db "brews_and_bytes_app_db"
            show_logs "brews_and_bytes_app_db"
            show_connection_info
            ;;
        both)
            stop_containers
            start_both_dbs
            wait_for_db "brews_and_bytes_heatmap_db"
            wait_for_db "brews_and_bytes_app_db"
            show_logs "brews_and_bytes_heatmap_db"
            show_logs "brews_and_bytes_app_db"
            show_connection_info
            ;;
        stop)
            stop_containers
            ;;
        status)
            show_status
            ;;
        logs)
            case "${2:-both}" in
                heatmap)
                    show_logs "brews_and_bytes_db"
                    ;;
                app|application)
                    show_logs "brews_and_bytes_app_db"
                    ;;
                both)
                    show_logs "brews_and_bytes_heatmap_db"
                    show_logs "brews_and_bytes_app_db"
                    ;;
                *)
                    print_error "Usage: $0 logs [heatmap|app|both]"
                    exit 1
                    ;;
            esac
            ;;
        *)
            echo "Usage: $0 [heatmap|app|both|stop|status|logs]"
            echo
            echo "  heatmap     - Start heatmap database only (port 5432)"
            echo "  app         - Start application database only (port 5433)"
            echo "  both        - Start both databases (default)"
            echo "  stop        - Stop all containers"
            echo "  status      - Show container status"
            echo "  logs        - Show container logs"
            echo
            exit 1
            ;;
    esac
}

# Run the main function with all arguments
main "$@"