import { ethers } from 'ethers'

// Configuration
const RPC_URL = 'https://rpc.basecamp.t.raas.gelato.cloud'
const MEME_NFT_ADDRESS = '0x05CbD9a80756171Fa6eB558Ff8c2Ac7f7d08EACA'
const MARKETPLACE_ADDRESS = '0xe4930a67e86Ad009AfA28F45C90080f18443500E'

async function verifyContracts() {
  try {
    console.log('🔍 Verifying contract deployment...')
    
    const provider = new ethers.JsonRpcProvider(RPC_URL)
    
    // Check network
    const network = await provider.getNetwork()
    console.log(`📡 Connected to network: ${network.name} (Chain ID: ${network.chainId})`)
    
    // Check MemeNFT contract
    console.log('\n📄 Checking MemeNFT contract...')
    const memeNFTCode = await provider.getCode(MEME_NFT_ADDRESS)
    if (memeNFTCode === '0x') {
      console.log('❌ MemeNFT contract NOT found at address:', MEME_NFT_ADDRESS)
    } else {
      console.log('✅ MemeNFT contract found at:', MEME_NFT_ADDRESS)
      console.log(`   Code length: ${memeNFTCode.length} characters`)
    }
    
    // Check Marketplace contract
    console.log('\n🏪 Checking Marketplace contract...')
    const marketplaceCode = await provider.getCode(MARKETPLACE_ADDRESS)
    if (marketplaceCode === '0x') {
      console.log('❌ Marketplace contract NOT found at address:', MARKETPLACE_ADDRESS)
    } else {
      console.log('✅ Marketplace contract found at:', MARKETPLACE_ADDRESS)
      console.log(`   Code length: ${marketplaceCode.length} characters`)
    }
    
    // Test basic contract call if contracts exist
    if (memeNFTCode !== '0x') {
      console.log('\n🧪 Testing basic contract call...')
      try {
        const memeNFT = new ethers.Contract(
          MEME_NFT_ADDRESS,
          ['function name() public view returns (string memory)'],
          provider
        )
        const name = await memeNFT.name()
        console.log('✅ Contract name:', name)
      } catch (error) {
        console.log('❌ Failed to call contract:', error.message)
      }
    }
    
  } catch (error) {
    console.error('❌ Verification failed:', error.message)
  }
}

verifyContracts()
