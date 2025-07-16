'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, BookOpen, Award, TrendingUp, Target, Zap, Star, Trophy } from 'lucide-react';

interface StatItem {
  icon: React.ElementType;
  value: number;
  label: string;
  suffix?: string;
  color: string;
  gradient: string;
}

const StatsTickerComponent: React.FC = () => {
  const [counters, setCounters] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0]);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  const stats: StatItem[] = [
    {
      icon: Users,
      value: 15000,
      label: 'Active Students',
      suffix: '+',
      color: 'text-blue-400',
      gradient: 'from-blue-400 to-cyan-500'
    },
    {
      icon: BookOpen,
      value: 850,
      label: 'Courses Available',
      suffix: '+',
      color: 'text-green-400',
      gradient: 'from-green-400 to-emerald-500'
    },
    {
      icon: Award,
      value: 98,
      label: 'Success Rate',
      suffix: '%',
      color: 'text-purple-400',
      gradient: 'from-purple-400 to-pink-500'
    },
    {
      icon: TrendingUp,
      value: 200,
      label: 'Countries',
      suffix: '+',
      color: 'text-orange-400',
      gradient: 'from-orange-400 to-red-500'
    },
    {
      icon: Target,
      value: 1200,
      label: 'Goals Achieved',
      suffix: '+',
      color: 'text-pink-400',
      gradient: 'from-pink-400 to-rose-500'
    },
    {
      icon: Zap,
      value: 45,
      label: 'Avg. Study Time',
      suffix: 'min',
      color: 'text-yellow-400',
      gradient: 'from-yellow-400 to-orange-500'
    },
    {
      icon: Star,
      value: 4.9,
      label: 'User Rating',
      suffix: '/5',
      color: 'text-indigo-400',
      gradient: 'from-indigo-400 to-purple-500'
    },
    {
      icon: Trophy,
      value: 95,
      label: 'Completion Rate',
      suffix: '%',
      color: 'text-teal-400',
      gradient: 'from-teal-400 to-cyan-500'
    }
  ];

  useEffect(() => {
    if (isInView) {
      stats.forEach((stat, index) => {
        const startValue = 0;
        const endValue = stat.value;
        const duration = 2000; // 2 seconds
        const startTime = Date.now();
        
        const timer = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Easing function for smooth animation
          const easeOutQuint = 1 - Math.pow(1 - progress, 5);
          const currentValue = startValue + (endValue - startValue) * easeOutQuint;
          
          setCounters(prev => {
            const newCounters = [...prev];
            newCounters[index] = currentValue;
            return newCounters;
          });
          
          if (progress >= 1) {
            clearInterval(timer);
          }
        }, 16); // 60fps
      });
    }
  }, [isInView]);

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
    hidden: { y: 50, opacity: 0, scale: 0.8 },
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

  const formatNumber = (num: number, decimals: number = 0): string => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  };

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-blue-900/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent)]"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gradient-animated mb-4">
            Trusted by Learners Worldwide
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Join thousands of students who have already transformed their learning journey with our AI-powered platform
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          ref={ref}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative"
            >
              {/* Card */}
              <div className="glass-strong rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                {/* Icon */}
                <div className={`mx-auto mb-4 w-16 h-16 bg-gradient-to-br ${stat.gradient} rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>

                {/* Animated Number */}
                <div className="mb-2">
                  <span className={`text-4xl font-bold ${stat.color} font-mono`}>
                    {stat.value === 4.9 
                      ? formatNumber(counters[index], 1)
                      : formatNumber(counters[index])
                    }
                  </span>
                  <span className={`text-2xl ${stat.color} font-bold`}>
                    {stat.suffix}
                  </span>
                </div>

                {/* Label */}
                <p className="text-sm text-white/70 font-medium uppercase tracking-wider">
                  {stat.label}
                </p>

                {/* Hover effect overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
              </div>

              {/* Floating animation indicator */}
              <div className={`absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-br ${stat.gradient} rounded-full animate-pulse opacity-60`}></div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-white/60 mb-6">
            Ready to become part of our growing community?
          </p>
          <button className="btn-modern group">
            <span>Start Your Journey</span>
            <TrendingUp className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default StatsTickerComponent; 