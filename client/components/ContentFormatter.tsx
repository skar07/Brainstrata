import React from 'react';
import { CheckCircle, AlertCircle, Info, Lightbulb, BookOpen, Target, Zap, Star } from 'lucide-react';

interface FormattedContent {
  type: 'heading' | 'paragraph' | 'list' | 'definition' | 'example' | 'tip' | 'warning' | 'highlight' | 'smallBold';
  content: string | string[];
  level?: number;
  icon?: React.ComponentType<{ className?: string }>;
}

interface ContentFormatterProps {
  content: string;
  className?: string;
}

const ContentFormatter: React.FC<ContentFormatterProps> = ({ content, className = '' }) => {
    console.log(content);
  const formatContent = (rawContent: string): FormattedContent[] => {
    const sections: FormattedContent[] = [];
    const lines = rawContent.split('\n').filter(line => line.trim());
    
    let currentSection: FormattedContent | null = null;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Detect headings (lines starting with # or all caps followed by colon)
      if (line.match(/^#{1,3}\s/) || (line.match(/^[A-Z\s]+:$/) && line.length < 50)) {
        if (currentSection) sections.push(currentSection);
        currentSection = {
          type: 'heading',
          content: line.replace(/^#{1,3}\s/, '').replace(/:$/, ''),
          level: line.startsWith('###') ? 3 : line.startsWith('##') ? 2 : 1,
          icon: getIconForHeading(line.replace(/^#{1,3}\s/, '').replace(/:$/, ''))
        };
        continue;
      }
      
      // Detect #### as small bold text (not heading)
      if (line.match(/^####\s/)) {
        if (currentSection) sections.push(currentSection);
        currentSection = {
          type: 'smallBold',
          content: line.replace(/^####\s/, '')
        };
        continue;
      }
      
      // Detect definitions (term: definition pattern)
      if (line.match(/^[A-Z][a-zA-Z\s]+:\s/)) {
        if (currentSection) sections.push(currentSection);
        currentSection = {
          type: 'definition',
          content: line,
          icon: BookOpen
        };
        continue;
      }
      
      // Detect examples (lines starting with "Example:", "For example:", etc.)
      if (line.match(/^(Example|For example|E\.g\.|Such as):/i)) {
        if (currentSection) sections.push(currentSection);
        currentSection = {
          type: 'example',
          content: line.replace(/^(Example|For example|E\.g\.|Such as):\s*/i, ''),
          icon: Lightbulb
        };
        continue;
      }
      
      // Detect tips (lines starting with "Tip:", "Note:", "Remember:", etc.)
      if (line.match(/^(Tip|Note|Remember|Important|Key point):/i)) {
        if (currentSection) sections.push(currentSection);
        currentSection = {
          type: 'tip',
          content: line.replace(/^(Tip|Note|Remember|Important|Key point):\s*/i, ''),
          icon: Info
        };
        continue;
      }
      
      // Detect warnings (lines starting with "Warning:", "Caution:", etc.)
      if (line.match(/^(Warning|Caution|Be careful|Avoid):/i)) {
        if (currentSection) sections.push(currentSection);
        currentSection = {
          type: 'warning',
          content: line.replace(/^(Warning|Caution|Be careful|Avoid):\s*/i, ''),
          icon: AlertCircle
        };
        continue;
      }
      
      // Detect lists (lines starting with -, *, •, or numbers)
      if (line.match(/^[\-\*•]\s/) || line.match(/^\d+\.\s/)) {
        if (currentSection && currentSection.type === 'list') {
          (currentSection.content as string[]).push(line.replace(/^[\-\*•]\s/, '').replace(/^\d+\.\s/, ''));
        } else {
          if (currentSection) sections.push(currentSection);
          currentSection = {
            type: 'list',
            content: [line.replace(/^[\-\*•]\s/, '').replace(/^\d+\.\s/, '')],
            icon: CheckCircle
          };
        }
        continue;
      }
      
      // Detect highlighted text (lines with ** or __)
      if (line.includes('**') || line.includes('__')) {
        if (currentSection) sections.push(currentSection);
        currentSection = {
          type: 'highlight',
          content: line.replace(/\*\*/g, '').replace(/__/g, ''),
          icon: Star
        };
        continue;
      }
      
      // Regular paragraphs
      if (line.length > 0) {
        if (currentSection && currentSection.type === 'paragraph') {
          currentSection.content += '\n' + line;
        } else {
          if (currentSection) sections.push(currentSection);
          currentSection = {
            type: 'paragraph',
            content: line
          };
        }
      }
    }
    
    if (currentSection) sections.push(currentSection);
    return sections;
  };

  const getIconForHeading = (heading: string): React.ComponentType<{ className?: string }> => {
    const lowerHeading = heading.toLowerCase();
    if (lowerHeading.includes('definition') || lowerHeading.includes('what is')) return BookOpen;
    if (lowerHeading.includes('example') || lowerHeading.includes('instance')) return Lightbulb;
    if (lowerHeading.includes('tip') || lowerHeading.includes('note')) return Info;
    if (lowerHeading.includes('warning') || lowerHeading.includes('caution')) return AlertCircle;
    if (lowerHeading.includes('benefit') || lowerHeading.includes('advantage')) return CheckCircle;
    if (lowerHeading.includes('goal') || lowerHeading.includes('objective')) return Target;
    if (lowerHeading.includes('quick') || lowerHeading.includes('fast')) return Zap;
    return BookOpen;
  };

  const renderSection = (section: FormattedContent, index: number) => {
    const IconComponent = section.icon;
    
    switch (section.type) {
      case 'heading':
        const HeadingTag = section.level === 1 ? 'h1' : section.level === 2 ? 'h2' : 'h3';
        return (
          <div key={index} className="flex items-center gap-3 mb-4 mt-6 first:mt-0">
            {IconComponent && (
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <IconComponent className="w-4 h-4 text-white" />
              </div>
            )}
            <HeadingTag className={`font-bold text-gray-900 ${
              section.level === 1 ? 'text-2xl md:text-3xl' : 
              section.level === 2 ? 'text-xl md:text-2xl' : 'text-lg md:text-xl'
            }`}>
              {section.content}
            </HeadingTag>
          </div>
        );

      case 'definition':
        return (
          <div key={index} className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg mb-4">
            <div className="flex items-start gap-3">
              {IconComponent && <IconComponent className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />}
              <div className="text-blue-900">
                <strong>Definition:</strong> {section.content}
              </div>
            </div>
          </div>
        );

      case 'example':
        return (
          <div key={index} className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg mb-4">
            <div className="flex items-start gap-3">
              {IconComponent && <IconComponent className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />}
              <div className="text-green-900">
                <strong>Example:</strong> {section.content}
              </div>
            </div>
          </div>
        );

      case 'tip':
        return (
          <div key={index} className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg mb-4">
            <div className="flex items-start gap-3">
              {IconComponent && <IconComponent className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />}
              <div className="text-yellow-900">
                <strong>Tip:</strong> {section.content}
              </div>
            </div>
          </div>
        );

      case 'warning':
        return (
          <div key={index} className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg mb-4">
            <div className="flex items-start gap-3">
              {IconComponent && <IconComponent className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />}
              <div className="text-red-900">
                <strong>Warning:</strong> {section.content}
              </div>
            </div>
          </div>
        );

      case 'list':
        return (
          <div key={index} className="mb-4">
            <ul className="space-y-2">
              {(section.content as string[]).map((item, idx) => {
                // Split item by colon to separate heading from description
                const parts = item.split(':');
                const heading = parts[0];
                const description = parts.slice(1).join(':');
                
                return (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      <span className="font-semibold text-gray-800">
                        {heading.replace(/\*\*/g, '').replace(/\*/g, '')}:
                      </span>
                      {description.replace(/\*\*/g, '').replace(/\*/g, '')}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        );

      case 'highlight':
        return (
          <div key={index} className="bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-200 p-4 rounded-lg mb-4">
            <div className="flex items-start gap-3">
              {IconComponent && <IconComponent className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />}
              <div className="text-gray-800 font-medium">
                {section.content}
              </div>
            </div>
          </div>
        );

      case 'paragraph':
      default:
        return (
          <p key={index} className="text-gray-700 leading-relaxed mb-4 last:mb-0">
            {section.content}
          </p>
        );
    }
  };

  const formattedSections = formatContent(content);

  return (
    <div className={`prose prose-lg max-w-none ${className}`}>
      {formattedSections.map((section, index) => renderSection(section, index))}
    </div>
  );
};

export default ContentFormatter; 