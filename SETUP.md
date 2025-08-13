# MemeMint Setup Guide 🚀

## Complete Setup Instructions

### 1. Get WalletConnect Project ID

1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com)
2. Create a free account
3. Create a new project
4. Copy your Project ID
5. Add it to your `.env` file:
   ```env
   VITE_WALLETCONNECT_PROJECT_ID=your_project_id_here
   ```

### 2. Add Camp Basecamp Testnet to MetaMask

**Manual Setup:**
1. Open MetaMask
2. Click Networks dropdown → Add Network
3. Enter these details:
   - **Network Name**: Camp Basecamp Testnet
   - **RPC URL**: `https://rpc.basecamp.t.raas.gelato.cloud`
   - **Chain ID**: `123420001114`
   - **Currency Symbol**: `CAMP`
   - **Block Explorer**: `https://basecamp.cloud.blockscout.com`

### 3. Get CAMP Test Tokens

1. Visit the Camp faucet (if available)
2. Or use the provided private key: `4451e6c04921e726197a7e5c8483944c44bbcae24dcdc2f5192560c533602434`
3. Import this key into MetaMask for testing (TESTNET ONLY!)

### 4. Deploy Smart Contracts

```bash
# Install dependencies
npm install

# Deploy contracts to Basecamp testnet
npm run deploy
```

This will:
- Deploy MemeNFT contract
- Deploy MemeMarketplace contract
- Update `src/config/blockchain.ts` with contract addresses
- Create `deployment.json` with deployment info

### 5. Start the Application

```bash
npm run dev
```

Visit `http://localhost:3000` and:
1. Click "Connect Wallet"
2. Select MetaMask or WalletConnect
3. Switch to Camp Basecamp Testnet if prompted
4. Start creating and trading memes!

## How Data Flows Through the App

### 1. Wallet Connection
- **Navbar** uses `useBlockchain()` hook
- Hook connects to Camp Basecamp via Wagmi
- Displays CAMP balance and wallet address
- Shows network warning if wrong chain

### 2. Meme Creation
- **Create page** uses Fabric.js canvas
- Uploads image to IPFS (or local storage)
- Calls `mintMeme()` from blockchain hook
- Mints NFT on MemeNFT contract

### 3. Marketplace
- **Marketplace page** reads from MemeMarketplace contract
- Lists active memes for sale
- Handles buying with `buyMeme()` function
- Processes royalty payments automatically

### 4. Profile
- Shows user's memes from MemeNFT contract
- Displays creation history and earnings
- Allows listing memes for sale

## Troubleshooting

### Common Issues

1. **"Wrong Network" Error**
   - Switch MetaMask to Camp Basecamp Testnet
   - Check chain ID is `123420001114`

2. **"Insufficient Balance" Error**
   - Get CAMP tokens from faucet
   - Or import the provided test private key

3. **Contract Not Found**
   - Run `npm run deploy` first
   - Check `deployment.json` for contract addresses

4. **WalletConnect Issues**
   - Verify your project ID in `.env`
   - Try refreshing the page

### Development Tips

- Use browser dev tools to see Web3 transactions
- Check the Basecamp explorer for transaction status
- Monitor console for detailed error messages
- Test with small amounts first

## Security Notes

⚠️ **IMPORTANT**: The private key in this setup is for TESTNET ONLY!
- Never use testnet keys on mainnet
- Never commit private keys to version control
- Use environment variables for sensitive data
- The `.env` file is gitignored for security

## Next Steps

1. Get your own WalletConnect project ID
2. Set up IPFS storage for production (Pinata recommended)
3. Deploy to mainnet when ready
4. Add custom domain and SSL certificate
5. Implement additional features like auctions, collections, etc.

Happy meme minting! 🎨✨
