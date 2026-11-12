param([int]$Port = 8089, [string]$Root = (Get-Location).Path)

Add-Type -AssemblyName System.Net.HttpListener -ErrorAction SilentlyContinue
$listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:$Port/"
$listener.Prefixes.Add($prefix)
$listener.Start()
Write-Host "Serving $Root at $prefix"

$mime = @{
  ".html" = "text/html; charset=utf-8"
  ".css"  = "text/css; charset=utf-8"
  ".js"   = "application/javascript; charset=utf-8"
  ".webp" = "image/webp"
  ".png"  = "image/png"
  ".jpg"  = "image/jpeg"
  ".svg"  = "image/svg+xml"
  ".gs"   = "text/plain; charset=utf-8"
  ".md"   = "text/plain; charset=utf-8"
  ".mp3"  = "audio/mpeg"
  ".mp4"  = "video/mp4"
}

while ($listener.IsListening) {
  try {
    $context = $listener.GetContext()
  } catch { break }
  $req = $context.Request
  $res = $context.Response
  $path = $req.Url.AbsolutePath
  if ($path -eq "/") { $path = "/index.html" }
  $filePath = Join-Path $Root ($path.TrimStart("/"))
  if (Test-Path $filePath -PathType Leaf) {
    $ext = [System.IO.Path]::GetExtension($filePath)
    $contentType = $mime[$ext]
    if (-not $contentType) { $contentType = "application/octet-stream" }
    $bytes = [System.IO.File]::ReadAllBytes($filePath)
    $res.Headers.Add("Accept-Ranges", "bytes")
    $res.ContentType = $contentType
    $rangeHeader = $req.Headers["Range"]
    if ($rangeHeader -and $rangeHeader -match "bytes=(\d*)-(\d*)") {
      $total = $bytes.Length
      $start = if ($matches[1]) { [int64]$matches[1] } else { 0 }
      $end = if ($matches[2]) { [int64]$matches[2] } else { $total - 1 }
      if ($end -ge $total) { $end = $total - 1 }
      $len = $end - $start + 1
      $res.StatusCode = 206
      $res.Headers.Add("Content-Range", "bytes $start-$end/$total")
      $res.ContentLength64 = $len
      $res.OutputStream.Write($bytes, $start, $len)
    } else {
      $res.ContentLength64 = $bytes.Length
      $res.OutputStream.Write($bytes, 0, $bytes.Length)
    }
  } else {
    $res.StatusCode = 404
    $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $path")
    $res.OutputStream.Write($msg, 0, $msg.Length)
  }
  $res.OutputStream.Close()
}
