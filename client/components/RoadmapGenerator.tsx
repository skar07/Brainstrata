"use client"
import React, { useState } from 'react';
import { ChevronDown, X, Plus, Trash2, Settings, BookOpen, Code, Database, GitBranch } from 'lucide-react';
// Types
interface RoadmapNode {
    id: string;
    title: string;
    type: 'topic' | 'checkpoint' | 'project';
    description?: string;
    position: { x: number; y: number };
    connections?: string[];
}

interface RoadmapData {
    title: string;
    nodes: RoadmapNode[];
    description: string;
}

const RoadmapGenerator: React.FC = () => {
    const [inputTitle, setInputTitle] = useState('');
    const [openaiKey, setOpenaiKey] = useState('');
    const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);
    const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

  
    const handleGenerate = async () => {
        if (!inputTitle.trim()) return;

        setIsGenerating(true);

        try {
            const response = await fetch("/api/generate-roadmap", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: inputTitle }),
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            setRoadmapData(data.roadmap);
        } catch (err) {
            alert("Error generating roadmap: " + (err instanceof Error ? err.message : "Unknown"));
        } finally {
            setIsGenerating(false);
        }
    };


    const getNodeIcon = (type: string) => {
        switch (type) {
            case 'topic':
                return <BookOpen className="w-4 h-4" />;
            case 'checkpoint':
                return <Code className="w-4 h-4" />;
            case 'project':
                return <Database className="w-4 h-4" />;
            default:
                return <BookOpen className="w-4 h-4" />;
        }
    };

    const getNodeStyle = (type: string) => {
        switch (type) {
            case 'topic':
                return 'bg-yellow-400 text-black border-yellow-500';
            case 'checkpoint':
                return 'bg-gray-700 text-white border-gray-600';
            case 'project':
                return 'bg-blue-600 text-white border-blue-500';
            default:
                return 'bg-yellow-400 text-black border-yellow-500';
        }
    };

    return (
        <div className="h-screen bg-gray-100 flex flex-col overflow-auto w-full">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold text-gray-800">Roadmap Generator</h1>
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                    >
                        <Settings className="w-5 h-5" />
                    </button>
                </div>

                {/* Settings Panel */}
                {showSettings && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                OpenAI API Key
                            </label>
                            <input
                                type="password"
                                value={openaiKey}
                                onChange={(e) => setOpenaiKey(e.target.value)}
                                placeholder="Enter your OpenAI API key"
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                )}

                {/* Input Section */}
                <div className="mt-4 flex gap-2">
                    <input
                        type="text"
                        value={inputTitle}
                        onChange={(e) => setInputTitle(e.target.value)}
                        placeholder="Enter roadmap title (e.g., Full Stack Development, React Developer)"
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
                    />
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating || !inputTitle.trim()}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isGenerating ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Generating...
                            </>
                        ) : (
                            <>
                                <Plus className="w-4 h-4" />
                                Generate Roadmap
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex">
                {/* Roadmap Canvas */}
                <div className="flex-1 relative overflow-auto">
                    {roadmapData ? (
                        <div className="relative h-full w-full p-8">
                            <svg className="absolute inset-0 w-full h-full">
                                {/* Connection lines */}
                                {roadmapData.nodes.map((node) =>
                                    node.connections?.map((targetId) => {
                                        const targetNode = roadmapData.nodes.find(n => n.id === targetId);
                                        if (!targetNode) return null;
                                        return (
                                            <line
                                                key={`line-${node.id}-${targetId}`}
                                                x1={`${node.position.x}%`}
                                                y1={`${node.position.y}%`}
                                                x2={`${targetNode.position.x}%`}
                                                y2={`${targetNode.position.y}%`}
                                                stroke="#3b82f6"
                                                strokeWidth="2"
                                                strokeDasharray="5,5"
                                            />
                                        );
                                    })
                                )}

                            </svg>

                            {/* Nodes */}
                            {roadmapData.nodes.map((node) => (
                                <div
                                    key={node.id}
                                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                                    style={{
                                        left: `${node.position.x}%`,
                                        top: `${node.position.y}%`,
                                    }}
                                    onClick={() => setSelectedNode(node)}
                                >
                                    <div
                                        className={`px-4 py-2 rounded-lg border-2 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center gap-2 ${getNodeStyle(node.type)}`}
                                    >
                                        {getNodeIcon(node.type)}
                                        <span className="font-medium text-sm">{node.title}</span>
                                    </div>
                                </div>
                            ))}

                            {/* Title */}
                            <div className="absolute top-4 left-4">
                                <h2 className="text-2xl font-bold text-gray-800">{roadmapData.title}</h2>
                                <p className="text-gray-600 mt-1">{roadmapData.description}</p>
                            </div>

                            {/* Legend */}
                            <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg">
                                <h3 className="font-semibold text-gray-800 mb-2">Legend</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-yellow-400 rounded border"></div>
                                        <span className="text-sm">Key topics to learn</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-gray-700 rounded border"></div>
                                        <span className="text-sm">Checkpoints</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-blue-600 rounded border"></div>
                                        <span className="text-sm">Project ideas</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center">
                            <div className="text-center">
                                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h2 className="text-xl font-semibold text-gray-600 mb-2">No roadmap generated yet</h2>
                                <p className="text-gray-500">Enter a title and click "Generate Roadmap" to get started</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Sidebar */}
                {selectedNode && (
                    <div className="w-96 bg-white border-l border-gray-200 p-6 overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                {getNodeIcon(selectedNode.type)}
                                {selectedNode.title}
                            </h3>
                            <button
                                onClick={() => setSelectedNode(null)}
                                className="p-1 rounded-full hover:bg-gray-100"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="mb-4">
                            <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${selectedNode.type === 'topic'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : selectedNode.type === 'checkpoint'
                                        ? 'bg-gray-100 text-gray-800'
                                        : 'bg-blue-100 text-blue-800'
                                }`}>
                                {selectedNode.type.charAt(0).toUpperCase() + selectedNode.type.slice(1)}
                            </span>
                        </div>

                        <div className="prose prose-sm max-w-none">
                            <p className="text-gray-700 leading-relaxed">
                                {selectedNode.description || 'No description available.'}
                            </p>
                        </div>

                        {/* Additional resources section */}
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-medium text-gray-800 mb-2">Resources</h4>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-green-600">
                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                    Free Resources
                                </div>
                                <div className="flex items-center gap-2 text-sm text-purple-600">
                                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                                    Premium Resources
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RoadmapGenerator;