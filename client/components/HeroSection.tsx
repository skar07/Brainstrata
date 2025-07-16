'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Player } from '@lottiefiles/react-lottie-player';
import { ArrowRight, Sparkles, Zap, Brain, Star, Rocket } from 'lucide-react';
import { useAuth } from '@/lib/stores/authStore';

const HeroSection: React.FC = () => {
  const { user } = useAuth();
  const playerRef = useRef<Player>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const floatingIcons = [
    { icon: Brain, delay: 0, position: 'top-1/4 left-1/4' },
    { icon: Sparkles, delay: 1, position: 'top-1/3 right-1/3' },
    { icon: Zap, delay: 2, position: 'bottom-1/4 left-1/3' },
    { icon: Star, delay: 3, position: 'bottom-1/3 right-1/4' },
    { icon: Rocket, delay: 4, position: 'top-1/2 left-1/2' }
  ];

  // Lottie animation data (using a brain/learning animation)
  const lottieData = {
    "v": "5.5.7",
    "fr": 60,
    "ip": 0,
    "op": 120,
    "w": 400,
    "h": 400,
    "nm": "Brain Learning",
    "ddd": 0,
    "assets": [],
    "layers": [
      {
        "ddd": 0,
        "ind": 1,
        "ty": 4,
        "nm": "Brain",
        "sr": 1,
        "ks": {
          "o": { "a": 0, "k": 100, "ix": 11 },
          "r": {
            "a": 1,
            "k": [
              {
                "i": { "x": [0.833], "y": [0.833] },
                "o": { "x": [0.167], "y": [0.167] },
                "t": 0,
                "s": [0]
              },
              {
                "t": 120,
                "s": [360]
              }
            ],
            "ix": 10
          },
          "p": { "a": 0, "k": [200, 200, 0], "ix": 2 },
          "a": { "a": 0, "k": [0, 0, 0], "ix": 1 },
          "s": {
            "a": 1,
            "k": [
              {
                "i": { "x": [0.667, 0.667, 0.667], "y": [1, 1, 1] },
                "o": { "x": [0.333, 0.333, 0.333], "y": [0, 0, 0] },
                "t": 0,
                "s": [100, 100, 100]
              },
              {
                "i": { "x": [0.667, 0.667, 0.667], "y": [1, 1, 1] },
                "o": { "x": [0.333, 0.333, 0.333], "y": [0, 0, 0] },
                "t": 60,
                "s": [110, 110, 100]
              },
              {
                "t": 120,
                "s": [100, 100, 100]
              }
            ],
            "ix": 6
          }
        },
        "ao": 0,
        "shapes": [
          {
            "ty": "gr",
            "it": [
              {
                "ind": 0,
                "ty": "sh",
                "ix": 1,
                "ks": {
                  "a": 0,
                  "k": {
                    "i": [[-27.614, 0], [0, -27.614], [27.614, 0], [0, 27.614]],
                    "o": [[27.614, 0], [0, 27.614], [-27.614, 0], [0, -27.614]],
                    "v": [[0, -50], [50, 0], [0, 50], [-50, 0]],
                    "c": true
                  },
                  "ix": 2
                }
              },
              {
                "ty": "fl",
                "c": {
                  "a": 1,
                  "k": [
                    {
                      "i": { "x": [0.833, 0.833, 0.833, 0.833], "y": [0.833, 0.833, 0.833, 0.833] },
                      "o": { "x": [0.167, 0.167, 0.167, 0.167], "y": [0.167, 0.167, 0.167, 0.167] },
                      "t": 0,
                      "s": [0.4, 0.3, 0.9, 1]
                    },
                    {
                      "t": 120,
                      "s": [0.9, 0.3, 0.8, 1]
                    }
                  ],
                  "ix": 4
                },
                "o": { "a": 0, "k": 100, "ix": 5 },
                "r": 1,
                "bm": 0,
                "nm": "Fill 1",
                "mn": "ADBE Vector Graphic - Fill",
                "hd": false
              }
            ],
            "nm": "Ellipse 1",
            "np": 3,
            "cix": 2,
            "bm": 0,
            "ix": 1,
            "mn": "ADBE Vector Group",
            "hd": false
          }
        ],
        "ip": 0,
        "op": 120,
        "st": 0,
        "bm": 0
      }
    ]
  };

  return (
    <section className="hero-section">
      <div className="hero-bg">
        {/* Enhanced animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-500/30 via-pink-500/30 to-violet-600/30 rounded-full animate-blob animate-morph"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500/30 via-cyan-500/30 to-teal-600/30 rounded-full animate-blob animate-morph animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-gradient-to-br from-pink-500/30 via-rose-500/30 to-orange-500/30 rounded-full animate-blob animate-morph animation-delay-4000"></div>
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-gradient-to-br from-indigo-500/30 via-purple-500/30 to-pink-500/30 rounded-full animate-blob animate-morph animation-delay-6000"></div>
        </div>

        {/* Floating icons */}
        {floatingIcons.map((item, index) => (
          <motion.div
            key={index}
            className={`absolute ${item.position} text-white/20 floating-element`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: item.delay, duration: 1 }}
          >
            <item.icon className="w-8 h-8" />
          </motion.div>
        ))}
      </div>

      <div className="hero-content">
        <motion.div
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Main Hero Content */}
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-12 lg:space-y-0 lg:space-x-12">
            {/* Left Side - Text Content */}
            <div className="flex-1 text-center lg:text-left space-y-8">
              <motion.div variants={itemVariants} className="space-y-4">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold">
                  <span className="text-gradient-animated">Good morning,</span>
                  <br />
                  <span className="text-white">{user?.name || 'John'}! 👋</span>
                </h1>
                <p className="text-xl sm:text-2xl text-white/80 max-w-2xl">
                  Ready to unlock your potential with{' '}
                  <span className="text-gradient-animated font-semibold">AI-powered learning</span>
                  {' '}that adapts to your unique journey?
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-6">
                <button className="btn-modern group">
                  <span>Start Learning</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="btn-glass group">
                  <span>Watch Demo</span>
                  <Sparkles className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform" />
                </button>
              </motion.div>

              <motion.div variants={itemVariants} className="flex items-center justify-center lg:justify-start space-x-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gradient-animated">10K+</div>
                  <div className="text-sm text-white/70">Active Learners</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gradient-animated">95%</div>
                  <div className="text-sm text-white/70">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gradient-animated">500+</div>
                  <div className="text-sm text-white/70">Courses</div>
                </div>
              </motion.div>
            </div>

            {/* Right Side - Lottie Animation */}
            <motion.div
              variants={itemVariants}
              className="flex-1 flex items-center justify-center"
            >
              <div className="relative w-96 h-96">
                {/* Animated background circle */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full animate-pulse"></div>
                <div className="absolute inset-4 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full animate-pulse animation-delay-1000"></div>
                
                {/* Lottie Animation */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Player
                    ref={playerRef}
                    autoplay
                    loop
                    src={lottieData}
                    style={{ height: '300px', width: '300px' }}
                  />
                </div>

                {/* Floating particles */}
                <div className="absolute inset-0">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full"
                      style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        y: [0, -20, 0],
                        opacity: [0.3, 1, 0.3],
                        scale: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 2 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection; 