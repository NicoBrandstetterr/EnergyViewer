@echo off
cd %cd%\app\resources\browser\
ChromiumPortable.exe --app="file://%cd%/../../home.html" "--allow-file-access-from-files" --unlimited-quota-for-files