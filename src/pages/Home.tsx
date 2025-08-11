import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, Shield, TrendingUp, Users, ArrowRight, Sparkles, Coins, GitBranch } from 'lucide-react'

const Home = () => {
  const features = [
    {
      icon: Zap,
      title: 'Gasless Minting',
      description: 'Create and mint memes without paying gas fees. Built on Camp blockchain for seamless transactions.',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      icon: Shield,
      title: 'Proof of Provenance',
      description: 'Every meme is automatically registered on-chain with immutable proof of ownership and creation.',
      color: 'from-green-400 to-blue-500'
    },
    {
      icon: GitBranch,
      title: 'Meme Family Trees',
      description: 'Track remixes and derivatives. See how your meme evolves and spreads across the internet.',
      color: 'from-purple-400 to-pink-500'
    },
    {
      icon: Coins,
      title: 'Automatic Royalties',
      description: 'Earn royalties when others remix your memes. Revenue flows automatically to original creators.',
      color: 'from-blue-400 to-indigo-500'
    }
  ]

  const stats = [
    { label: 'Memes Created', value: '12,847', icon: Sparkles },
    { label: 'Active Creators', value: '3,291', icon: Users },
    { label: 'Total Remixes', value: '8,492', icon: GitBranch },
    { label: 'Royalties Paid', value: '$24,891', icon: Coins }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary-400 via-accent-400 to-secondary-400 bg-clip-text text-transparent">
              Own Your Memes
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              The first gasless meme marketplace where creativity meets blockchain. 
              Create, remix, and trade memes with automatic royalties and proof of ownership.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/create" className="btn-primary inline-flex items-center space-x-2">
                <Sparkles className="w-5 h-5" />
                <span>Start Creating</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/marketplace" className="btn-secondary inline-flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Explore Marketplace</span>
              </Link>
            </div>
          </motion.div>

          {/* Floating Meme Examples */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-16 relative"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="card bg-gradient-to-br from-white/10 to-white/5 p-4 float-animation"
                  style={{ animationDelay: `${i * 0.2}s` }}
                >
                  <div className="w-full h-32 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-4xl">🚀</span>
                  </div>
                  <p className="text-sm text-gray-300 mt-2">Sample Meme #{i}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="card text-center"
                >
                  <Icon className="w-8 h-8 mx-auto mb-3 text-accent-400" />
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {stat.label}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              Why MemeMint?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We're revolutionizing how memes are created, shared, and monetized. 
              No crypto knowledge required, just pure creative fun.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className="card group hover:scale-105"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="card bg-gradient-to-r from-primary-500/20 to-accent-500/20 border-primary-500/30"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Mint Your First Meme?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of creators who are already earning from their memes. 
              No setup required, just start creating!
            </p>
            <Link to="/create" className="btn-accent inline-flex items-center space-x-2 text-lg">
              <Zap className="w-6 h-6" />
              <span>Create Your First Meme</span>
              <ArrowRight className="w-6 h-6" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home
