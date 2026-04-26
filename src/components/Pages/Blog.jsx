import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Tag, ArrowRight, Search } from 'lucide-react';
import { getPosts } from '../../utils/blogStore';

const Blog = ({ onSelectPost }) => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setPosts(getPosts());
  }, []);

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.keywords.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>PDFMasterstool Blog</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Tips, tutorials, and updates on managing your documents securely.</p>
        
        <div style={{ 
          maxWidth: '500px', 
          margin: '2rem auto 0', 
          position: 'relative'
        }}>
          <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search articles, keywords, or tools..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '14px 14px 14px 48px', 
              borderRadius: '30px', 
              border: '1px solid var(--border)', 
              background: 'white',
              fontSize: '1rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}
          />
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
        gap: '2.5rem' 
      }}>
        {filteredPosts.map((post, index) => (
          <motion.div 
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card"
            style={{ 
              overflow: 'hidden', 
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column'
            }}
            onClick={() => onSelectPost(post.id)}
          >
            <div style={{ height: '200px', overflow: 'hidden' }}>
              <img 
                src={post.image} 
                alt={post.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              />
            </div>
            <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Calendar size={14} /> {post.date}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Tag size={14} /> {post.category}
                </span>
              </div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', lineHeight: '1.3' }}>{post.title}</h3>
              <p style={{ 
                fontSize: '0.95rem', 
                color: 'var(--text-muted)', 
                lineHeight: '1.6',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                marginBottom: '2rem'
              }}>
                {post.content.replace(/[#*`]/g, '')}
              </p>
              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 600 }}>
                Read Full Article <ArrowRight size={18} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          <p>No articles found matching your search.</p>
        </div>
      )}

      {/* SEO Section - Most Searched Keywords */}
      <div style={{ marginTop: '6rem', padding: '3rem', backgroundColor: 'rgba(37, 99, 235, 0.03)', borderRadius: '24px' }}>
        <h4 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Popular PDF Topics</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          {[
            'merge pdf files online', 'how to compress pdf', 'edit pdf free', 'pdf to word converter', 
            'split pdf pages', 'secure pdf editor', 'ocr scanner online', 'protect pdf with password',
            'rotate pdf permanently', 'delete pages from pdf', 'convert jpg to pdf', 'best pdf tools 2026'
          ].map(tag => (
            <span key={tag} style={{ 
              padding: '8px 16px', 
              backgroundColor: 'white', 
              border: '1px solid var(--border)', 
              borderRadius: '20px', 
              fontSize: '0.85rem',
              color: 'var(--text-muted)'
            }}>
              #{tag.replace(/\s+/g, '')}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
