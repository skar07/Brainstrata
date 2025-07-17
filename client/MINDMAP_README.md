# Interactive Learning Mind Map

## Overview

The Interactive Learning Mind Map is a 2D visualization tool that displays your learning journey as connected nodes. Each node represents a learning topic, and the connections show how concepts relate to each other.

## Features

### 🎯 Interactive Visualization
- **2D Canvas-based mind map** with draggable interface
- **Color-coded categories** for different types of learning topics
- **Progress rings** around each node showing completion percentage
- **Connection lines** between related topics

### 📊 Learning Progress Tracking
- **Progress indicators** (0-100%) for each learning topic
- **Last studied dates** to track learning activity
- **Category-based organization** (Core, Languages, Frameworks, Domains)

### 🔗 Topic Management
- **Add new learning topics** with the "Add Topic" modal
- **Connect topics** to show relationships
- **Navigate to detailed roadmaps** by clicking on nodes

### 🎨 Visual Design
- **Responsive canvas** that adapts to different screen sizes
- **Smooth animations** and hover effects
- **Modern UI** with consistent styling

## How to Use

### Navigation
1. **Access the mind map** via the sidebar navigation (Network icon)
2. **Pan around** by dragging the canvas
3. **Click on nodes** to view detailed roadmaps

### Adding Topics
1. Click the **"Add Topic"** button in the top-right corner
2. Fill in the topic details:
   - **Name**: The learning topic title
   - **Category**: Choose from Core, Languages, Frameworks, or Domains
   - **Description**: Brief description of what you'll learn
   - **Connections**: Select related existing topics
3. Click **"Add Topic"** to save

### Interacting with Nodes
- **Hover over nodes** to see details
- **Click nodes** to navigate to their roadmap page
- **Progress rings** show completion percentage
- **Selected nodes** are highlighted with a yellow border

## Technical Implementation

### Components
- `MindMap.tsx` - Main canvas component with drawing logic
- `AddTopicModal.tsx` - Modal for adding new topics
- `useMindMap.ts` - Custom hook for data management

### Data Structure
```typescript
interface MindMapNode {
  id: string;
  label: string;
  x: number;
  y: number;
  connections: string[];
  category: string;
  progress: number;
  lastStudied?: string;
  description?: string;
}
```

### Storage
- **LocalStorage** for persistent data storage
- **Automatic saving** when topics are added or progress is updated
- **Default data** provided for demonstration

### Categories
- **Core**: Fundamental concepts (Programming, Algorithms, Data Structures)
- **Languages**: Programming languages (JavaScript, Python)
- **Frameworks**: Libraries and frameworks (React, Node.js)
- **Domains**: Specialized knowledge areas (Frontend, Backend, Data Science)

## Roadmap Integration

When you click on a node, you're redirected to `/roadmap/[topic]` where you can:
- View detailed learning roadmaps
- Track progress on specific topics
- Access learning resources
- See related topics

## Future Enhancements

### Planned Features
- **3D visualization** using react-three-fiber
- **Zoom functionality** for detailed exploration
- **Search and filter** capabilities
- **Export/import** functionality
- **Collaborative mind maps** for team learning
- **AI-powered topic suggestions** based on learning patterns

### Technical Improvements
- **Performance optimization** for large mind maps
- **Real-time collaboration** features
- **Advanced layout algorithms** for automatic positioning
- **Integration with learning analytics**

## Getting Started

1. **Navigate to the mind map** using the sidebar
2. **Explore existing topics** by clicking on nodes
3. **Add your first topic** using the "Add Topic" button
4. **Connect topics** to build your learning network
5. **Track progress** as you complete learning objectives

The mind map will automatically save your progress and help you visualize your learning journey! 