Write-Host "Launching CloudSecureAI project..."

$root = Get-Location
$python = "$root\.venv\Scripts\python.exe"

# Backend
Write-Host "Starting Backend Flask..."
Start-Process powershell -ArgumentList "cd `"$root\backend`"; `"$python`" app.py" -NoNewWindow:$false

# Frontend
Write-Host "Starting Frontend..."
Start-Process powershell -ArgumentList "cd `"$root\frontend`"; `"$python`" -m http.server 8080" -NoNewWindow:$false

Start-Sleep -Seconds 3
Start-Process "http://127.0.0.1:8080"

Write-Host "Project started successfully."
