# MemeMint 🚀

**The first gasless meme marketplace built on Camp blockchain**

MemeMint is a revolutionary platform where creativity meets blockchain technology. Create, remix, and trade memes with automatic royalties, proof of provenance, and zero gas fees. No crypto knowledge required - just pure creative fun!

![MemeMint Banner](https://via.placeholder.com/800x400/667eea/ffffff?text=MemeMint+-+Own+Your+Memes)

## ✨ Features

### 🎨 **Create & Mint**
- **Gasless Minting**: Create and mint memes without paying gas fees
- **Instant Blockchain Registration**: Automatic on-chain registration with proof of provenance
- **Interactive Meme Editor**: Built-in editor with templates and text tools
- **Multiple Upload Options**: Support for PNG, JPG, GIF up to 10MB

### 🌳 **Meme Family Trees**
- **Track Remixes**: See how your memes evolve and spread
- **Visual Lineage**: Interactive family tree showing meme generations
- **Attribution System**: Automatic credit to original creators

### 💰 **Automatic Royalties**
- **Smart Royalty Distribution**: Earn when others remix your memes
- **Transparent Payments**: All transactions visible on blockchain
- **Creator Economy**: Build sustainable income from your creativity

### 🏆 **Gamification**
- **Leaderboards**: Rank by likes, remixes, and earnings
- **Achievement Badges**: Unlock rewards for milestones
- **Creator Profiles**: Build your reputation and following

### 🔒 **Blockchain Security**
- **Built on Camp Network**: Gasless transactions and fast finality
- **Immutable Ownership**: Permanent proof of creation and ownership
- **Smart Contracts**: Automated royalty distribution

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/MemeMint.git
   cd MemeMint
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm start        # Start development server (alias)
```

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Follow the prompts**
   - Link to existing project or create new
   - Choose deployment settings
   - Your app will be live at `https://your-project.vercel.app`

### Alternative Deployment Options

#### Netlify
1. Build the project: `npm run build`
2. Drag and drop the `dist` folder to Netlify
3. Or connect your GitHub repo for automatic deployments

#### GitHub Pages
1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to package.json scripts: `"deploy": "gh-pages -d dist"`
3. Run: `npm run build && npm run deploy`

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
# Camp Blockchain Configuration
VITE_CAMP_RPC_URL=https://rpc.camp.network
VITE_CAMP_CHAIN_ID=325000

# IPFS Configuration (for metadata storage)
VITE_IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs/
VITE_PINATA_API_KEY=your_pinata_api_key

# Analytics (optional)
VITE_GA_TRACKING_ID=your_google_analytics_id
```

### Keeping the Project Running

#### Windows (Auto-start on PC restart)

1. **Create a batch file** (`start-mememint.bat`):
   ```batch
   @echo off
   cd /d "C:\Users\Victo\CascadeProjects\MemeMint"
   npm run dev
   pause
   ```

2. **Add to Windows Startup**:
   - Press `Win + R`, type `shell:startup`
   - Copy the batch file to this folder
   - The project will auto-start when you restart your PC

3. **Alternative: Use PM2** (recommended for production):
   ```bash
   npm install -g pm2
   pm2 start "npm run dev" --name "mememint"
   pm2 startup
   pm2 save
   ```

#### macOS/Linux
```bash
# Using PM2
npm install -g pm2
pm2 start "npm run dev" --name "mememint"
pm2 startup
pm2 save
```

## 🏗️ Project Structure

```
MemeMint/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   └── Navbar.tsx     # Navigation component
│   ├── pages/             # Page components
│   │   ├── Home.tsx       # Landing page
│   │   ├── Create.tsx     # Meme creation page
│   │   ├── Marketplace.tsx # Meme marketplace
│   │   ├── Profile.tsx    # User profile
│   │   ├── MemeDetail.tsx # Individual meme view
│   │   └── Leaderboard.tsx # Rankings and stats
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Utility functions
│   ├── types/             # TypeScript type definitions
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # App entry point
│   └── index.css          # Global styles
├── package.json           # Dependencies and scripts
├── vite.config.ts         # Vite configuration
├── tailwind.config.js     # Tailwind CSS config
└── README.md              # This file
```

## 🎯 How It Works

### For Creators
1. **Upload or Create**: Use our editor or upload your own image
2. **Add Text**: Customize with top and bottom text
3. **Mint Instantly**: One-click minting with zero gas fees
4. **Earn Royalties**: Get paid when others remix your work

### For Collectors
1. **Browse Marketplace**: Discover trending and viral memes
2. **Purchase**: Buy memes with transparent pricing
3. **Collect**: Build your meme portfolio
4. **Trade**: Resell in the secondary market

### For Remixers
1. **Find Inspiration**: Browse remixable memes
2. **Create Variations**: Build on existing memes
3. **Automatic Attribution**: Original creators get credit
4. **Share Profits**: Royalties flow to all contributors

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + Custom animations
- **Routing**: React Router DOM
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Canvas**: Fabric.js for meme editing
- **Notifications**: React Hot Toast
- **Build Tool**: Vite
- **Blockchain**: Camp Network (gasless transactions)

## 🎨 Design System

### Colors
- **Primary**: Purple gradient (#667eea to #764ba2)
- **Secondary**: Blue tones (#0ea5e9 variants)
- **Accent**: Yellow/Gold (#eab308 variants)
- **Background**: Dark gradient with glassmorphism effects

### Components
- **Cards**: Glassmorphism with backdrop blur
- **Buttons**: Gradient backgrounds with hover animations
- **Navigation**: Fixed header with blur effect
- **Animations**: Smooth transitions and micro-interactions

## 🚀 Hackathon Demo Script

### Live Demo Flow (5 minutes)

1. **Opening Hook** (30s)
   - "Imagine owning every meme you create..."
   - Show the landing page with animated stats

2. **Create Live Meme** (2 minutes)
   - Take photo of judges/audience
   - Upload to MemeMint
   - Add funny text about the hackathon
   - Mint instantly with gasless transaction

3. **Show Blockchain Proof** (1 minute)
   - Display the meme detail page
   - Show family tree (even though it's just created)
   - Highlight blockchain verification

4. **Create Remix** (1 minute)
   - Remix the original meme
   - Show how royalties flow to original creator
   - Demonstrate the family tree growing

5. **Marketplace & Stats** (30s)
   - Quick tour of marketplace
   - Show leaderboard and gamification
   - End with the vision of creator economy

### Key Demo Points
- ✅ **No wallet setup required**
- ✅ **Instant minting (gasless)**
- ✅ **Visual family trees**
- ✅ **Automatic royalties**
- ✅ **Real-time updates**

## 🔮 Future Roadmap

### Phase 1: Core Platform (Current)
- [x] Meme creation and minting
- [x] Marketplace functionality
- [x] Family tree visualization
- [x] User profiles and leaderboards

### Phase 2: Enhanced Features
- [ ] AI meme generation
- [ ] Advanced editing tools
- [ ] Mobile app (React Native)
- [ ] Social features (comments, follows)

### Phase 3: Creator Economy
- [ ] Brand partnerships
- [ ] Licensing marketplace
- [ ] Creator monetization tools
- [ ] Analytics dashboard

### Phase 4: Platform Expansion
- [ ] Multi-chain support
- [ ] NFT marketplace integration
- [ ] Metaverse compatibility
- [ ] API for third-party integrations

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use Tailwind for styling
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Camp Network** for gasless blockchain infrastructure
- **React Team** for the amazing framework
- **Tailwind CSS** for beautiful styling utilities
- **Framer Motion** for smooth animations
- **The Meme Community** for endless inspiration

## 📞 Support

- **Documentation**: [docs.mememint.com](https://docs.mememint.com)
- **Discord**: [Join our community](https://discord.gg/mememint)
- **Twitter**: [@MemeMintApp](https://twitter.com/MemeMintApp)
- **Email**: support@mememint.com

---

**Built with ❤️ for the creator economy**

*MemeMint - Where every meme you create is instantly yours in the eyes of the blockchain.*
