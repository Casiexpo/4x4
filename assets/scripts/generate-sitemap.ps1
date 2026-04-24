$ErrorActionPreference = "Stop"

$baseUrl = "https://trials4x4.cat"
$supabaseUrl = "https://rvcplafkusuwbcvxdzgz.supabase.co"
$supabaseKey = "sb_publishable_U64qz-HfU2mYsv-VpKPmjg_Z9vqg64O"
$today = Get-Date -Format "yyyy-MM-dd"

$headers = @{
  apikey        = $supabaseKey
  Authorization = "Bearer $supabaseKey"
}

$events = Invoke-RestMethod `
  -Uri "$supabaseUrl/rest/v1/events?select=id&order=date_start.asc" `
  -Headers $headers `
  -Method Get

$entries = @()
$entries += @"
  <url>
    <loc>$baseUrl/</loc>
    <lastmod>$today</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
"@

foreach ($event in $events) {
  $eventUrl = "$baseUrl/evento.html?id=$([System.Uri]::EscapeDataString($event.id))"
  $entries += @"
  <url>
    <loc>$eventUrl</loc>
    <lastmod>$today</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
"@
}

$sitemap = @"
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
$($entries -join "`n")
</urlset>
"@

$targetPath = Join-Path $PSScriptRoot "..\\xml\\sitemap.xml"
Set-Content -LiteralPath $targetPath -Value $sitemap -Encoding UTF8

Write-Output "Sitemap generado con $($entries.Count) URL(s) en $targetPath"
