require('dotenv').config();
const { ethers } = require('hardhat');
const fs = require('fs-extra');
const path = require('path');
const config = require('../config');

// Configure provider with proper error handling
function getProvider() {
  try {
    const provider = new ethers.JsonRpcProvider(config.network.rpcUrl);
    return provider;
  } catch (error) {
    throw new Error(`Failed to connect to RPC endpoint: ${error.message}`);
  }
}

// Verify network connection
async function verifyNetwork(provider, expectedChainId) {
  try {
    const network = await provider.getNetwork();
    if (network.chainId !== expectedChainId) {
      throw new Error(`Connected to wrong network. Expected: ${expectedChainId}, Got: ${network.chainId}`);
    }
  } catch (error) {
    throw new Error(`Network verification failed: ${error.message}`);
  }
}

// Get wallet with balance check
async function getWallet(provider) {
  try {
    const wallet = new ethers.Wallet(config.wallet.privateKey, provider);
    console.log('📍 Deploying from address:', wallet.address);
    
    // Check balance
    const balance = await provider.getBalance(wallet.address);
    const formattedBalance = ethers.formatEther(balance);
    console.log('💰 Account balance:', formattedBalance, 'CAMP');
    
    if (balance < ethers.parseEther('0.01')) {
      throw new Error('❌ Insufficient balance. Please fund your account with at least 0.01 CAMP tokens.');
    }
    
    return wallet;
  } catch (error) {
    throw new Error(`Wallet setup failed: ${error.message}`);
  }
}

async function main() {
  console.log('🚀 Starting deployment to Camp Basecamp Testnet...');
  
  // Setup provider and verify network
  const provider = getProvider();
  await verifyNetwork(provider, config.network.chainId);
  
  // Get wallet with balance check
  const wallet = await getWallet(provider);
    
    // Deploy MemeNFT contract with gas estimation and error handling
    console.log('\n📝 Deploying MemeNFT contract...');
    try {
      const MemeNFT = await ethers.getContractFactory('MemeNFT', wallet);
      
      // Estimate gas for deployment
      const deploymentTx = await MemeNFT.getDeployTransaction();
      const estimatedGas = await provider.estimateGas(deploymentTx);
      console.log(`Estimated gas for MemeNFT deployment: ${estimatedGas.toString()}`);
      
      // Deploy with gas estimation
      const memeNFT = await MemeNFT.deploy({
        gasLimit: estimatedGas.mul(12).div(10), // 20% buffer
      });
      
      const deploymentTxResponse = await memeNFT.deploymentTransaction();
      console.log('⏳ Waiting for MemeNFT deployment confirmation...');
      
      // Wait for deployment confirmation
      const receipt = await deploymentTxResponse.wait();
      const memeNFTAddress = await memeNFT.getAddress();
      
      console.log('✅ MemeNFT deployed to:', memeNFTAddress);
      console.log('   - Transaction hash:', receipt.hash);
      console.log('   - Block number:', receipt.blockNumber);
      
      // Deploy MemeMarketplace contract
      console.log('\n🏪 Deploying MemeMarketplace contract...');
      const MemeMarketplace = await ethers.getContractFactory('MemeMarketplace', wallet);
    
    // Estimate gas for deployment
    const deploymentTx = await MemeNFT.getDeployTransaction();
    const estimatedGas = await provider.estimateGas(deploymentTx);
    console.log(`Estimated gas for MemeNFT deployment: ${estimatedGas.toString()}`);
    
    // Deploy with gas estimation
    const memeNFT = await MemeNFT.deploy({
      gasLimit: estimatedGas.mul(12).div(10), // 20% buffer
    });
    
    const deploymentTxResponse = await memeNFT.deploymentTransaction();
    console.log('⏳ Waiting for MemeNFT deployment confirmation...');
    
    // Wait for deployment confirmation
    const receipt = await deploymentTxResponse.wait();
    const memeNFTAddress = await memeNFT.getAddress();
    
    console.log('✅ MemeNFT deployed to:', memeNFTAddress);
    console.log('   - Transaction hash:', receipt.hash);
    console.log('   - Block number:', receipt.blockNumber);
    
    // Deploy MemeMarketplace contract
    console.log('\n🏪 Deploying MemeMarketplace contract...');
    const MemeMarketplace = await ethers.getContractFactory('MemeMarketplace', wallet);
    
    // Estimate gas for marketplace deployment
    const marketplaceDeploymentTx = await MemeMarketplace.getDeployTransaction(memeNFTAddress);
    const marketplaceEstimatedGas = await provider.estimateGas(marketplaceDeploymentTx);
    console.log(`Estimated gas for MemeMarketplace deployment: ${marketplaceEstimatedGas.toString()}`);
    
    const marketplace = await MemeMarketplace.deploy(memeNFTAddress, {
      gasLimit: marketplaceEstimatedGas.mul(12).div(10), // 20% buffer
    });
    
    const marketplaceTxResponse = await marketplace.deploymentTransaction();
    console.log('⏳ Waiting for MemeMarketplace deployment confirmation...');
    
    // Wait for deployment confirmation
    const marketplaceReceipt = await marketplaceTxResponse.wait();
    const marketplaceAddress = await marketplace.getAddress();
    
    console.log('✅ MemeMarketplace deployed to:', marketplaceAddress);
    console.log('   - Transaction hash:', marketplaceReceipt.hash);
    console.log('   - Block number:', marketplaceReceipt.blockNumber);
    
    // Update environment variables
    console.log('\n🔄 Updating environment configuration...');
    await updateEnvFile({
      VITE_MEME_NFT_CONTRACT: memeNFTAddress,
      VITE_MARKETPLACE_CONTRACT: marketplaceAddress,
    });
    
    // Update frontend config
    const frontendConfigPath = path.join(__dirname, '../src/config/blockchain.ts');
    if (fs.existsSync(frontendConfigPath)) {
      let configContent = await fs.readFile(frontendConfigPath, 'utf8');
      
      configContent = configContent.replace(
        /MEME_NFT: ''/,
        `MEME_NFT: '${memeNFTAddress}'`
      );
      
      configContent = configContent.replace(
        /MARKETPLACE: ''/,
        `MARKETPLACE: '${marketplaceAddress}'`
      );
      
      await fs.writeFile(frontendConfigPath, configContent, 'utf8');
      console.log('✅ Updated frontend configuration');
    }
    
    console.log('\n🎉 Deployment successful!');
    console.log('MemeNFT Contract:', memeNFTAddress);
    console.log('MemeMarketplace Contract:', marketplaceAddress);
    console.log('\n🔗 View on explorer:', `${config.network.explorerUrl}/address/${memeNFTAddress}`);
    
    return {
      memeNFT: memeNFTAddress,
      marketplace: marketplaceAddress,
    };
  } catch (error) {
    console.error('\n❌ Deployment failed:', error.message);
    console.error('Stack:', error.stack);
    process.exitCode = 1;
    throw error;
  }
        JSON.stringify(deploymentInfo, null, 2)
    );
    
    console.log('\n🎉 Deployment completed successfully!');
    console.log('📄 Contract addresses saved to src/config/blockchain.ts');
    console.log('📋 Deployment info saved to deployment.json');
    console.log('\n🔍 View contracts on explorer:');
    console.log('   MemeNFT:', deploymentInfo.explorer.memeNFT);
    console.log('   Marketplace:', deploymentInfo.explorer.marketplace);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('❌ Deployment failed:', error);
        process.exit(1);
    });
