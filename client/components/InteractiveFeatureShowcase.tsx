'use client';

import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  Brain, 
  BookOpen, 
  Users, 
  BarChart3, 
  Zap, 
  Target, 
  MessageSquare, 
  Sparkles,
  ArrowRight,
  Play,
  Pause,
  Volume2,
  Check,
  Star,
  TrendingUp
} from 'lucide-react';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  gradient: string;
  type: 'interactive' | 'animated' | 'showcase' | 'demo';
  interactive?: boolean;
  demo?: {
    title: string;
    steps: string[];
  };
}

const InteractiveFeatureShowcase: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [demoStates, setDemoStates] = useState<{ [key: string]: number }>({});
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  const features: Feature[] = [
    {
      id: 'ai-powered',
      title: 'AI-Powered Learning',
      description: 'Personalized content that adapts to your learning style and pace',
      icon: Brain,
      color: 'text-purple-400',
      gradient: 'from-purple-400 to-pink-500',
      type: 'interactive',
      interactive: true,
      demo: {
        title: 'AI Learning Process',
        steps: [
          'Analyze your learning patterns',
          'Generate personalized content',
          'Adapt difficulty in real-time',
          'Provide intelligent feedback'
        ]
      }
    },
    {
      id: 'interactive-content',
      title: 'Interactive Content',
      description: 'Engaging multimedia experiences that make learning fun',
      icon: BookOpen,
      color: 'text-blue-400',
      gradient: 'from-blue-400 to-cyan-500',
      type: 'showcase',
      interactive: true
    },
    {
      id: 'community',
      title: 'Global Community',
      description: 'Connect with learners worldwide and compete on leaderboards',
      icon: Users,
      color: 'text-green-400',
      gradient: 'from-green-400 to-emerald-500',
      type: 'animated',
      interactive: true
    },
    {
      id: 'analytics',
      title: 'Smart Analytics',
      description: 'Track your progress with detailed insights and recommendations',
      icon: BarChart3,
      color: 'text-orange-400',
      gradient: 'from-orange-400 to-red-500',
      type: 'demo',
      interactive: true,
      demo: {
        title: 'Analytics Dashboard',
        steps: [
          'Track learning progress',
          'Identify weak areas',
          'Set improvement goals',
          'Monitor achievements'
        ]
      }
    },
    {
      id: 'instant-help',
      title: 'Instant Help',
      description: 'Get immediate answers to your questions with AI assistance',
      icon: MessageSquare,
      color: 'text-pink-400',
      gradient: 'from-pink-400 to-rose-500',
      type: 'interactive',
      interactive: true
    },
    {
      id: 'gamification',
      title: 'Gamified Learning',
      description: 'Earn rewards, badges, and compete with friends',
      icon: Target,
      color: 'text-yellow-400',
      gradient: 'from-yellow-400 to-orange-500',
      type: 'showcase',
      interactive: true
    }
  ];

  const handleFeatureClick = (featureId: string) => {
    setActiveFeature(activeFeature === featureId ? null : featureId);
  };

  const handleDemoStep = (featureId: string) => {
    setDemoStates(prev => ({
      ...prev,
      [featureId]: ((prev[featureId] || 0) + 1) % (features.find(f => f.id === featureId)?.demo?.steps.length || 1)
    }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0, scale: 0.9 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-purple-900/30 to-pink-900/50"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gradient-animated mb-4">
            Experience the Future of Learning
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Discover powerful features designed to transform how you learn and grow
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              variants={itemVariants}
              className="group relative"
            >
              {/* Main Feature Card */}
              <div 
                className={`glass-strong rounded-2xl p-6 cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
                  activeFeature === feature.id ? 'ring-2 ring-white/30 bg-white/20' : ''
                }`}
                onClick={() => handleFeatureClick(feature.id)}
              >
                {/* Icon and Title */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-lg font-semibold ${feature.color} mb-1`}>
                      {feature.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs px-2 py-1 bg-white/20 text-white rounded-full">
                        {feature.type}
                      </span>
                      {feature.interactive && (
                        <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">
                          Interactive
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-white/70 mb-4 text-sm">
                  {feature.description}
                </p>

                {/* Interactive Elements */}
                {feature.type === 'interactive' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/60">Try it now</span>
                      <ArrowRight className="w-4 h-4 text-white/60 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-white/10 hover:bg-white/20 rounded-lg py-2 px-3 text-xs transition-all">
                        Demo
                      </button>
                      <button className="flex-1 bg-white/10 hover:bg-white/20 rounded-lg py-2 px-3 text-xs transition-all">
                        Learn More
                      </button>
                    </div>
                  </div>
                )}

                {/* Animated Elements */}
                {feature.type === 'animated' && (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-400 animate-pulse" />
                      <span className="text-xs text-white/60">Live Updates</span>
                    </div>
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <div 
                          key={i}
                          className={`w-2 h-8 bg-gradient-to-t ${feature.gradient} rounded-full animate-pulse`}
                          style={{ animationDelay: `${i * 0.2}s` }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Showcase Elements */}
                {feature.type === 'showcase' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span className="text-xs text-white/60">Performance</span>
                    </div>
                    <div className="progress-bar h-2">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${75 + (index * 5)}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Demo Elements */}
                {feature.type === 'demo' && feature.demo && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/60">{feature.demo.title}</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDemoStep(feature.id);
                        }}
                        className="text-xs bg-white/10 hover:bg-white/20 rounded px-2 py-1 transition-all"
                      >
                        Step {(demoStates[feature.id] || 0) + 1}
                      </button>
                    </div>
                    <div className="text-xs text-white/70 bg-white/5 rounded-lg p-3">
                      {feature.demo.steps[demoStates[feature.id] || 0]}
                    </div>
                  </div>
                )}

                {/* Hover overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
              </div>

              {/* Expansion Panel */}
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ 
                  height: activeFeature === feature.id ? "auto" : 0,
                  opacity: activeFeature === feature.id ? 1 : 0
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-4 glass rounded-xl p-4 space-y-3">
                  <h4 className="text-sm font-semibold text-white">Advanced Features</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Check className="w-3 h-3 text-green-400" />
                      <span className="text-xs text-white/70">Real-time sync</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="w-3 h-3 text-green-400" />
                      <span className="text-xs text-white/70">Offline mode</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="w-3 h-3 text-green-400" />
                      <span className="text-xs text-white/70">Multi-device</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="w-3 h-3 text-green-400" />
                      <span className="text-xs text-white/70">Cloud backup</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating indicator */}
              <div className={`absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br ${feature.gradient} rounded-full flex items-center justify-center shadow-lg`}>
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default InteractiveFeatureShowcase; 