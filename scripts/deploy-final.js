const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

// Configuration
const PRIVATE_KEY = process.env.PRIVATE_KEY || '';
const RPC_URL = 'https://rpc.basecamp.t.raas.gelato.cloud';
const CHAIN_ID = 123420001114;
const EXPLORER_URL = 'https://basecamp.cloud.blockscout.com';

// Contract ABIs and Bytecode (simplified for deployment)
const MEME_NFT_ABI = [
  "constructor()",
  "function mintMeme(string memory title, string memory description, string memory tokenURI, uint256 _royaltyPercentage, bool isRemix, uint256 originalTokenId) public returns (uint256)",
  "function ownerOf(uint256 tokenId) public view returns (address)",
  "function tokenURI(uint256 tokenId) public view returns (string memory)"
];

const MARKETPLACE_ABI = [
  "constructor(address _nftContract)",
  "function listMeme(uint256 tokenId, uint256 price) public",
  "function buyMeme(uint256 tokenId) public payable",
  "function getListedMemes() public view returns (tuple(uint256 tokenId, address seller, uint256 price, bool active)[])"
];

async function deployContract(wallet, contractName, abi, bytecode, constructorArgs = []) {
  console.log(`\n📝 Deploying ${contractName}...`);
  
  try {
    // Create contract factory
    const factory = new ethers.ContractFactory(abi, bytecode, wallet);
    
    // Estimate gas
    const deployTx = await factory.getDeployTransaction(...constructorArgs);
    const gasEstimate = await wallet.provider.estimateGas(deployTx);
    console.log(`⛽ Estimated gas: ${gasEstimate.toString()}`);
    
    // Deploy contract
    const contract = await factory.deploy(...constructorArgs, {
      gasLimit: gasEstimate.mul(120).div(100) // 20% buffer
    });
    
    console.log(`⏳ Waiting for ${contractName} deployment...`);
    await contract.waitForDeployment();
    
    const address = await contract.getAddress();
    console.log(`✅ ${contractName} deployed to: ${address}`);
    
    return { contract, address };
  } catch (error) {
    console.error(`❌ Failed to deploy ${contractName}:`, error.message);
    throw error;
  }
}

async function main() {
  console.log('🚀 Starting REAL contract deployment to Camp Basecamp Testnet...');
  
  try {
    // Setup provider and wallet
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    
    console.log('📍 Deploying from address:', wallet.address);
    
    // Verify network
    const network = await provider.getNetwork();
    console.log(`🌐 Connected to network: Chain ID ${network.chainId}`);
    
    if (Number(network.chainId) !== CHAIN_ID) {
      throw new Error(`Wrong network! Expected ${CHAIN_ID}, got ${network.chainId}`);
    }
    
    // Check balance
    const balance = await provider.getBalance(wallet.address);
    const balanceEth = ethers.formatEther(balance);
    console.log(`💰 Account balance: ${balanceEth} CAMP`);
    
    if (balance < ethers.parseEther('0.01')) {
      throw new Error('❌ Insufficient balance for deployment');
    }
    
    // Read compiled contract artifacts
    const memeNFTArtifact = JSON.parse(fs.readFileSync(
      path.join(__dirname, '../artifacts/contracts/MemeNFT.sol/MemeNFT.json'), 'utf8'
    ));
    
    const marketplaceArtifact = JSON.parse(fs.readFileSync(
      path.join(__dirname, '../artifacts/contracts/MemeMarketplace.sol/MemeMarketplace.json'), 'utf8'
    ));
    
    // Deploy MemeNFT
    const { address: memeNFTAddress } = await deployContract(
      wallet,
      'MemeNFT',
      memeNFTArtifact.abi,
      memeNFTArtifact.bytecode
    );
    
    // Deploy MemeMarketplace
    const { address: marketplaceAddress } = await deployContract(
      wallet,
      'MemeMarketplace',
      marketplaceArtifact.abi,
      marketplaceArtifact.bytecode,
      [memeNFTAddress]
    );
    
    // Create deployment info
    const deploymentInfo = {
      network: 'Camp Basecamp Testnet',
      chainId: CHAIN_ID,
      rpcUrl: RPC_URL,
      explorerUrl: EXPLORER_URL,
      contracts: {
        MemeNFT: memeNFTAddress,
        MemeMarketplace: marketplaceAddress
      },
      deployer: wallet.address,
      timestamp: new Date().toISOString(),
      transactionHashes: {
        memeNFT: `${EXPLORER_URL}/address/${memeNFTAddress}`,
        marketplace: `${EXPLORER_URL}/address/${marketplaceAddress}`
      }
    };
    
    // Save deployment info
    fs.writeFileSync(
      path.join(__dirname, '../deployment-real.json'),
      JSON.stringify(deploymentInfo, null, 2)
    );
    
    // Update frontend config
    const configPath = path.join(__dirname, '../src/config/blockchain.ts');
    if (fs.existsSync(configPath)) {
      let configContent = fs.readFileSync(configPath, 'utf8');
      
      configContent = configContent.replace(
        /MEME_NFT: '[^']*'/,
        `MEME_NFT: '${memeNFTAddress}'`
      );
      
      configContent = configContent.replace(
        /MARKETPLACE: '[^']*'/,
        `MARKETPLACE: '${marketplaceAddress}'`
      );
      
      fs.writeFileSync(configPath, configContent);
      console.log('✅ Updated frontend configuration');
    }
    
    console.log('\n🎉 REAL CONTRACT DEPLOYMENT SUCCESSFUL!');
    console.log('=====================================');
    console.log(`MemeNFT Contract: ${memeNFTAddress}`);
    console.log(`MemeMarketplace Contract: ${marketplaceAddress}`);
    console.log(`Explorer: ${EXPLORER_URL}/address/${memeNFTAddress}`);
    console.log('=====================================');
    
    return deploymentInfo;
    
  } catch (error) {
    console.error('\n❌ DEPLOYMENT FAILED:', error.message);
    if (error.transactionHash) {
      console.error('Transaction Hash:', error.transactionHash);
    }
    process.exit(1);
  }
}

// Execute deployment
main()
  .then(() => {
    console.log('\n✅ Deployment script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Deployment script failed:', error);
    process.exit(1);
  });
