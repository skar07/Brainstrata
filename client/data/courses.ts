import { Course } from '@/types/api';

export const mockCourses: Course[] = [
  {
    id: 'ai-fundamentals',
    title: 'AI Fundamentals',
    description: 'Learn the basics of artificial intelligence and machine learning',
    category: 'Technology',
    difficulty: 'Beginner',
    duration: '8 weeks',
    color: 'from-purple-500 to-pink-500',
    progress: 60,
    lessons: [
      {
        id: 'ai-intro',
        title: 'Introduction to AI',
        description: 'What is artificial intelligence and why it matters',
        duration: '45 min',
        order: 1,
        completed: true,
        content: 'Artificial Intelligence (AI) is the simulation of human intelligence in machines...'
      },
      {
        id: 'ml-basics',
        title: 'Machine Learning Basics',
        description: 'Understanding supervised and unsupervised learning',
        duration: '60 min',
        order: 2,
        completed: true,
        content: 'Machine Learning is a subset of AI that enables computers to learn...'
      },
      {
        id: 'neural-networks',
        title: 'Neural Networks',
        description: 'Introduction to neural networks and deep learning',
        duration: '75 min',
        order: 3,
        completed: false,
        content: 'Neural networks are computing systems inspired by biological neural networks...'
      },
      {
        id: 'ai-ethics',
        title: 'AI Ethics',
        description: 'Ethical considerations in AI development',
        duration: '50 min',
        order: 4,
        completed: false,
        content: 'As AI becomes more prevalent, ethical considerations become crucial...'
      }
    ]
  },
  {
    id: 'web-development',
    title: 'Modern Web Development',
    description: 'Full-stack web development with React and Node.js',
    category: 'Technology',
    difficulty: 'Intermediate',
    duration: '12 weeks',
    color: 'from-blue-500 to-cyan-500',
    progress: 25,
    lessons: [
      {
        id: 'html-css',
        title: 'HTML & CSS Fundamentals',
        description: 'Building the foundation of web development',
        duration: '90 min',
        order: 1,
        completed: true,
        content: 'HTML and CSS are the building blocks of web development...'
      },
      {
        id: 'javascript-es6',
        title: 'Modern JavaScript (ES6+)',
        description: 'Advanced JavaScript features and concepts',
        duration: '120 min',
        order: 2,
        completed: false,
        content: 'ES6+ brought many powerful features to JavaScript...'
      },
      {
        id: 'react-intro',
        title: 'Introduction to React',
        description: 'Component-based UI development',
        duration: '150 min',
        order: 3,
        completed: false,
        content: 'React is a JavaScript library for building user interfaces...'
      },
      {
        id: 'nodejs-backend',
        title: 'Node.js Backend Development',
        description: 'Server-side JavaScript with Express',
        duration: '180 min',
        order: 4,
        completed: false,
        content: 'Node.js allows you to run JavaScript on the server...'
      }
    ]
  },
  {
    id: 'data-science',
    title: 'Data Science Essentials',
    description: 'Data analysis, visualization, and statistical modeling',
    category: 'Analytics',
    difficulty: 'Intermediate',
    duration: '10 weeks',
    color: 'from-green-500 to-emerald-500',
    progress: 0,
    lessons: [
      {
        id: 'python-basics',
        title: 'Python for Data Science',
        description: 'Python programming fundamentals for data analysis',
        duration: '120 min',
        order: 1,
        completed: false,
        content: 'Python is the most popular language for data science...'
      },
      {
        id: 'pandas-numpy',
        title: 'Data Manipulation with Pandas',
        description: 'Working with structured data using Pandas',
        duration: '150 min',
        order: 2,
        completed: false,
        content: 'Pandas is a powerful library for data manipulation and analysis...'
      },
      {
        id: 'data-visualization',
        title: 'Data Visualization',
        description: 'Creating compelling visualizations with Matplotlib and Seaborn',
        duration: '90 min',
        order: 3,
        completed: false,
        content: 'Data visualization is crucial for understanding and communicating insights...'
      },
      {
        id: 'statistics',
        title: 'Statistical Analysis',
        description: 'Descriptive and inferential statistics',
        duration: '180 min',
        order: 4,
        completed: false,
        content: 'Statistics provides the foundation for data-driven decision making...'
      }
    ]
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing Mastery',
    description: 'Comprehensive guide to modern digital marketing strategies',
    category: 'Business',
    difficulty: 'Beginner',
    duration: '6 weeks',
    color: 'from-amber-500 to-orange-500',
    progress: 80,
    lessons: [
      {
        id: 'marketing-fundamentals',
        title: 'Marketing Fundamentals',
        description: 'Core principles of digital marketing',
        duration: '60 min',
        order: 1,
        completed: true,
        content: 'Digital marketing encompasses all marketing efforts that use electronic devices...'
      },
      {
        id: 'social-media',
        title: 'Social Media Marketing',
        description: 'Leveraging social platforms for business growth',
        duration: '75 min',
        order: 2,
        completed: true,
        content: 'Social media marketing involves creating content for social media platforms...'
      },
      {
        id: 'content-marketing',
        title: 'Content Marketing Strategy',
        description: 'Creating valuable content that attracts customers',
        duration: '90 min',
        order: 3,
        completed: true,
        content: 'Content marketing is a strategic approach focused on creating valuable content...'
      },
      {
        id: 'analytics',
        title: 'Marketing Analytics',
        description: 'Measuring and optimizing marketing performance',
        duration: '105 min',
        order: 4,
        completed: false,
        content: 'Marketing analytics involves measuring, managing and analyzing marketing performance...'
      }
    ]
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity Fundamentals',
    description: 'Essential cybersecurity concepts and practices',
    category: 'Security',
    difficulty: 'Intermediate',
    duration: '8 weeks',
    color: 'from-red-500 to-pink-500',
    progress: 15,
    lessons: [
      {
        id: 'security-basics',
        title: 'Information Security Basics',
        description: 'Understanding threats, vulnerabilities, and risk',
        duration: '90 min',
        order: 1,
        completed: true,
        content: 'Information security is the practice of protecting digital information...'
      },
      {
        id: 'network-security',
        title: 'Network Security',
        description: 'Securing networks and communications',
        duration: '120 min',
        order: 2,
        completed: false,
        content: 'Network security involves protecting the integrity of networks...'
      },
      {
        id: 'cryptography',
        title: 'Cryptography Essentials',
        description: 'Understanding encryption and digital signatures',
        duration: '150 min',
        order: 3,
        completed: false,
        content: 'Cryptography is the practice of secure communication in the presence of adversaries...'
      },
      {
        id: 'incident-response',
        title: 'Incident Response',
        description: 'Responding to and recovering from security incidents',
        duration: '100 min',
        order: 4,
        completed: false,
        content: 'Incident response is the approach to handling and managing security breaches...'
      }
    ]
  },
  {
    id: 'ui-ux-design',
    title: 'UI/UX Design Principles',
    description: 'Creating intuitive and beautiful user experiences',
    category: 'Design',
    difficulty: 'Beginner',
    duration: '7 weeks',
    color: 'from-indigo-500 to-purple-500',
    progress: 40,
    lessons: [
      {
        id: 'design-thinking',
        title: 'Design Thinking Process',
        description: 'Human-centered approach to innovation',
        duration: '75 min',
        order: 1,
        completed: true,
        content: 'Design thinking is a human-centered approach to innovation...'
      },
      {
        id: 'user-research',
        title: 'User Research Methods',
        description: 'Understanding your users through research',
        duration: '90 min',
        order: 2,
        completed: true,
        content: 'User research helps designers understand user behaviors, needs, and motivations...'
      },
      {
        id: 'wireframing',
        title: 'Wireframing and Prototyping',
        description: 'Creating low and high-fidelity prototypes',
        duration: '120 min',
        order: 3,
        completed: false,
        content: 'Wireframing is the practice of creating simple layouts that outline structure...'
      },
      {
        id: 'visual-design',
        title: 'Visual Design Principles',
        description: 'Color theory, typography, and layout',
        duration: '105 min',
        order: 4,
        completed: false,
        content: 'Visual design focuses on the aesthetics of a product and its related materials...'
      }
    ]
  }
];

export const getCourseById = (id: string): Course | undefined => {
  return mockCourses.find(course => course.id === id);
};

export const getLessonById = (courseId: string, lessonId: string) => {
  const course = getCourseById(courseId);
  return course?.lessons.find(lesson => lesson.id === lessonId);
};

export const getNextLesson = (courseId: string, currentLessonId: string) => {
  const course = getCourseById(courseId);
  if (!course) return null;
  
  const currentIndex = course.lessons.findIndex(lesson => lesson.id === currentLessonId);
  return currentIndex < course.lessons.length - 1 ? course.lessons[currentIndex + 1] : null;
};

export const getPreviousLesson = (courseId: string, currentLessonId: string) => {
  const course = getCourseById(courseId);
  if (!course) return null;
  
  const currentIndex = course.lessons.findIndex(lesson => lesson.id === currentLessonId);
  return currentIndex > 0 ? course.lessons[currentIndex - 1] : null;
}; 