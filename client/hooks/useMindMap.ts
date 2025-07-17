import { useState, useEffect } from 'react';

export interface MindMapNode {
  id: string;
  label: string;
  x: number;
  y: number;
  connections: string[];
  category: string;
  progress: number; // 0-100
  lastStudied?: string;
  description?: string;
}

export interface MindMapData {
  nodes: MindMapNode[];
  lastUpdated: string;
}

const defaultMindMapData: MindMapNode[] = [
  {
    id: 'programming',
    label: 'Programming',
    x: 400,
    y: 300,
    connections: ['javascript', 'python', 'algorithms'],
    category: 'core',
    progress: 85,
    lastStudied: '2024-01-15',
    description: 'Core programming concepts and fundamentals'
  },
  {
    id: 'javascript',
    label: 'JavaScript',
    x: 200,
    y: 200,
    connections: ['programming', 'react', 'nodejs'],
    category: 'language',
    progress: 90,
    lastStudied: '2024-01-20',
    description: 'Modern JavaScript development'
  },
  {
    id: 'python',
    label: 'Python',
    x: 600,
    y: 200,
    connections: ['programming', 'data-science', 'automation'],
    category: 'language',
    progress: 75,
    lastStudied: '2024-01-10',
    description: 'Python programming and applications'
  },
  {
    id: 'react',
    label: 'React',
    x: 100,
    y: 100,
    connections: ['javascript', 'frontend'],
    category: 'framework',
    progress: 80,
    lastStudied: '2024-01-18',
    description: 'React frontend development'
  },
  {
    id: 'nodejs',
    label: 'Node.js',
    x: 300,
    y: 100,
    connections: ['javascript', 'backend'],
    category: 'framework',
    progress: 70,
    lastStudied: '2024-01-12',
    description: 'Node.js backend development'
  },
  {
    id: 'data-science',
    label: 'Data Science',
    x: 700,
    y: 100,
    connections: ['python', 'machine-learning'],
    category: 'domain',
    progress: 60,
    lastStudied: '2024-01-05',
    description: 'Data science and analytics'
  },
  {
    id: 'algorithms',
    label: 'Algorithms',
    x: 400,
    y: 500,
    connections: ['programming', 'data-structures'],
    category: 'core',
    progress: 65,
    lastStudied: '2024-01-08',
    description: 'Algorithm design and analysis'
  },
  {
    id: 'frontend',
    label: 'Frontend',
    x: 50,
    y: 50,
    connections: ['react'],
    category: 'domain',
    progress: 85,
    lastStudied: '2024-01-22',
    description: 'Frontend web development'
  },
  {
    id: 'backend',
    label: 'Backend',
    x: 350,
    y: 50,
    connections: ['nodejs'],
    category: 'domain',
    progress: 70,
    lastStudied: '2024-01-14',
    description: 'Backend development and APIs'
  },
  {
    id: 'machine-learning',
    label: 'Machine Learning',
    x: 750,
    y: 50,
    connections: ['data-science'],
    category: 'domain',
    progress: 45,
    lastStudied: '2024-01-03',
    description: 'Machine learning and AI'
  },
  {
    id: 'data-structures',
    label: 'Data Structures',
    x: 450,
    y: 600,
    connections: ['algorithms'],
    category: 'core',
    progress: 55,
    lastStudied: '2024-01-01',
    description: 'Data structures and organization'
  },
  {
    id: 'automation',
    label: 'Automation',
    x: 650,
    y: 300,
    connections: ['python'],
    category: 'domain',
    progress: 40,
    lastStudied: '2024-01-07',
    description: 'Process automation and scripting'
  }
];

export const useMindMap = () => {
  const [nodes, setNodes] = useState<MindMapNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load mind map data from localStorage or use default
    const loadMindMapData = () => {
      try {
        const savedData = localStorage.getItem('mindMapData');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          setNodes(parsedData.nodes || defaultMindMapData);
        } else {
          setNodes(defaultMindMapData);
        }
      } catch (error) {
        console.error('Error loading mind map data:', error);
        setNodes(defaultMindMapData);
      }
      setIsLoading(false);
    };

    loadMindMapData();
  }, []);

  const updateNodeProgress = (nodeId: string, progress: number) => {
    setNodes(prevNodes => {
      const updatedNodes = prevNodes.map(node => 
        node.id === nodeId 
          ? { 
              ...node, 
              progress: Math.min(100, Math.max(0, progress)),
              lastStudied: new Date().toISOString().split('T')[0]
            }
          : node
      );
      
      // Save to localStorage
      localStorage.setItem('mindMapData', JSON.stringify({
        nodes: updatedNodes,
        lastUpdated: new Date().toISOString()
      }));
      
      return updatedNodes;
    });
  };

  const addNode = (node: Omit<MindMapNode, 'x' | 'y'>) => {
    const newNode: MindMapNode = {
      ...node,
      x: Math.random() * 600 + 100,
      y: Math.random() * 400 + 100
    };

    setNodes(prevNodes => {
      const updatedNodes = [...prevNodes, newNode];
      localStorage.setItem('mindMapData', JSON.stringify({
        nodes: updatedNodes,
        lastUpdated: new Date().toISOString()
      }));
      return updatedNodes;
    });
  };

  const removeNode = (nodeId: string) => {
    setNodes(prevNodes => {
      const updatedNodes = prevNodes.filter(node => node.id !== nodeId);
      localStorage.setItem('mindMapData', JSON.stringify({
        nodes: updatedNodes,
        lastUpdated: new Date().toISOString()
      }));
      return updatedNodes;
    });
  };

  const getNodeById = (nodeId: string) => {
    return nodes.find(node => node.id === nodeId);
  };

  const getConnectedNodes = (nodeId: string) => {
    const node = getNodeById(nodeId);
    if (!node) return [];
    
    return nodes.filter(n => node.connections.includes(n.id));
  };

  const getCategoryStats = () => {
    const stats: { [key: string]: { count: number; avgProgress: number } } = {};
    
    nodes.forEach(node => {
      if (!stats[node.category]) {
        stats[node.category] = { count: 0, avgProgress: 0 };
      }
      stats[node.category].count++;
      stats[node.category].avgProgress += node.progress;
    });

    // Calculate averages
    Object.keys(stats).forEach(category => {
      stats[category].avgProgress = Math.round(stats[category].avgProgress / stats[category].count);
    });

    return stats;
  };

  return {
    nodes,
    isLoading,
    updateNodeProgress,
    addNode,
    removeNode,
    getNodeById,
    getConnectedNodes,
    getCategoryStats
  };
}; 