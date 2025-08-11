import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Upload, Type, Palette, Download, Zap, Image as ImageIcon, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

const Create = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [memeText, setMemeText] = useState({ top: '', bottom: '' })
  const [isGenerating, setIsGenerating] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

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

    setIsGenerating(true)
    
    // Simulate meme generation and blockchain minting
    setTimeout(() => {
      toast.success('🎉 Meme minted successfully! Now live on Camp blockchain.')
      setIsGenerating(false)
    }, 2000)
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
    { name: 'Drake Pointing', emoji: '👉', id: 'drake' },
    { name: 'Distracted Boyfriend', emoji: '👀', id: 'distracted' },
    { name: 'Woman Yelling at Cat', emoji: '😾', id: 'cat' },
    { name: 'This is Fine', emoji: '🔥', id: 'fine' },
    { name: 'Galaxy Brain', emoji: '🧠', id: 'brain' },
    { name: 'Stonks', emoji: '📈', id: 'stonks' }
  ]

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
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors duration-300 text-left"
                  >
                    <div className="text-2xl mb-1">{template.emoji}</div>
                    <div className="text-sm text-gray-300">{template.name}</div>
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
                  </div>
                ) : (
                  <div className="text-center text-gray-400">
                    <ImageIcon className="w-16 h-16 mx-auto mb-4" />
                    <p>Your meme preview will appear here</p>
                  </div>
                )}
              </div>
            </motion.div>

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
                  disabled={!selectedImage || isGenerating}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Minting on Blockchain...</span>
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
