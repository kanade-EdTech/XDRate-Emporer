param(
    [string]$Url = 'http://127.0.0.1:4231/',
    [ValidateSet('chromium', 'firefox', 'webkit')]
    [string]$Browser = 'chromium'
)
$ErrorActionPreference = 'Stop'
$sessionName = 'emperor-check-' + [guid]::NewGuid().ToString('N')
try {
    $browserArgs = @()
    if ($Browser -ne 'chromium') { $browserArgs = @('--browser', $Browser) }
    & npx --yes --package '@playwright/cli' playwright-cli --session $sessionName open $Url @browserArgs
    if ($LASTEXITCODE -ne 0) { throw 'Could not open the local page. Start the development server first.' }
    & npx --yes --package '@playwright/cli' playwright-cli --session $sessionName run-code --filename 'scripts/emperor-ui-check.js'
    if ($LASTEXITCODE -ne 0) { throw 'Emperor UI checks failed.' }
} finally {
    & npx --yes --package '@playwright/cli' playwright-cli --session $sessionName close
}
