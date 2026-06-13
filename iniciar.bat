@echo off
title Al Momento - Sistema de Pedidos
echo Iniciando Al-Momento...
cd /d "%~dp0"
start "" "http://localhost:3000/admin"
npx next start