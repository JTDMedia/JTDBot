@echo off
setlocal enabledelayedexpansion

if exist .env (
) else (
    echo DISCORD_TOKEN= > .env
    echo WEBHOOK_ID= >> .env
    echo WEBHOOK_TOKEN= >> .env
    echo DISCORD_ID= >> .env
    echo MONGO_TOKEN= >> .env
    echo SPOTIFY_CLIENT_ID= >> .env
    echo SPOTIFY_CLIENT_SECRET= >> .env
    echo LAVALINK_HOST= >> .env
    echo LAVALINK_PASSWORD= >> .env
    echo LAVALINK_PORT= >> .env
    echo LAVALINK_SECURE= >> .env
    echo GPT= >> .env
    echo RADIO= >> .env
)

set /p DISCORD_TOKEN="Enter your Discord bot token: "
echo DISCORD_TOKEN=%DISCORD_TOKEN%>>.env

set /p WEBHOOK_ID="Enter your Discord webhook ID: "
echo WEBHOOK_ID=%WEBHOOK_ID%>>.env

set /p WEBHOOK_TOKEN="Enter your Discord webhook token: "
echo WEBHOOK_TOKEN=%WEBHOOK_TOKEN%>>.env

set /p DISCORD_ID="Enter your Discord ID: "
echo DISCORD_ID=%DISCORD_ID%>>.env

set /p MONGO_TOKEN="Enter your MongoDB token: "
echo MONGO_TOKEN=%MONGO_TOKEN%>>.env

set /p SPOTIFY_CLIENT_ID="Enter your Spotify Client ID: "
echo SPOTIFY_CLIENT_ID=%SPOTIFY_CLIENT_ID%>>.env

set /p SPOTIFY_CLIENT_SECRET="Enter your Spotify Client Secret: "
echo SPOTIFY_CLIENT_SECRET=%SPOTIFY_CLIENT_SECRET%>>.env

set /p LAVALINK_HOST="Enter your Lavalink host: "
echo LAVALINK_HOST=%LAVALINK_HOST%>>.env

set /p LAVALINK_PASSWORD="Enter your Lavalink password: "
echo LAVALINK_PASSWORD=%LAVALINK_PASSWORD%>>.env

set /p LAVALINK_PORT="Enter your Lavalink port: "
if "%LAVALINK_PORT%"=="" set LAVALINK_PORT=80
echo LAVALINK_PORT=%LAVALINK_PORT%>>.env

set /p LAVALINK_SECURE="Is Lavalink secure (true/false)? "
echo LAVALINK_SECURE=%LAVALINK_SECURE%>>.env

set /p GPT="Enable GPT (true/false)? "
echo GPT=%GPT%>>.env

set /p RADIO="Enter the radio stream URL (or leave blank for no stream): "
echo RADIO=%RADIO%>>.env

echo Your .env file has been updated.
pause
