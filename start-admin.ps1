# HyoT Admin CMS 실행 (http://localhost:3001)
$RootDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$AdminDir = Join-Path $RootDir 'admin'
$Url = 'http://localhost:3001'
$Port = 3001

function Test-AdminReady {
  try {
    $resp = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 3
    return $resp.StatusCode -ge 200 -and $resp.StatusCode -lt 400
  } catch {
    return $false
  }
}

function Stop-PortListener {
  param([int]$ListenPort)
  $connections = Get-NetTCPConnection -LocalPort $ListenPort -State Listen -ErrorAction SilentlyContinue
  foreach ($conn in $connections) {
    $procId = $conn.OwningProcess
    if ($procId -and $procId -ne 0) {
      Write-Host "포트 $ListenPort 점유 프로세스 종료 (PID: $procId)..." -ForegroundColor Yellow
      Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
    }
  }
  if ($connections) {
    Start-Sleep -Seconds 2
  }
}

Write-Host "HyoT 관리자 CMS를 시작합니다..." -ForegroundColor Cyan

if (Test-AdminReady) {
  Write-Host "이미 실행 중입니다. 브라우저를 엽니다." -ForegroundColor Green
  Start-Process $Url
  exit 0
}

$listening = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
if ($listening) {
  Write-Host "응답하지 않는 서버를 재시작합니다..." -ForegroundColor Yellow
  Stop-PortListener -Port $Port
}

if (-not (Test-Path (Join-Path $AdminDir 'node_modules'))) {
  Write-Host "의존성 설치 중..." -ForegroundColor Cyan
  npm install --prefix $AdminDir
  if ($LASTEXITCODE -ne 0) {
    Write-Host "npm install 실패" -ForegroundColor Red
    Read-Host "Enter 키를 눌러 종료"
    exit 1
  }
}

Write-Host "개발 서버 시작 중..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList @(
  '-ExecutionPolicy', 'Bypass',
  '-NoExit',
  '-Command', "Set-Location '$AdminDir'; npm run dev"
)

$maxWait = 90
$waited = 0
Write-Host "서버 준비 대기 중 (최대 ${maxWait}초)..." -ForegroundColor Cyan

while ($waited -lt $maxWait) {
  if (Test-AdminReady) {
    Write-Host "준비 완료! 브라우저를 엽니다: $Url" -ForegroundColor Green
    Start-Process $Url
    exit 0
  }
  Start-Sleep -Seconds 2
  $waited += 2
  Write-Host "  ... ${waited}초 경과"
}

Write-Host "서버 시작 시간 초과. 'HyoT Admin Server' 창의 오류 메시지를 확인하세요." -ForegroundColor Red
Read-Host "Enter 키를 눌러 종료"
exit 1
