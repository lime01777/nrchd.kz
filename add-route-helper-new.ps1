param (
    [string]$Directory = "C:\xampp\htdocs\resources\js"
)

# Find all .jsx and .js files containing route() calls
$files = Get-ChildItem -Path $Directory -Recurse -Include "*.jsx", "*.js" | 
         Where-Object { 
             (Select-String -Path $_ -Pattern "route\(" -Quiet) -and
             ($_.FullName -notlike "*\Utils\routeWithLocale.js") -and 
             ($_.FullName -notlike "*\Utils\route.js") -and 
             ($_.FullName -notlike "*\Utils\RouteHelper.js") -and
             ($_.FullName -notlike "*\Utils\ziggyPatch.js")
         } | 
         Select-Object -ExpandProperty FullName

Write-Host "Found $($files.Count) files with route() calls..."
Write-Host ""

foreach ($file in $files) {
    # Calculate relative path for import
    $relativeImport = "../Utils/routeWithLocale"
    $pathDepth = ($file -split "\\").Count - ($Directory -split "\\").Count
    
    if ($pathDepth -gt 1) {
        $relativeImport = ""
        for ($i = 1; $i -lt $pathDepth; $i++) {
            $relativeImport += "../"
        }
        $relativeImport += "Utils/routeWithLocale"
    }
    
    $content = Get-Content -Path $file -Raw
    
    # Check if routeWithLocale is already imported
    if ($content -notmatch "import\s+route\s+from\s+['\"].*routeWithLocale['\"]") {
        # Check if there are any imports to add after
        if ($content -match "import\s+.*from\s+['\"].*['\"]") {
            # Find last import with regex
            $importMatches = [regex]::Matches($content, "import\s+.*from\s+['\"].*['\"]")
            $lastImport = $importMatches[$importMatches.Count - 1]
            $lastImportEndPos = $lastImport.Index + $lastImport.Length
            
            if ($content.Substring($lastImportEndPos, 1) -eq ";") {
                $lastImportEndPos += 1
            }
            
            # Look for newline after the import
            if ($content.Substring($lastImportEndPos, 2) -match "`r`n") {
                $lastImportEndPos += 2
            } elseif ($content.Substring($lastImportEndPos, 1) -match "`n") {
                $lastImportEndPos += 1
            }
            
            # Add our import after the last import
            $newContent = $content.Substring(0, $lastImportEndPos)
            $newContent += "import route from '$relativeImport';"
            $newContent += [Environment]::NewLine
            $newContent += $content.Substring($lastImportEndPos)
            
            # Write updated content to file
            Set-Content -Path $file -Value $newContent -Encoding UTF8
            Write-Host "✅ Added import to $file"
        } else {
            Write-Host "❌ No imports found in $file"
        }
    } else {
        Write-Host "ℹ️ File $file already contains routeWithLocale import"
    }
}

Write-Host ""
Write-Host "Update completed! Please check the changes and run your build."
