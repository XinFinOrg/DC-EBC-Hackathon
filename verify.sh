#!/bin/bash
# Author Venimir Petkov
# Check if the network argument is provided
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <network>"
    exit 1
fi

network=$1

# Execute the truffle commands
echo "Verifying LegacyWallet with network $network..."
truffle run verify LegacyWallet --network $network
if [ $? -ne 0 ]; then
    echo "Error verifying LegacyWallet. Exiting."
    exit 1
fi

echo "All verifications completed successfully."

# chmod +x verify.sh
# ./verify.sh sepolia