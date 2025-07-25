# Simple route helper script
$jsDir = "C:\xampp\htdocs\resources\js"

# Get all files recursively
$allFiles = Get-ChildItem -Path $jsDir -Recurse -Include "*.jsx", "*.js"

# Initialize counters
$totalFound = 0
$totalModified = 0
$totalSkipped = 0

Write-Host "Starting to process JavaScript files..."

# Process each file
foreach ($file in $allFiles) {
    # Skip utility files
    if (($file.FullName -like "*\Utils\routeWithLocale.js") -or 
        ($file.FullName -like "*\Utils\route.js") -or 
        ($file.FullName -like "*\Utils\RouteHelper.js") -or
        ($file.FullName -like "*\Utils\ziggyPatch.js")) {
        continue
    }
    
    # Check if file contains route()
    $fileContent = Get-Content -Path $file.FullName -Raw
    if ($fileContent -match "route\(") {
        $totalFound++
        
        # Check if already has the import
        if ($fileContent -notmatch "import\s+route\s+from\s+['\"].*routeWithLocale['\"]") {
            # Calculate relative path
            $relativePath = ""
            $fileDepth = ($file.FullName -split "\\").Count - ($jsDir -split "\\").Count
            
            if ($fileDepth -le 1) {
                $relativePath = "../Utils/routeWithLocale"
            } else {
                for ($i = 1; $i -lt $fileDepth; $i++) {
                    $relativePath += "../"
                }
                $relativePath += "Utils/routeWithLocale"
            }
            
            # Find any imports
            if ($fileContent -match "import\s+.*from\s+['\"].*['\"]") {
                try {
                    # Simple approach - look for the first line after imports
                    $lines = $fileContent -split "`r`n|\r|\n"
                    $importLines = @()
                    $nonImportLine = -1
                    
                    for ($i = 0; $i -lt $lines.Count; $i++) {
                        if ($lines[$i] -match "import\s+.*from\s+['\"].*['\"]") {
                            $importLines += $i
                        } 
                        elseif ($importLines.Count -gt 0 -and $lines[$i].Trim() -ne "") {
                            $nonImportLine = $i
                            break
                        }
                    }
                    
                    if ($importLines.Count -gt 0) {
                        $lastImportLine = $importLines[-1]
                        $newLines = $lines[0..$lastImportLine]
                        $newLines += "import route from '$relativePath';"
                        
                        if ($nonImportLine -ne -1) {
                            $newLines += $lines[$nonImportLine..($lines.Count-1)]
                        }
                        
                        # Write the file
                        $newContent = $newLines -join "`r`n"
                        Set-Content -Path $file.FullName -Value $newContent
                        $totalModified++
                        Write-Host "✅ Added import to $($file.FullName)"
                    } else {
                        Write-Host "⚠️ Could not find import section in $($file.FullName)"
                    }
                }
                catch {
                    Write-Host "❌ Error processing $($file.FullName): $_"
                }
            } else {
                Write-Host "⚠️ No imports found in $($file.FullName)"
            }
        } else {
            $totalSkipped++
            Write-Host "ℹ️ File $($file.FullName) already has the import"
        }
    }
}

Write-Host ""
Write-Host "Summary:"
Write-Host "  Files with route() calls: $totalFound"
Write-Host "  Files modified: $totalModified"
Write-Host "  Files skipped (already had import): $totalSkipped"
Write-Host ""
Write-Host "Update completed! Please check the changes and run your build."
