@echo off
setlocal

rem >>>> CHANGE THIS IF YOUR PATH DIFFERS <<<<
set "BASE=C:\Users\2440938\OneDrive - Cognizant\Desktop\Projects\client\src\data"

rem Each 'start' opens a new window and keeps the server running with /k
start "json-server: riders"   cmd /k npx json-server --watch "%BASE%\riderlist.json"   --port 3005
start "json-server: drivers"  cmd /k npx json-server --watch "%BASE%\driverslist.json" --port 3006
start "json-server: vehicles" cmd /k npx json-server --watch "%BASE%\vehiclelist.json" --port 3007
start "json-server: fares"    cmd /k npx json-server --watch "%BASE%\farelist.json"    --port 3008
