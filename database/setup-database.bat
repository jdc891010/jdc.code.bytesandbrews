@echo off
setlocal enabledelayedexpansion

REM setup-database.bat - Script to set up Brews & Bytes database with Docker

REM Colors for output (using PowerShell for colored output)
set "BLUE=Write-Host"
set "GREEN=Write-Host"
set "YELLOW=Write-Host"
set "RED=Write-Host"

REM Function to print colored output
set "print_status=echo [INFO]"
set "print_success=echo [SUCCESS]"
set "print_warning=echo [WARNING]"
set "print_error=echo [ERROR]"

REM Main script logic
echo [INFO] Brews & Bytes Database Setup Script
echo ========================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not installed. Please install Docker first.
    exit /b 1
)

docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] docker-compose is not installed. Please install docker-compose first.
    exit /b 1
)

echo [SUCCESS] Docker and docker-compose are installed

REM Check if we're in the right directory
if not exist "ddl.sql" (
    echo [ERROR] Please run this script from the database directory
    exit /b 1
)

if not exist "brews_and_bytes_ddl.sql" (
    echo [ERROR] Please run this script from the database directory
    exit /b 1
)

REM Parse command line arguments
set "arg1=%~1"
if "%arg1%"=="" set "arg1=both"

REM Main logic based on arguments
if "%arg1%"=="heatmap" (
    call :start_heatmap_db
) else if "%arg1%"=="app" (
    call :start_app_db
) else if "%arg1%"=="application" (
    call :start_app_db
) else if "%arg1%"=="both" (
    call :start_both_dbs
) else if "%arg1%"=="stop" (
    call :stop_containers
) else if "%arg1%"=="status" (
    call :show_status
) else if "%arg1%"=="logs" (
    call :show_logs %2
) else (
    echo Usage: setup-database.bat [heatmap^|app^|both^|stop^|status^|logs]
    echo.
    echo   heatmap     - Start heatmap database only (port 5432)
    echo   app         - Start application database only (port 5433)
    echo   both        - Start both databases (default)
    echo   stop        - Stop all containers
    echo   status      - Show container status
    echo   logs        - Show container logs
    echo.
    exit /b 1
)

exit /b 0

REM Function to start heatmap database only
:start_heatmap_db
    echo [INFO] Starting heatmap database containers...
    docker-compose -f docker-compose-simple.yml up -d
    echo [SUCCESS] Heatmap database containers started
    call :show_connection_info
    goto :eof

REM Function to start application database only
:start_app_db
    echo [INFO] Starting application database containers...
    docker-compose -f docker-compose-app-simple.yml up -d
    echo [SUCCESS] Application database containers started
    call :show_connection_info
    goto :eof

REM Function to start both databases
:start_both_dbs
    echo [INFO] Starting both database containers...
    docker-compose -f docker-compose-full-simple.yml up -d
    echo [SUCCESS] Both database containers started
    call :show_connection_info
    goto :eof

REM Function to stop containers
:stop_containers
    echo [INFO] Stopping containers...
    docker-compose -f docker-compose-simple.yml down 2>nul
    docker-compose -f docker-compose-app-simple.yml down 2>nul
    docker-compose -f docker-compose-full-simple.yml down 2>nul
    echo [SUCCESS] Containers stopped
    goto :eof

REM Function to show container status
:show_status
    echo [INFO] Checking container status...
    echo ----------------------------------------
    docker-compose -f docker-compose-simple.yml ps 2>nul
    docker-compose -f docker-compose-app-simple.yml ps 2>nul
    docker-compose -f docker-compose-full-simple.yml ps 2>nul
    echo ----------------------------------------
    goto :eof

REM Function to show connection information
:show_connection_info
    echo.
    echo [SUCCESS] Database Setup Complete!
    echo ========================================
    echo.
    echo Heatmap Database:
    echo   Host: localhost
    echo   Port: 5432
    echo   Database: brews_and_bytes_heatmap
    echo   Username: postgres
    echo   Password: postgres
    echo.
    echo Application Database:
    echo   Host: localhost
    echo   Port: 5433
    echo   Database: brews_and_bytes_app
    echo   Username: postgres
    echo   Password: postgres
    echo.
    echo Adminer Interfaces:
    echo   Heatmap DB Adminer: http://localhost:8080
    echo   Application DB Adminer: http://localhost:8081
    echo.
    echo Use these credentials to connect to the databases.
    echo.
    goto :eof

REM Function to show logs
:show_logs
    set "log_type=%~1"
    if "%log_type%"=="" set "log_type=both"
    
    echo [INFO] Showing logs:
    echo ----------------------------------------
    if "%log_type%"=="heatmap" (
        docker logs brews_and_bytes_db --tail 20 2>nul
    ) else if "%log_type%"=="app" (
        docker logs brews_and_bytes_app_db --tail 20 2>nul
    ) else if "%log_type%"=="application" (
        docker logs brews_and_bytes_app_db --tail 20 2>nul
    ) else (
        docker logs brews_and_bytes_heatmap_db --tail 20 2>nul
        echo.
        docker logs brews_and_bytes_app_db --tail 20 2>nul
    )
    echo ----------------------------------------
    goto :eof