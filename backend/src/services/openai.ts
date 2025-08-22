import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ProjectData {
  title: string;
  description: string | null;
  techStack: string[];
  category?: string | null;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  title: string | null;
  bio: string | null;
  skills: string[];
  projects: ProjectData[];
}

export class AIService {
  // Generate enhanced project description
  static async generateProjectDescription(project: ProjectData): Promise<string> {
    try {
      const prompt = `
        As a technical writer, create a compelling project description for a software developer's portfolio.
        
        Project: ${project.title}
        Original Description: ${project.description || 'No description'}
        Tech Stack: ${project.techStack.join(', ')}
        Category: ${project.category || 'General'}
        
        Create a professional, engaging description that:
        - Highlights technical achievements
        - Shows problem-solving skills
        - Mentions specific technologies used
        - Demonstrates impact and results
        - Is concise but impactful (2-3 sentences)
        - Sounds professional for job applications
        
        Return only the enhanced description, no additional text.
      `;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 200,
        temperature: 0.7,
      });

      return response.choices[0].message.content?.trim() || project.description || 'No description';
    } catch (error) {
      console.error('Error generating project description:', error);
      return project.description || 'No description available';
    }
  }

  // Generate personalized bio
  static async generatePersonalizedBio(profile: UserProfile): Promise<string> {
    try {
      const prompt = `
        Create a compelling professional bio for a software developer's portfolio.
        
        Name: ${profile.firstName} ${profile.lastName}
        Title: ${profile.title || 'Software Developer'}
        Current Bio: ${profile.bio || 'No bio provided'}
        Skills: ${profile.skills.join(', ')}
        Projects: ${profile.projects.map(p => p.title).join(', ')}
        
        Create a professional bio that:
        - Showcases technical expertise
        - Highlights key achievements
        - Shows passion for technology
        - Is suitable for job applications
        - Is engaging and personable
        - Is 2-3 sentences long
        
        Return only the enhanced bio, no additional text.
      `;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 150,
        temperature: 0.7,
      });

      return response.choices[0].message.content?.trim() || profile.bio || 'Software developer passionate about technology';
    } catch (error) {
      console.error('Error generating bio:', error);
      return profile.bio || 'Software developer passionate about technology';
    }
  }

  // Generate chatbot response
  static async generateChatResponse(userMessage: string, context: UserProfile): Promise<string> {
    try {
      const prompt = `
        You are an AI assistant on ${context.firstName} ${context.lastName}'s portfolio website.
        
        User's background:
        - Name: ${context.firstName} ${context.lastName}
        - Title: ${context.title}
        - Bio: ${context.bio}
        - Skills: ${context.skills.join(', ')}
        - Projects: ${context.projects.map(p => `${p.title}: ${p.description}`).join('\n')}
        
        User question: "${userMessage}"
        
        Respond as a helpful assistant representing ${context.firstName}. Be:
        - Professional and knowledgeable
        - Friendly and conversational
        - Informative about ${context.firstName}'s skills and projects
        - Helpful for potential employers or collaborators
        - Concise (2-3 sentences max)
        
        If asked about contact or hiring, encourage them to use the contact form.
        If asked about specific projects, provide relevant details.
        If asked about skills, highlight relevant experience.
      `;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 200,
        temperature: 0.7,
      });

      return response.choices[0].message.content?.trim() || "Thanks for your message! Please use the contact form to get in touch.";
    } catch (error) {
      console.error('Error generating chat response:', error);
      return "Thanks for your message! Please use the contact form to get in touch.";
    }
  }

  // Generate skill recommendations
  static async generateSkillRecommendations(currentSkills: string[], targetRole: string): Promise<string[]> {
    try {
      const prompt = `
        Based on these current skills: ${currentSkills.join(', ')}
        
        Recommend 5 additional skills that would be valuable for a ${targetRole} role.
        
        Return only the skill names, one per line, no additional text.
      `;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 100,
        temperature: 0.7,
      });

      const recommendations = response.choices[0].message.content?.trim().split('\n') || [];
      return recommendations.filter(skill => skill.trim().length > 0);
    } catch (error) {
      console.error('Error generating skill recommendations:', error);
      return [];
    }
  }
}