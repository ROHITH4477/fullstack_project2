# Load environment variables from .env.example
$envFile = ".env.example"
if (Test-Path $envFile) {
    Get-Content $envFile | Where-Object { $_ -match '^\s*([^#=]+)=(.*)$' } | ForEach-Object {
        $name = $Matches[1].Trim()
        $value = $Matches[2].Trim()
        Set-Item -Path "Env:$name" -Value $value
    }
    Write-Host "Loaded environment variables from $envFile" -ForegroundColor Green
} else {
    Write-Host "Warning: $envFile not found!" -ForegroundColor Yellow
}

mvn spring-boot:run
