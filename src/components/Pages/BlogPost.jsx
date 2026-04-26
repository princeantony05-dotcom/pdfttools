import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Tag, ChevronLeft, Share2, ExternalLink } from 'lucide-react';
import { getPosts } from '../../utils/blogStore';

const BlogPost = ({ postId, onBack, onSelectTool }) => {
  const [post, setPost] = useState(null);

  useEffect(() => {
    const posts = getPosts();
    const found = posts.find(p => p.id === postId);
    setPost(found);
    
    if (found) {
      document.title = `${found.title} | PDFElite Blog`;
    }
  }, [postId]);

  if (!post) return <div style={{ textAlign: 'center', padding: '5rem' }}>Post not found</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <button 
        onClick={onBack}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          background: 'none', 
          border: 'none', 
          color: 'var(--text-muted)', 
          cursor: 'pointer',
          marginBottom: '2rem',
          fontSize: '1rem'
        }}
      >
        <ChevronLeft size={20} /> Back to Blog
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <img 
          src={post.image} 
          alt={post.title} 
          style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '24px', marginBottom: '2.5rem' }}
        />

        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={18} /> {post.date}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Tag size={18} /> {post.category}
          </span>
        </div>

        <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', lineHeight: '1.2' }}>{post.title}</h1>

        <div className="blog-content" style={{ 
          fontSize: '1.1rem', 
          lineHeight: '1.8', 
          color: 'var(--text)',
          marginBottom: '4rem'
        }}>
          {post.content.split('\n').map((para, i) => {
            if (para.startsWith('###')) return <h3 key={i} style={{ marginTop: '2rem', marginBottom: '1rem' }}>{para.replace('###', '')}</h3>;
            if (para.startsWith('-')) return <li key={i} style={{ marginLeft: '1.5rem', marginBottom: '0.5rem' }}>{para.replace('-', '').trim()}</li>;
            if (para.includes('[') && para.includes(']')) {
              // Very simple link parsing for the demonstration
              const parts = para.split(/\[|\]/);
              return (
                <p key={i} style={{ marginBottom: '1.5rem' }}>
                  {parts[0]}
                  <button 
                    onClick={() => onSelectTool(post.toolLink)}
                    style={{ 
                      color: 'var(--primary)', 
                      fontWeight: 600, 
                      background: 'none', 
                      border: 'none', 
                      cursor: 'pointer',
                      padding: 0,
                      textDecoration: 'underline',
                      fontSize: 'inherit'
                    }}
                  >
                    {parts[1]}
                  </button>
                  {parts[2]}
                </p>
              );
            }
            return <p key={i} style={{ marginBottom: '1.5rem' }}>{para}</p>;
          })}
        </div>

        {/* Call to Action Box */}
        <div style={{ 
          backgroundColor: 'var(--primary)', 
          padding: '3rem', 
          borderRadius: '24px', 
          color: 'white', 
          textAlign: 'center',
          marginBottom: '4rem'
        }}>
          <h2 style={{ color: 'white', marginBottom: '1rem' }}>Ready to process your PDF?</h2>
          <p style={{ opacity: 0.9, marginBottom: '2rem' }}>Use our secure, browser-side tools for professional results.</p>
          <button 
            className="btn-primary" 
            style={{ backgroundColor: 'white', color: 'var(--primary)', border: 'none' }}
            onClick={() => onSelectTool(post.toolLink || 'merge')}
          >
            Try the {post.toolLink ? post.toolLink.toUpperCase() : 'PDF'} Tool <ExternalLink size={18} style={{ marginLeft: '0.5rem' }} />
          </button>
        </div>

        {/* Keywords for SEO Footer */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem', marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <Share2 size={16} /> Keywords: {post.keywords}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BlogPost;
