// SkillsFilter component 
import React, { useState } from 'react';
import { Search, Filter, Code, Wrench, Database } from 'lucide-react';

interface Skill {
  id: number;
  name: string;
  category: string;
  proficiency: number;
  yearsExperience: number;
  color: string;
}

interface SkillsFilterProps {
  skills: Skill[];
  onFilterChange: (filteredSkills: Skill[]) => void;
}

export const SkillsFilter: React.FC<SkillsFilterProps> = ({ skills, onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Skills', icon: Filter },
    { id: 'programming', name: 'Programming', icon: Code },
    { id: 'framework', name: 'Frameworks', icon: Wrench },
    { id: 'database', name: 'Databases', icon: Database },
  ];

  React.useEffect(() => {
    let filtered = skills;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(skill => skill.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(skill => 
        skill.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    onFilterChange(filtered);
  }, [searchTerm, selectedCategory, skills, onFilterChange]);

  return (
    <div className="glass-effect rounded-xl p-6 mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-secondary-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {category.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};