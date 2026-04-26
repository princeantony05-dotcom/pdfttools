const BLOG_STORAGE_KEY = 'pdf_elite_blog_posts';

const initialPosts = [
  {
    id: '1',
    title: 'How to Merge Multiple PDF Files Securely',
    category: 'Tutorials',
    content: 'Merging PDF files is a common task. With PDFElite, you can do it directly in your browser without uploading your sensitive documents to any server.\n\n### Why use PDFElite for merging?\n- **Privacy**: Your files never leave your device.\n- **Speed**: Processing happens locally.\n- **Simplicity**: Just drag and drop.\n\nYou can try our [Merge PDF](/merge) tool now!',
    toolLink: 'merge',
    date: '2026-04-20',
    image: 'https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?auto=format&fit=crop&q=80&w=800',
    keywords: 'merge pdf, combine pdf, secure pdf merging, browser-side pdf tools'
  },
  {
    id: '2',
    title: 'Compressing PDFs for Email Attachments',
    category: 'Tutorials',
    content: 'Large PDF files can be a pain to email. PDFElite offers a powerful compression tool that reduces file size while maintaining high quality.\n\n### Key Benefits\n- High compression ratio\n- No quality loss for text\n- Perfect for resumes and portfolios\n\nCheck out the [Compress PDF](/compress) tool.',
    toolLink: 'compress',
    date: '2026-04-22',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
    keywords: 'compress pdf, reduce pdf size, email pdf, small pdf'
  }
];

export const getPosts = () => {
  const stored = localStorage.getItem(BLOG_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(initialPosts));
    return initialPosts;
  }
  return JSON.parse(stored);
};

export const savePost = (post) => {
  const posts = getPosts();
  const newPosts = [
    {
      ...post,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0]
    },
    ...posts
  ];
  localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(newPosts));
  return newPosts;
};

export const deletePost = (id) => {
  const posts = getPosts();
  const newPosts = posts.filter(p => p.id !== id);
  localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(newPosts));
  return newPosts;
};
