'use client';

import React from 'react';
import { RoadmapData, RoadmapItem } from '@/types/roadmap';

interface RoadmapViewProps {
  data: RoadmapData;
  onBack: () => void;
  relatedTopics?: {
    id: string;
    title: string;
    description: string;
  }[];
  onRelatedTopicClick?: (topicId: string) => void;
}

export default function RoadmapView({ 
  data, 
  onBack,
  relatedTopics = [],
  onRelatedTopicClick
}: RoadmapViewProps) {
  // Debug logging
  console.log('RoadmapView rendered with:', {
    dataTitle: data.title,
    relatedTopicsCount: relatedTopics.length,
    relatedTopics: relatedTopics
  });
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'not-started': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="mb-4 inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            ← Back to Mind Map
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {data.title}
          </h1>
          <p className="text-gray-600 text-lg">
            {data.description}
          </p>
        </div>

        {/* Progress Overview */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {data.roadmap.filter(item => item.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {data.roadmap.filter(item => item.status === 'in-progress').length}
              </div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {data.roadmap.filter(item => item.status === 'not-started').length}
              </div>
              <div className="text-sm text-gray-600">Not Started</div>
            </div>
          </div>
        </div>

        {/* Roadmap Items */}
        <div className="space-y-4">
          {data.roadmap.map((item, index) => (
            <div key={item.id} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {item.status.replace('-', ' ')}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(item.difficulty)}`}>
                    {item.difficulty}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>Estimated time: {item.estimatedTime}</span>
                <span>Step {index + 1} of {data.roadmap.length}</span>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-800 mb-2">Resources:</h4>
                <div className="flex flex-wrap gap-2">
                  {item.resources.map((resource, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {resource}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mt-4 flex space-x-3">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Start Learning
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Mark Complete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Related Topics */}
        {relatedTopics.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Related Topics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedTopics.map(topic => (
                <div
                  key={topic.id}
                  onClick={() => onRelatedTopicClick?.(topic.id)}
                  className="group p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-pointer transform hover:scale-105 hover:shadow-md"
                >
                  <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-blue-700 transition-colors">
                    {topic.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {topic.description.length > 100 
                      ? `${topic.description.substring(0, 100)}...` 
                      : topic.description
                    }
                  </p>
                  <div className="mt-3 flex items-center text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span>View Roadmap</span>
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}