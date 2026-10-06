@echo off
chcp 65001 >nul
setlocal
where ffmpeg >nul 2>nul
if errorlevel 1 (
  echo Falta ffmpeg. Instalalo con:  winget install Gyan.FFmpeg
  echo Despues cierra y vuelve a abrir esta ventana.
  pause
  exit /b 1
)
echo === Comprimir video del tour (720p, pesa poco) ===
set /p IN=Arrastra aqui el video original y pulsa Enter: 
set /p NUM=Numero de tour (1, 2 o 3): 
set /p SS=Segundo de inicio (0 si no recortas): 
set /p DUR=Duracion en segundos (60 recomendado): 
if not exist "%~dp0..\assets\video" mkdir "%~dp0..\assets\video"
ffmpeg -y -ss %SS% -i %IN% -t %DUR% -vf "scale=1280:-2" -c:v libx264 -crf 28 -preset slow -c:a aac -b:a 96k -movflags +faststart "%~dp0..\assets\video\tour-%NUM%.mp4"
echo.
echo Listo: assets\video\tour-%NUM%.mp4
pause
