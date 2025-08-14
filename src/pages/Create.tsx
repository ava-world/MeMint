import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Upload, Type, Palette, Download, Zap, Image as ImageIcon, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import { useWallet } from '../contexts/WalletContext'
import { mintMeme } from '../services/blockchain'
// import TwitterAuth from '../components/TwitterAuth'
// import TwitterAuthService, { TwitterUser } from '../services/TwitterAuth'

const Create = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [memeText, setMemeText] = useState({ top: '', bottom: '' })
  const [memeName, setMemeName] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedStickers, setSelectedStickers] = useState<string[]>([])
  const [isRemix, setIsRemix] = useState(false)
  const [originalTokenId, setOriginalTokenId] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { signer, isConnected } = useWallet()

  // Check for remix data on component mount
  useEffect(() => {
    try {
      const remixData = localStorage.getItem('remixMeme')
      if (remixData) {
        const data = JSON.parse(remixData)
        if (data && data.imageData) {
          setSelectedImage(data.imageData)
          setIsRemix(true)
          setOriginalTokenId(data.originalTokenId || 0)
          setMemeName(`Remix of ${data.originalTitle || 'Unknown Meme'}`)
          toast.success(`🎨 Remixing "${data.originalTitle || 'Unknown Meme'}"! Customize and mint your version.`)
        }
        
        // Clear the remix data
        localStorage.removeItem('remixMeme')
      }
    } catch (error) {
      console.error('Failed to load remix data:', error)
      // Clear corrupted data
      localStorage.removeItem('remixMeme')
    }
  }, [])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const generateMeme = async () => {
    if (!selectedImage) {
      toast.error('Please upload an image first!')
      return
    }

    if (!isConnected || !signer) {
      toast.error('Please connect your wallet first!')
      return
    }

    setIsGenerating(true)
    
    try {
      // Validate meme name
      if (!memeName.trim()) {
        toast.error('Please enter a name for your meme!')
        return
      }

      // Create a name for the meme
      const finalMemeName = memeName.trim()
      const description = `A meme created on MemeMint${memeText.top || memeText.bottom ? ` with text: "${memeText.top || ''} ${memeText.bottom || ''}"` : ''}`

      // Generate the final meme image with text overlays
      const finalMemeImage = await generateFinalMemeImage()
      
      if (!finalMemeImage) {
        toast.error('Failed to generate meme image with text')
        return
      }

      // Mint the meme on the blockchain with the rendered image
      const result = await mintMeme(signer, finalMemeImage, {
        name: finalMemeName,
        description,
        topText: memeText.top,
        bottomText: memeText.bottom,
        isRemix,
        originalTokenId
      })

      toast.success(
        `🎉 Meme minted successfully! Token ID: ${result.tokenId}`,
        { duration: 6000 }
      )

      // Show transaction details
      toast.success(
        <div>
          <p>Transaction confirmed!</p>
          <a 
            href={result.explorerUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            View on Explorer
          </a>
        </div>,
        { duration: 8000 }
      )

    } catch (error: any) {
      console.error('Minting failed:', error)
      toast.error(`Failed to mint meme: ${error.message}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const generateFinalMemeImage = async (): Promise<string | null> => {
    if (!selectedImage) return null
    
    const canvas = canvasRef.current
    if (!canvas) return null

    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        
        // Draw image
        ctx.drawImage(img, 0, 0)
        
        // Add text styling
        ctx.fillStyle = 'white'
        ctx.strokeStyle = 'black'
        ctx.lineWidth = 3
        ctx.font = 'bold 48px Impact, Arial Black, sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'top'
        
        // Top text
        if (memeText.top) {
          const topText = memeText.top.toUpperCase()
          const topY = 30
          ctx.fillText(topText, canvas.width / 2, topY)
          ctx.strokeText(topText, canvas.width / 2, topY)
        }
        
        // Bottom text
        if (memeText.bottom) {
          const bottomText = memeText.bottom.toUpperCase()
          ctx.textBaseline = 'bottom'
          const bottomY = canvas.height - 30
          ctx.fillText(bottomText, canvas.width / 2, bottomY)
          ctx.strokeText(bottomText, canvas.width / 2, bottomY)
        }
        
        // Add stickers/emojis
        if (selectedStickers.length > 0) {
          ctx.font = 'bold 40px Arial'
          ctx.textAlign = 'left'
          selectedStickers.forEach((sticker, index) => {
            const x = 20 + (index % 3) * 60 // Arrange in rows of 3
            const y = 80 + Math.floor(index / 3) * 60
            ctx.fillText(sticker, x, y)
          })
        }
        
        // Convert canvas to base64 data URL
        const dataURL = canvas.toDataURL('image/png', 0.9)
        resolve(dataURL)
      }
      img.src = selectedImage
    })
  }

  const downloadMeme = () => {
    if (!selectedImage) return
    
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      
      // Draw image
      ctx.drawImage(img, 0, 0)
      
      // Add text
      ctx.fillStyle = 'white'
      ctx.strokeStyle = 'black'
      ctx.lineWidth = 2
      ctx.font = 'bold 40px Impact, Arial'
      ctx.textAlign = 'center'
      
      // Top text
      if (memeText.top) {
        ctx.fillText(memeText.top.toUpperCase(), canvas.width / 2, 50)
        ctx.strokeText(memeText.top.toUpperCase(), canvas.width / 2, 50)
      }
      
      // Bottom text
      if (memeText.bottom) {
        ctx.fillText(memeText.bottom.toUpperCase(), canvas.width / 2, canvas.height - 20)
        ctx.strokeText(memeText.bottom.toUpperCase(), canvas.width / 2, canvas.height - 20)
      }
      
      // Download
      const link = document.createElement('a')
      link.download = 'meme.png'
      link.href = canvas.toDataURL()
      link.click()
    }
    img.src = selectedImage
  }

  const templates = [
    { 
      name: 'Drake Pointing', 
      emoji: '👉', 
      id: 'drake',
      url: 'https://i.imgflip.com/30b1gx.jpg',
      topText: 'OLD MEME FORMAT',
      bottomText: 'NEW MEME FORMAT'
    },
    { 
      name: 'Distracted Boyfriend', 
      emoji: '👀', 
      id: 'distracted',
      url: 'https://i.imgflip.com/1ur9b0.jpg',
      topText: 'ME',
      bottomText: 'NEW CRYPTO PROJECT'
    },
    { 
      name: 'Woman Yelling at Cat', 
      emoji: '😾', 
      id: 'cat',
      url: 'https://i.imgflip.com/345v97.jpg',
      topText: 'WHEN SOMEONE SAYS',
      bottomText: 'MEMES AREN\'T ART'
    },
    { 
      name: 'This is Fine', 
      emoji: '🔥', 
      id: 'fine',
      url: 'https://i.imgflip.com/26am.jpg',
      topText: 'PORTFOLIO DOWN 90%',
      bottomText: 'THIS IS FINE'
    },
    { 
      name: 'Galaxy Brain', 
      emoji: '🧠', 
      id: 'brain',
      url: 'https://i.imgflip.com/1tl71a.jpg',
      topText: 'BUYING MEMES',
      bottomText: 'MINTING MEMES'
    },
    { 
      name: 'Stonks', 
      emoji: '📈', 
      id: 'stonks',
      url: 'https://i.imgflip.com/2ze47r.jpg',
      topText: 'MEME NFTS',
      bottomText: 'STONKS'
    }
  ]

  const selectTemplate = (template: typeof templates[0]) => {
    setSelectedImage(template.url)
    setMemeText({
      top: template.topText,
      bottom: template.bottomText
    })
    toast.success(`🎨 ${template.name} template selected!`)
  }

  const toggleSticker = (sticker: string) => {
    setSelectedStickers(prev => {
      if (prev.includes(sticker)) {
        return prev.filter(s => s !== sticker)
      } else {
        return [...prev, sticker]
      }
    })
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
            Create Your Meme
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Upload an image or choose a template, add your text, and mint it on the blockchain instantly!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Editor */}
          <div className="space-y-6">
            {/* Image Upload */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="card"
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                <ImageIcon className="w-5 h-5" />
                <span>Upload Image</span>
              </h3>
              
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-400 rounded-xl p-8 text-center cursor-pointer hover:border-primary-400 transition-colors duration-300"
              >
                {selectedImage ? (
                  <img src={selectedImage} alt="Selected" className="max-w-full max-h-64 mx-auto rounded-lg" />
                ) : (
                  <div>
                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-300 mb-2">Click to upload an image</p>
                    <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                )}
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </motion.div>

            {/* Popular Templates */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="card"
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                <Palette className="w-5 h-5" />
                <span>Popular Templates</span>
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => selectTemplate(template)}
                    className="p-3 bg-white/5 hover:bg-white/10 hover:border hover:border-primary-500/50 rounded-lg transition-all duration-300 text-left group"
                  >
                    <div className="text-2xl mb-1 group-hover:scale-110 transition-transform duration-200">{template.emoji}</div>
                    <div className="text-sm text-gray-300 group-hover:text-white">{template.name}</div>
                    <div className="text-xs text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      Click to use template
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Text Editor */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="card"
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                <Type className="w-5 h-5" />
                <span>Add Text</span>
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Meme Name *
                  </label>
                  <input
                    type="text"
                    value={memeName}
                    onChange={(e) => setMemeName(e.target.value)}
                    placeholder="Enter a unique name for your meme..."
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Top Text
                  </label>
                  <input
                    type="text"
                    value={memeText.top}
                    onChange={(e) => setMemeText({ ...memeText, top: e.target.value })}
                    placeholder="Enter top text..."
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Bottom Text
                  </label>
                  <input
                    type="text"
                    value={memeText.bottom}
                    onChange={(e) => setMemeText({ ...memeText, bottom: e.target.value })}
                    placeholder="Enter bottom text..."
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </motion.div>

            {/* Stickers & Emojis */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="card"
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                <Sparkles className="w-5 h-5" />
                <span>Stickers & Emojis</span>
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-300 mb-2">Popular Reactions</h4>
                  <div className="grid grid-cols-6 gap-2">
                    {['🔥', '💎', '🚀', '💯', '😂', '🤯', '👑', '⚡', '🎯', '🌟', '💪', '🎉'].map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => toggleSticker(emoji)}
                        className={`p-2 rounded-lg text-2xl transition-all duration-200 ${
                          selectedStickers.includes(emoji)
                            ? 'bg-primary-500/30 border border-primary-500 scale-110'
                            : 'bg-white/5 hover:bg-white/10 hover:scale-105'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-gray-300 mb-2">Crypto Vibes</h4>
                  <div className="grid grid-cols-6 gap-2">
                    {['₿', 'Ξ', '🌙', '📈', '📉', '💰', '🏦', '🤑', '💸', '🎰', '🔮', '🦄'].map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => toggleSticker(emoji)}
                        className={`p-2 rounded-lg text-2xl transition-all duration-200 ${
                          selectedStickers.includes(emoji)
                            ? 'bg-primary-500/30 border border-primary-500 scale-110'
                            : 'bg-white/5 hover:bg-white/10 hover:scale-105'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedStickers.length > 0 && (
                  <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <p className="text-sm text-green-300">
                      ✨ Selected stickers: {selectedStickers.join(' ')}
                    </p>
                    <button
                      onClick={() => setSelectedStickers([])}
                      className="text-xs text-green-400 hover:text-green-300 mt-1"
                    >
                      Clear all stickers
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Side - Preview & Actions */}
          <div className="space-y-6">
            {/* Preview */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="card"
            >
              <h3 className="text-xl font-bold text-white mb-4">Preview</h3>
              
              <div className="relative bg-gray-800 rounded-lg p-4 min-h-64 flex items-center justify-center">
                {selectedImage ? (
                  <div className="relative">
                    <img src={selectedImage} alt="Meme preview" className="max-w-full max-h-80 rounded-lg" />
                    {memeText.top && (
                      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-white text-xl font-bold text-center px-2 py-1 bg-black/50 rounded">
                        {memeText.top.toUpperCase()}
                      </div>
                    )}
                    {memeText.bottom && (
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white text-xl font-bold text-center px-2 py-1 bg-black/50 rounded">
                        {memeText.bottom.toUpperCase()}
                      </div>
                    )}
                    {selectedStickers.length > 0 && (
                      <div className="absolute top-4 left-4 flex flex-wrap gap-1">
                        {selectedStickers.map((sticker, index) => (
                          <span key={index} className="text-2xl bg-black/30 rounded-full p-1">
                            {sticker}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-gray-400">
                    <ImageIcon className="w-16 h-16 mx-auto mb-4" />
                    <p>Your meme preview will appear here</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Twitter Authentication - Temporarily disabled */}

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="card"
            >
              <h3 className="text-xl font-bold text-white mb-4">Actions</h3>
              
              <div className="space-y-3">
                <button
                  onClick={generateMeme}
                  disabled={!selectedImage || isGenerating || !isConnected}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Minting on Blockchain...</span>
                    </>
                  ) : !isConnected ? (
                    <>
                      <Zap className="w-5 h-5" />
                      <span>Connect Wallet to Mint</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      <span>Mint Meme (Gasless)</span>
                      <Sparkles className="w-5 h-5" />
                    </>
                  )}
                </button>
                
                <button
                  onClick={downloadMeme}
                  disabled={!selectedImage}
                  className="w-full btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Meme</span>
                </button>
              </div>

              <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <h4 className="font-semibold text-green-400 mb-2">✨ What happens when you mint?</h4>
                <ul className="text-sm text-green-300 space-y-1">
                  <li>• Instant registration on Camp blockchain</li>
                  <li>• Proof of ownership & creation timestamp</li>
                  <li>• Automatic royalty setup for remixes</li>
                  <li>• Zero gas fees, zero crypto complexity</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Hidden canvas for meme generation */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  )
}

export default Create
