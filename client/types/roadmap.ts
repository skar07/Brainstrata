export interface RoadmapItem {
    id: string;
    title: string;
    description: string;
    status: 'completed' | 'in-progress' | 'not-started';
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimatedTime: string;
    resources: string[];
}

export interface RoadmapData {
    title: string;
    description: string;
    roadmap: RoadmapItem[];
}

export interface TopicData {
    [key: string]: RoadmapData;
}

export interface MindMapNode {
    id: string;
    label: string;
    x: number;
    y: number;
    connections: string[];
    category: string;
    progress: number;
    lastStudied?: string;
}