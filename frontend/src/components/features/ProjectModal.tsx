import React from 'react';
import { X, ExternalLink, Github, Calendar, Users, Code, Zap } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  status: string;
  category?: string;
  createdAt: string;
}

interface ProjectModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Code className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{project.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Project Status Badge */}
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              project.status === 'completed' 
                ? 'bg-green-100 text-green-700' 
                : project.status === 'in-progress'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}>
              {project.status === 'completed' ? '✅ Completed' : 
               project.status === 'in-progress' ? '🚧 In Progress' : '📋 Planned'}
            </span>
            {project.featured && (
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                ⭐ Featured
              </span>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-600" />
              Project Overview
            </h3>
            <p className="text-gray-700 leading-relaxed">{project.description}</p>
          </div>
          
          {/* Technologies */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Code className="w-5 h-5 text-blue-600" />
              Technologies Used
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
          
          {/* Project Details */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-5 h-5" />
              <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-5 h-5" />
              <span>Category: {project.category || 'General'}</span>
            </div>
          </div>

          {/* Key Features */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                Full-stack development with modern technologies
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                Responsive design for all devices
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                Production-ready deployment
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                Clean, maintainable code architecture
              </li>
            </ul>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t border-gray-200">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex items-center gap-2"
              >
                <Github className="w-5 h-5" />
                View Code
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary flex items-center gap-2"
              >
                <ExternalLink className="w-5 h-5" />
                Live Demo
              </a>
            )}
            {!project.githubUrl && !project.liveUrl && (
              <div className="text-gray-500 italic">
                Links will be available once the project is deployed
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


// // ProjectModal component 
// import React from 'react';
// import { X, ExternalLink, Github, Calendar, Users } from 'lucide-react';

// interface Project {
//   id: number;
//   title: string;
//   description: string;
//   techStack: string[];
//   githubUrl: string;
//   liveUrl?: string;
//   featured: boolean;
//   status: string;
//   category: string;
//   createdAt: string;
// }

// interface ProjectModalProps {
//   project: Project;
//   isOpen: boolean;
//   onClose: () => void;
// }

// export const ProjectModal: React.FC<ProjectModalProps> = ({ project, isOpen, onClose }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//         <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
//           <h2 className="text-2xl font-bold text-gray-900">{project.title}</h2>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//           >
//             <X className="w-6 h-6" />
//           </button>
//         </div>
        
//         <div className="p-6 space-y-6">
//             <div>
//                 <h3 className="text-lg font-semibold text-gray-900 mb-3">Overview</h3>
//                 <p className="text-gray-700 leading-relaxed">{project.description}</p>
//             </div>
            
//         <div>
//             <h3 className="text-lg font-semibold text-gray-900 mb-3">Technologies Used</h3>
//             <div className="flex flex-wrap gap-2">
//                 {project.techStack.map((tech, index) => (
//                 <span
//                   key={index}
//                   className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
//                 >
//                 {tech}
//                 </span>
//                 ))}
//             </div>
//         </div>
          
//         <div className="grid md:grid-cols-2 gap-4">
//             <div className="flex items-center gap-2 text-gray-600">
//                 <Calendar className="w-5 h-5" />
//                 <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
//             </div>
//             <div className="flex items-center gap-2 text-gray-600">
//                 <Users className="w-5 h-5" />
//                 <span>Status: {project.status}</span>
//             </div>
//         </div>
        
//         <div className="flex gap-4 pt-4">
//             <a
//                 href={project.githubUrl}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="btn-primary flex items-center gap-2"
//             >
//               <Github className="w-5 h-5" />
//               View Code
//             </a>
//             {project.liveUrl && (
//                 <a
//                     href={project.liveUrl}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="btn-secondary flex items-center gap-2"
//                 >
//                 <ExternalLink className="w-5 h-5" />
//                 Live Demo
//               </a>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
