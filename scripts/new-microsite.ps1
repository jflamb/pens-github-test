param(
  [Parameter(Mandatory = $true)]
  [string]$Slug,

  [string]$Title,

  [string]$Description = "A new micro-site."
)

if ($Slug -notmatch "^[a-z0-9-]+$") {
  throw "Slug must use lowercase letters, numbers, and dashes only."
}

if (-not $Title) {
  $words = $Slug -split "-"
  $Title = ($words | ForEach-Object {
      if ($_.Length -eq 0) { return $_ }
      $_.Substring(0, 1).ToUpper() + $_.Substring(1)
    }) -join " "
}

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$siteDir = Join-Path $repoRoot "sites\$Slug"
$sitePath = "sites/$Slug/"
$jsonPath = Join-Path $repoRoot "sites.json"

if (Test-Path $siteDir) {
  throw "Site folder already exists: $siteDir"
}

New-Item -ItemType Directory -Path $siteDir | Out-Null

$indexHtml = @"
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>$Title</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <main class="card">
      <h1>$Title</h1>
      <p>$Description</p>
      <a href="../../index.html">Back to all sites</a>
    </main>
    <script src="script.js"></script>
  </body>
</html>
"@

$stylesCss = @"
body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  background: #f4f7fb;
}

.card {
  text-align: center;
  background: #ffffff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 10px 24px rgba(20, 34, 66, 0.14);
}
"@

$scriptJs = @"
console.log("$Title micro-site loaded.");
"@

Set-Content -Path (Join-Path $siteDir "index.html") -Value $indexHtml -Encoding UTF8
Set-Content -Path (Join-Path $siteDir "styles.css") -Value $stylesCss -Encoding UTF8
Set-Content -Path (Join-Path $siteDir "script.js") -Value $scriptJs -Encoding UTF8

if (-not (Test-Path $jsonPath)) {
  throw "sites.json was not found at $jsonPath"
}

$jsonRaw = Get-Content -Path $jsonPath -Raw
$data = $jsonRaw | ConvertFrom-Json

if (-not $data.sites) {
  $data | Add-Member -NotePropertyName "sites" -NotePropertyValue @()
}

$alreadyExists = $data.sites | Where-Object { $_.path -eq $sitePath }
if ($alreadyExists) {
  throw "A sites.json entry already exists for $sitePath"
}

$entry = [PSCustomObject]@{
  name        = $Title
  path        = $sitePath
  description = $Description
}

$data.sites += $entry
$data | ConvertTo-Json -Depth 5 | Set-Content -Path $jsonPath -Encoding UTF8

Write-Host "Created $siteDir and updated sites.json."
