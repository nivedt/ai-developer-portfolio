import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from './store/store';
import { fetchUserProfile, fetchUserStats } from './store/slices/userSlice';
import { fetchProjects } from './store/slices/projectsSlice';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { profile, stats, isLoading: userLoading } = useSelector((state: RootState) => state.user);
  const { projects, isLoading: projectsLoading } = useSelector((state: RootState) => state.projects);
  const [skills, setSkills] = useState<any[]>([]);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Fetch initial data
    dispatch(fetchUserProfile());
    dispatch(fetchUserStats());
    dispatch(fetchProjects());
    
    // Fetch skills
    fetchSkills();
  }, [dispatch]);

  const fetchSkills = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/skills');
      const data = await response.json();
      if (data.success) {
        setSkills(data.data.skills);
      }
    } catch (error) {
      console.error('Failed to fetch skills:', error);
    }
  };

  if (userLoading || projectsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading your portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-primary-50 to-accent-50'}`}>
      {/* Header */}
      <header className={`backdrop-blur-md border-b sticky top-0 z-50 transition-colors duration-300 ${
        darkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-white/20'
      }`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg"></div>
              <span className={`text-xl font-bold transition-colors ${darkMode ? 'text-white' : 'text-secondary-900'}`}>
                {profile ? `${profile.firstName} ${profile.lastName}` : 'Portfolio'}
              </span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#about" className={`transition-colors hover:text-primary-600 ${darkMode ? 'text-gray-300' : 'text-secondary-600'}`}>About</a>
              <a href="#projects" className={`transition-colors hover:text-primary-600 ${darkMode ? 'text-gray-300' : 'text-secondary-600'}`}>Projects</a>
              <a href="#skills" className={`transition-colors hover:text-primary-600 ${darkMode ? 'text-gray-300' : 'text-secondary-600'}`}>Skills</a>
              <a href="#contact" className={`transition-colors hover:text-primary-600 ${darkMode ? 'text-gray-300' : 'text-secondary-600'}`}>Contact</a>
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition-colors ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-600'}`}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="mb-8">
            {profile?.avatarUrl ? (
              <img 
                src={profile.avatarUrl} 
                alt={`${profile.firstName} ${profile.lastName}`}
                className="w-32 h-32 rounded-full mx-auto border-4 border-white shadow-xl"
              />
            ) : (
              <div className="w-32 h-32 bg-gradient-to-r from-primary-400 to-accent-400 rounded-full mx-auto border-4 border-white shadow-xl flex items-center justify-center">
                <span className="text-white text-4xl font-bold">
                  {profile ? `${profile.firstName[0]}${profile.lastName[0]}` : 'NT'}
                </span>
              </div>
            )}
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-secondary-900 mb-6">
            Hi, I'm{' '}
            <span className="gradient-text">
              {profile ? profile.firstName : 'Niveditha'}
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-secondary-600 mb-4">
            {profile?.title || 'Software Developer'}
          </p>
          
          <p className="text-lg text-secondary-500 max-w-2xl mx-auto mb-12">
            {profile?.bio || 'Aspiring software developer passionate about AI and full-stack development'}
          </p>

          {/* Stats */}
          <div className="flex justify-center space-x-8 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">{stats?.projects || 0}</div>
              <div className="text-sm text-secondary-500">Projects</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">{stats?.skills || 0}</div>
              <div className="text-sm text-secondary-500">Skills</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">{stats?.experience || 0}+</div>
              <div className="text-sm text-secondary-500">Years Experience</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#projects" className="btn-primary">
              View My Work
            </a>
            <a href="#contact" className="btn-outline">
              Get In Touch
            </a>
          </div>
        </div>
      </section>

      {/* Projects Preview */}
      {projects.length > 0 && (
        <section id="projects" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-3xl font-bold text-secondary-900 text-center mb-12">
            Featured Projects
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.slice(0, 6).map((project: any) => (
              <div key={project.id} className="glass-effect rounded-xl p-6 card-hover">
                <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                  {project.title}
                </h3>
                <p className="text-secondary-600 mb-4 line-clamp-3">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.techStack.slice(0, 3).map((tech: string, index: number) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex space-x-4">
                  {project.githubUrl && (
                    <a 
                      href={project.githubUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-secondary-600 hover:text-primary-600 transition-colors"
                    >
                      GitHub
                    </a>
                  )}
                  {project.liveUrl && (
                    <a 
                      href={project.liveUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-secondary-600 hover:text-primary-600 transition-colors"
                    >
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills Section */}
      {skills.length > 0 && (
        <section id="skills" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className={`text-3xl font-bold text-center mb-12 ${darkMode ? 'text-white' : 'text-secondary-900'}`}>
            Technical Skills
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skills.map((skill: any) => (
              <div 
                key={skill.id} 
                className={`p-6 rounded-xl backdrop-blur-md border transition-all duration-300 hover:scale-105 ${
                  darkMode 
                    ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800/70' 
                    : 'bg-white/10 border-white/20 hover:bg-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-secondary-900'}`}>
                    {skill.name}
                  </h3>
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{ 
                      backgroundColor: skill.color + '20', 
                      color: skill.color 
                    }}
                  >
                    {skill.category}
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="mb-3">
                  <div className={`flex justify-between text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-secondary-600'}`}>
                    <span>Proficiency</span>
                    <span>{skill.proficiency}/5</span>
                  </div>
                  <div className={`w-full rounded-full h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div 
                      className="h-2 rounded-full transition-all duration-1000"
                      style={{ 
                        width: `${(skill.proficiency / 5) * 100}%`,
                        backgroundColor: skill.color 
                      }}
                    ></div>
                  </div>
                </div>
                
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-secondary-500'}`}>
                  {skill.yearsExperience} years experience
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className={`py-12 ${darkMode ? 'bg-gray-900' : 'bg-secondary-900'} text-white`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-secondary-300">
            © 2025 {profile ? `${profile.firstName} ${profile.lastName}` : 'Niveditha Thota'}. 
            Built with React, TypeScript, and passion.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;


//////////////////////////////////////////
// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState, AppDispatch } from './store/store';
// import { fetchUserProfile, fetchUserStats } from './store/slices/userSlice';
// import { fetchProjects } from './store/slices/projectsSlice';

// function App() {
//   const dispatch = useDispatch<AppDispatch>();
//   const { profile, stats, isLoading: userLoading } = useSelector((state: RootState) => state.user);
//   const { projects, isLoading: projectsLoading } = useSelector((state: RootState) => state.projects);

//   useEffect(() => {
//     // Fetch initial data
//     dispatch(fetchUserProfile());
//     dispatch(fetchUserStats());
//     dispatch(fetchProjects());
//   }, [dispatch]);

//   if (userLoading || projectsLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="loading-spinner mx-auto mb-4"></div>
//           <p className="text-secondary-600">Loading your portfolio...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50">
//       {/* Header */}
//       <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
//         <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center py-4">
//             <div className="flex items-center space-x-2">
//               <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg"></div>
//               <span className="text-xl font-bold text-secondary-900">
//                 {profile ? `${profile.firstName} ${profile.lastName}` : 'Portfolio'}
//               </span>
//             </div>
//             <div className="hidden md:flex space-x-8">
//               <a href="#about" className="text-secondary-600 hover:text-primary-600 transition-colors">About</a>
//               <a href="#projects" className="text-secondary-600 hover:text-primary-600 transition-colors">Projects</a>
//               <a href="#skills" className="text-secondary-600 hover:text-primary-600 transition-colors">Skills</a>
//               <a href="#contact" className="text-secondary-600 hover:text-primary-600 transition-colors">Contact</a>
//             </div>
//           </div>
//         </nav>
//       </header>

//       {/* Hero Section */}
//       <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
//         <div className="text-center">
//           <div className="mb-8">
//             {profile?.avatarUrl ? (
//               <img 
//                 src={profile.avatarUrl} 
//                 alt={`${profile.firstName} ${profile.lastName}`}
//                 className="w-32 h-32 rounded-full mx-auto border-4 border-white shadow-xl"
//               />
//             ) : (
//               <div className="w-32 h-32 bg-gradient-to-r from-primary-400 to-accent-400 rounded-full mx-auto border-4 border-white shadow-xl flex items-center justify-center">
//                 <span className="text-white text-4xl font-bold">
//                   {profile ? `${profile.firstName[0]}${profile.lastName[0]}` : 'NT'}
//                 </span>
//               </div>
//             )}
//           </div>
          
//           <h1 className="text-5xl md:text-6xl font-bold text-secondary-900 mb-6">
//             Hi, I'm{' '}
//             <span className="gradient-text">
//               {profile ? profile.firstName : 'Niveditha'}
//             </span>
//           </h1>
          
//           <p className="text-xl md:text-2xl text-secondary-600 mb-4">
//             {profile?.title || 'Software Developer'}
//           </p>
          
//           <p className="text-lg text-secondary-500 max-w-2xl mx-auto mb-12">
//             {profile?.bio || 'Aspiring software developer passionate about AI and full-stack development'}
//           </p>

//           {/* Stats */}
//           <div className="flex justify-center space-x-8 mb-12">
//             <div className="text-center">
//               <div className="text-3xl font-bold text-primary-600">{stats?.projects || 0}</div>
//               <div className="text-sm text-secondary-500">Projects</div>
//             </div>
//             <div className="text-center">
//               <div className="text-3xl font-bold text-primary-600">{stats?.skills || 0}</div>
//               <div className="text-sm text-secondary-500">Skills</div>
//             </div>
//             <div className="text-center">
//               <div className="text-3xl font-bold text-primary-600">{stats?.experience || 0}+</div>
//               <div className="text-sm text-secondary-500">Years Experience</div>
//             </div>
//           </div>

//           {/* CTA Buttons */}
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <a href="#projects" className="btn-primary">
//               View My Work
//             </a>
//             <a href="#contact" className="btn-outline">
//               Get In Touch
//             </a>
//           </div>
//         </div>
//       </section>

//       {/* Projects Preview */}
//       {projects.length > 0 && (
//         <section id="projects" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
//           <h2 className="text-3xl font-bold text-secondary-900 text-center mb-12">
//             Featured Projects
//           </h2>
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {projects.slice(0, 6).map((project: any) => (
//               <div key={project.id} className="glass-effect rounded-xl p-6 card-hover">
//                 <h3 className="text-xl font-semibold text-secondary-900 mb-3">
//                   {project.title}
//                 </h3>
//                 <p className="text-secondary-600 mb-4 line-clamp-3">
//                   {project.description}
//                 </p>
//                 <div className="flex flex-wrap gap-2 mb-4">
//                   {project.techStack.slice(0, 3).map((tech: string, index: number) => (
//                     <span 
//                       key={index}
//                       className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
//                     >
//                       {tech}
//                     </span>
//                   ))}
//                 </div>
//                 <div className="flex space-x-4">
//                   {project.githubUrl && (
//                     <a 
//                       href={project.githubUrl} 
//                       target="_blank" 
//                       rel="noopener noreferrer"
//                       className="text-secondary-600 hover:text-primary-600 transition-colors"
//                     >
//                       GitHub
//                     </a>
//                   )}
//                   {project.liveUrl && (
//                     <a 
//                       href={project.liveUrl} 
//                       target="_blank" 
//                       rel="noopener noreferrer"
//                       className="text-secondary-600 hover:text-primary-600 transition-colors"
//                     >
//                       Live Demo
//                     </a>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>
//       )}

//       {/* Footer */}
//       <footer className="bg-secondary-900 text-white py-12">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <p className="text-secondary-300">
//             © 2025 {profile ? `${profile.firstName} ${profile.lastName}` : 'Niveditha Thota'}. 
//             Built with React, TypeScript, and passion.
//           </p>
//         </div>
//       </footer>
//     </div>
//   );
// }

// export default App;

//////////////////////////////////////////
// import React from 'react';
// // import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         {/* <img src={logo} className="App-logo" alt="logo" /> */}
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
