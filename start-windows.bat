@echo off
cd %cd%\app\resources\browser\GoogleChromePortable\
GoogleChromePortable.exe --app="file://%cd%/../../../home.html" "--allow-file-access-from-files" --unlimited-quota-for-files