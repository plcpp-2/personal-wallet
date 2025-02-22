# Download foundryup
$foundryup = "https://raw.githubusercontent.com/foundry-rs/foundry/master/foundryup/foundryup"
Invoke-WebRequest -Uri $foundryup -OutFile "$env:TEMP\foundryup"

# Run foundryup
$env:PATH = "$env:PATH;$env:USERPROFILE\.foundry\bin"
& "$env:TEMP\foundryup"

# Install dependencies
forge install OpenZeppelin/openzeppelin-contracts

# Build contracts
forge build
