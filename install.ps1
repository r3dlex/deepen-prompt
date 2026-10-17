<#
.SYNOPSIS
  Install the deepen-prompt agent skill into user-level directories of AI coding tools (Windows, also works in pwsh on macOS/Linux).
.EXAMPLE
  .\install.ps1                         # Claude Code + the shared ~/.agents/skills dir
  .\install.ps1 -Tool cursor,gemini     # specific tools
  .\install.ps1 -All -Symlink           # everything, linked to this checkout
  .\install.ps1 -Tool claude -Uninstall
  .\install.ps1 -List
#>
[CmdletBinding()]
param(
  [string[]]$Tool = @(),
  [switch]$All,
  [switch]$Symlink,
  [switch]$Uninstall,
  [switch]$DryRun,
  [switch]$List
)
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$Skill = 'deepen-prompt'
$SrcDir = $PSScriptRoot
$SkillSrc = Join-Path $SrcDir "skills/$Skill"
$Adapters = Join-Path $SrcDir 'adapters'
$UserHome = if ($env:USERPROFILE) { $env:USERPROFILE } else { $HOME }
$AllTools = @('claude', 'agents', 'codex', 'opencode', 'copilot', 'cursor', 'gemini', 'antigravity')
$DefaultTools = @('claude', 'agents')

function P([string]$rel) { Join-Path $UserHome $rel }

if ($List) {
  @"
claude       $(P ".claude/skills/$Skill")
agents       $(P ".agents/skills/$Skill")  (shared: Codex, Copilot, Cursor, Gemini CLI, OpenCode)
codex        $(P ".agents/skills/$Skill")  (same as agents)
opencode     $(P ".config/opencode/skills/$Skill") + $(P ".config/opencode/commands/$Skill.md")
copilot      $(P ".copilot/skills/$Skill")
cursor       $(P ".cursor/skills/$Skill")
gemini       $(P ".gemini/skills/$Skill") + $(P ".gemini/commands/$Skill.toml")
antigravity  $(P ".gemini/config/skills/$Skill") + $(P ".gemini/antigravity-cli/skills/$Skill")
"@
  exit 0
}

$tools = @(if ($All) { $AllTools } else { $Tool | ForEach-Object { $_ -split ',' } | Where-Object { $_ } })
if ($tools.Count -eq 0) { $tools = $DefaultTools }
foreach ($t in $tools) {
  if ($AllTools -notcontains $t) { Write-Error "Unknown tool: $t (use -List)"; exit 2 }
}
if (-not (Test-Path (Join-Path $SkillSrc 'SKILL.md'))) { Write-Error "Cannot find $SkillSrc/SKILL.md"; exit 1 }

function Remove-Target([string]$dest) {
  $item = Get-Item -LiteralPath $dest -Force -ErrorAction SilentlyContinue
  if (-not $item) { return }
  if ($DryRun) { Write-Output "+ remove $dest"; return }
  if ($item.LinkType) { $item.Delete() }        # remove the link only, never its target
  else { Remove-Item -LiteralPath $dest -Recurse -Force }
}

function Install-Item([string]$src, [string]$dest) {
  if ($Uninstall) {
    if (Get-Item -LiteralPath $dest -Force -ErrorAction SilentlyContinue) { Remove-Target $dest; Write-Output "removed $dest" }
    return
  }
  $parent = Split-Path -Parent $dest
  if ($DryRun) { Write-Output "+ mkdir $parent" }
  else { New-Item -ItemType Directory -Force -Path $parent | Out-Null }
  Remove-Target $dest
  if ($Symlink) {
    if ($DryRun) { Write-Output "+ symlink $dest -> $src" }
    else {
      try { New-Item -ItemType SymbolicLink -Path $dest -Target $src | Out-Null }
      catch {
        if (Test-Path -LiteralPath $src -PathType Container) {
          Write-Warning "Symlink not permitted (enable Developer Mode or run as admin); using a junction for $dest"
          New-Item -ItemType Junction -Path $dest -Target $src | Out-Null
        } else {
          Write-Warning "Symlink not permitted; copying $dest instead"
          Copy-Item -LiteralPath $src -Destination $dest
        }
      }
    }
  } else {
    if ($DryRun) { Write-Output "+ copy $src -> $dest" }
    else { Copy-Item -LiteralPath $src -Destination $dest -Recurse }
  }
  Write-Output "installed $dest"
}

function Install-Skill([string]$dir) { Install-Item $SkillSrc (Join-Path $dir $Skill) }

$done = @{}
foreach ($t in $tools) {
  switch ($t) {
    'claude' { Install-Skill (P '.claude/skills') }
    { $_ -in 'agents', 'codex' } {
      if (-not $done['agents']) { Install-Skill (P '.agents/skills'); $done['agents'] = $true }
    }
    'opencode' {
      Install-Skill (P '.config/opencode/skills')
      Install-Item (Join-Path $Adapters "opencode/commands/$Skill.md") (P ".config/opencode/commands/$Skill.md")
    }
    'copilot' { Install-Skill (P '.copilot/skills') }
    'cursor' { Install-Skill (P '.cursor/skills') }
    'gemini' {
      Install-Skill (P '.gemini/skills')
      Install-Item (Join-Path $Adapters "gemini/commands/$Skill.toml") (P ".gemini/commands/$Skill.toml")
    }
    'antigravity' {
      Install-Skill (P '.gemini/config/skills')
      Install-Skill (P '.gemini/antigravity-cli/skills')
    }
  }
}
if (-not $Uninstall) { Write-Output "Done. Restart your tool(s), then try: /$Skill <your task>" }
