import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Crown, Medal, TrendingUp, GitBranch, DollarSign } from 'lucide-react';

const Leaderboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('creators');

  const tabs = [
    { id: 'creators', label: 'Top Creators', icon: Crown },
    { id: 'memes', label: 'Viral Memes', icon: TrendingUp },
    { id: 'remixes', label: 'Most Remixed', icon: GitBranch },
    { id: 'earnings', label: 'Top Earners', icon: DollarSign }
  ];

  const topCreators = [
    {
      rank: 1,
      name: 'MemeKing42',
      avatar: '👑',
      totalMemes: 247,
      totalLikes: 89420,
      totalRemixes: 1247,
      earnings: '$12,847',
      badge: 'Legendary'
    },
    {
      rank: 2,
      name: 'ViralVixen',
      avatar: '🔥',
      totalMemes: 189,
      totalLikes: 76230,
      totalRemixes: 892,
      earnings: '$9,234',
      badge: 'Epic'
    },
    {
      rank: 3,
      name: 'MemeWizard',
      avatar: '🧙‍♂️',
      totalMemes: 156,
      totalLikes: 65840,
      totalRemixes: 743,
      earnings: '$7,891',
      badge: 'Master'
    }
  ];

  const viralMemes = [
    {
      rank: 1,
      title: 'Crypto Winter Survival Guide',
      creator: 'MemeKing42',
      likes: 15420,
      remixes: 234,
      views: 89420,
      image: '🥶'
    },
    {
      rank: 2,
      title: 'AI Taking My Job',
      creator: 'TechMemer',
      likes: 12350,
      remixes: 189,
      views: 76230,
      image: '🤖'
    }
  ];

  const getRankIcon = (rank: number): JSX.Element => {
    switch (rank) {
      case 1:
        return React.createElement(Crown, { className: "w-6 h-6 text-yellow-400" });
      case 2:
        return React.createElement(Medal, { className: "w-6 h-6 text-gray-400" });
      case 3:
        return React.createElement(Medal, { className: "w-6 h-6 text-amber-600" });
      default:
        return React.createElement('span', { 
          className: "w-6 h-6 flex items-center justify-center text-gray-400 font-bold" 
        }, `#${rank}`);
    }
  };

  const getBadgeColor = (badge: string): string => {
    switch (badge) {
      case 'Legendary':
        return 'from-yellow-400 to-orange-500';
      case 'Epic':
        return 'from-purple-400 to-pink-500';
      case 'Master':
        return 'from-blue-400 to-indigo-500';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  return React.createElement('div', { className: "min-h-screen py-8 px-4" },
    React.createElement('div', { className: "max-w-6xl mx-auto" },
      React.createElement(motion.div, {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8 },
        className: "text-center mb-12"
      },
        React.createElement('h1', { 
          className: "text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent" 
        }, 'Leaderboard'),
        React.createElement('p', { 
          className: "text-xl text-gray-300 max-w-2xl mx-auto" 
        }, 'Celebrating the most creative minds and viral content in the MemeMint ecosystem.')
      ),
      
      React.createElement('div', { className: "space-y-4" },
        topCreators.map((creator, index) =>
          React.createElement(motion.div, {
            key: creator.name,
            initial: { opacity: 0, x: -30 },
            animate: { opacity: 1, x: 0 },
            transition: { duration: 0.6, delay: index * 0.1 },
            className: "card flex items-center justify-between p-6"
          },
            React.createElement('div', { className: "flex items-center space-x-4" },
              React.createElement('div', { className: "flex items-center justify-center w-12 h-12" },
                getRankIcon(creator.rank)
              ),
              React.createElement('div', { className: "text-4xl" }, creator.avatar),
              React.createElement('div', null,
                React.createElement('h3', { className: "text-lg font-bold text-white" }, creator.name),
                React.createElement('div', { 
                  className: `inline-block px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getBadgeColor(creator.badge)} text-white` 
                }, creator.badge)
              )
            ),
            React.createElement('div', { className: "text-right" },
              React.createElement('div', { className: "text-2xl font-bold text-accent-400" }, creator.earnings),
              React.createElement('div', { className: "text-sm text-gray-400" }, 'Total Earned')
            )
          )
        )
      )
    )
  );
};

export default Leaderboard;
