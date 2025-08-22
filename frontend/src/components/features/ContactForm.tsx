import React, { useState } from 'react';
import { Mail, User, MessageSquare, Send } from 'lucide-react';

export const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://ai-developer-portfolio-production.up.railway.app'}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
      } else {
        console.error('Contact form error:', data.error);
        alert(data.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      alert('Failed to send message. Please try again.');
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="glass-effect rounded-xl p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Mail className="text-blue-600" />
          Get In Touch
        </h3>
        
        {submitted ? (
          <div className="text-center py-8">
            <div className="text-green-600 text-lg font-semibold mb-2">
              Message sent successfully! 🎉
            </div>
            <p className="text-gray-600">I'll get back to you soon.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline w-4 h-4 mr-2" />
                Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="inline w-4 h-4 mr-2" />
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your.email@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MessageSquare className="inline w-4 h-4 mr-2" />
                Message
              </label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tell me about your project or opportunity..."
              />
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary flex items-center justify-center gap-2 py-3"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Message
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};