# HyoT Admin CMS 바탕화면 바로가기 생성
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RootDir = Split-Path -Parent $ScriptDir
$Desktop = [Environment]::GetFolderPath("Desktop")
$ShortcutPath = Join-Path $Desktop "HyoT 관리자.lnk"

$WScript = New-Object -ComObject WScript.Shell
$Shortcut = $WScript.CreateShortcut($ShortcutPath)
$Shortcut.TargetPath = "powershell.exe"
$Shortcut.Arguments = "-ExecutionPolicy Bypass -File `"$RootDir\start-admin.ps1`""
$Shortcut.WorkingDirectory = $RootDir
$Shortcut.WindowStyle = 1
$Shortcut.IconLocation = "powershell.exe,0"
$Shortcut.Description = "HyoT 관리자 CMS (localhost:3001)"
$Shortcut.Save()

# 이전 영문 바로가기가 있으면 제거
$LegacyShortcut = Join-Path $Desktop "HyoT Admin.lnk"
if (Test-Path $LegacyShortcut) {
  Remove-Item $LegacyShortcut -Force
}

Write-Host "바탕화면에 바로가기가 생성되었습니다: HyoT 관리자.lnk" -ForegroundColor Green
Write-Host "더블클릭하면 관리자 CMS가 실행됩니다." -ForegroundColor Cyan
