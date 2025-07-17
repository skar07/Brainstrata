

export interface RoadmapItem {
    id: string;
    title: string;
    description: string;
    status: 'completed' | 'in-progress' | 'not-started';
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimatedTime: string;
    resources: string[];
}

export interface TopicData {
    [key: string]: {
        title: string;
        description: string;
        roadmap: RoadmapItem[];
    };
}


export const topicData: TopicData = {
    programming: {
        title: 'Programming Fundamentals',
        description: 'Master the core concepts of programming including variables, control structures, functions, and object-oriented programming.',
        roadmap: [
            {
                id: 'variables',
                title: 'Variables and Data Types',
                description: 'Learn about different data types and how to store information in variables.',
                status: 'completed',
                difficulty: 'beginner',
                estimatedTime: '2 hours',
                resources: ['Variables Tutorial', 'Data Types Guide', 'Practice Exercises']
            },
            {
                id: 'control-structures',
                title: 'Control Structures',
                description: 'Master if statements, loops, and switch statements for program flow control.',
                status: 'completed',
                difficulty: 'beginner',
                estimatedTime: '3 hours',
                resources: ['Control Flow Tutorial', 'Loop Examples', 'Conditional Logic']
            },
            {
                id: 'functions',
                title: 'Functions and Methods',
                description: 'Learn to create reusable code blocks with functions and understand scope.',
                status: 'in-progress',
                difficulty: 'beginner',
                estimatedTime: '4 hours',
                resources: ['Function Basics', 'Parameter Passing', 'Return Values']
            },
            {
                id: 'oop',
                title: 'Object-Oriented Programming',
                description: 'Understand classes, objects, inheritance, and polymorphism.',
                status: 'not-started',
                difficulty: 'intermediate',
                estimatedTime: '6 hours',
                resources: ['OOP Concepts', 'Class Design', 'Inheritance Patterns']
            }
        ]
    },
    javascript: {
        title: 'JavaScript Mastery',
        description: 'From basics to advanced concepts including ES6+, async programming, and modern JavaScript patterns.',
        roadmap: [
            {
                id: 'js-basics',
                title: 'JavaScript Fundamentals',
                description: 'Core JavaScript syntax, variables, functions, and basic DOM manipulation.',
                status: 'completed',
                difficulty: 'beginner',
                estimatedTime: '5 hours',
                resources: ['JS Basics Course', 'DOM Tutorial', 'Practice Projects']
            },
            {
                id: 'es6',
                title: 'ES6+ Features',
                description: 'Modern JavaScript features like arrow functions, destructuring, and modules.',
                status: 'completed',
                difficulty: 'intermediate',
                estimatedTime: '4 hours',
                resources: ['ES6 Guide', 'Modern JS Patterns', 'Code Examples']
            },
            {
                id: 'async',
                title: 'Asynchronous JavaScript',
                description: 'Master promises, async/await, and handling asynchronous operations.',
                status: 'in-progress',
                difficulty: 'intermediate',
                estimatedTime: '5 hours',
                resources: ['Async JS Tutorial', 'Promise Patterns', 'Error Handling']
            }
        ]
    },
    react: {
        title: 'React Development',
        description: 'Build modern user interfaces with React, from components to advanced patterns.',
        roadmap: [
            {
                id: 'components',
                title: 'React Components',
                description: 'Learn about functional and class components, props, and state.',
                status: 'completed',
                difficulty: 'beginner',
                estimatedTime: '4 hours',
                resources: ['React Basics', 'Component Tutorial', 'Props vs State']
            },
            {
                id: 'hooks',
                title: 'React Hooks',
                description: 'Master useState, useEffect, and custom hooks for functional components.',
                status: 'in-progress',
                difficulty: 'intermediate',
                estimatedTime: '5 hours',
                resources: ['Hooks Guide', 'Custom Hooks', 'Best Practices']
            },
            {
                id: 'routing',
                title: 'React Router',
                description: 'Implement client-side routing and navigation in React applications.',
                status: 'not-started',
                difficulty: 'intermediate',
                estimatedTime: '3 hours',
                resources: ['Router Tutorial', 'Navigation Patterns', 'Route Guards']
            }
        ]
    }
};