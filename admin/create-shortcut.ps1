# Creates a desktop shortcut to launch HyoT Admin CMS
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RootDir = Split-Path -Parent $ScriptDir
$Desktop = [Environment]::GetFolderPath("Desktop")
$ShortcutPath = Join-Path $Desktop "HyoT Admin.lnk"

$WScript = New-Object -ComObject WScript.Shell
$Shortcut = $WScript.CreateShortcut($ShortcutPath)
$Shortcut.TargetPath = "powershell.exe"
$Shortcut.Arguments = "-ExecutionPolicy Bypass -WindowStyle Minimized -File `"$RootDir\start-admin.ps1`""
$Shortcut.WorkingDirectory = $RootDir
$Shortcut.IconLocation = "powershell.exe,0"
$Shortcut.Description = "HyoT Admin CMS"
$Shortcut.Save()

Write-Host "Shortcut created on Desktop: HyoT Admin.lnk" -ForegroundColor Green
Write-Host "Double-click to launch Admin CMS." -ForegroundColor Cyan
