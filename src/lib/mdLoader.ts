import matter from 'gray-matter';

// Vite's glob import feature to load all markdown files from src directory
const modules = import.meta.glob('./content/blog/*.md', { query: '?raw', import: 'default', eager: true });

export interface BlogPostFrontmatter {
  title: string;
  description?: string;
  date: string;
  tags: string[];
  category?: string;
  author?: string;
  image?: string;
  published: boolean;
}

export interface ParsedBlogPost {
  slug: string;
  frontmatter: BlogPostFrontmatter;
  content: string;
}

// Parse all markdown files
export const parseBlogPosts = (): ParsedBlogPost[] => {
  const posts: ParsedBlogPost[] = [];

  console.log('🔍 Debug: MDLoader called');
  console.log('🔍 Debug: Modules object:', modules);
  console.log('🔍 Debug: Available modules:', Object.keys(modules));
  console.log('🔍 Debug: Module count:', Object.keys(modules).length);

  for (const [path, content] of Object.entries(modules)) {
    try {
      console.log(`🔍 Debug: Processing file: ${path}`);
      console.log(`🔍 Debug: Content type:`, typeof content);
      console.log(`🔍 Debug: Content preview:`, content ? (content as string).substring(0, 100) : 'No content');
      
      // Extract slug from file path
      const slug = path.split('/').pop()?.replace('.md', '') || '';
      console.log(`🔍 Debug: Generated slug: ${slug} from path: ${path}`);
      
      // Parse frontmatter and content
      const { data: frontmatter, content: markdown } = matter(content as string);
      console.log(`🔍 Debug: Parsed frontmatter:`, frontmatter);
      
      // Validate required frontmatter fields
      if (!frontmatter.title || !frontmatter.date || !frontmatter.published) {
        console.warn(`⚠️ Skipping invalid blog post: ${slug}`, {
          title: frontmatter.title,
          date: frontmatter.date,
          published: frontmatter.published
        });
        continue;
      }

      const post = {
        slug,
        frontmatter: {
          title: frontmatter.title,
          description: frontmatter.description || '',
          date: frontmatter.date,
          tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
          category: frontmatter.category || '',
          author: frontmatter.author || '',
          image: frontmatter.image || '',
          published: Boolean(frontmatter.published)
        },
        content: markdown
      };

      console.log(`✅ Successfully parsed post: ${post.slug}`);
      posts.push(post);
    } catch (error) {
      console.error(`❌ Error parsing blog post ${path}:`, error);
    }
  }

  console.log(`🔍 Debug: Total parsed posts: ${posts.length}`);
  
  // Sort by date (newest first)
  const sortedPosts = posts.sort((a, b) => 
    new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
  );
  
  console.log(`🔍 Debug: Final posts:`, sortedPosts.map(p => ({ slug: p.slug, title: p.frontmatter.title })));
  
  return sortedPosts;
};

// Cache parsed posts for performance
let cachedPosts: ParsedBlogPost[] | null = null;

export const getBlogPosts = (): ParsedBlogPost[] => {
  if (cachedPosts === null) {
    cachedPosts = parseBlogPosts();
  }
  return cachedPosts;
};

// Clear cache (useful for development)
export const clearBlogPostsCache = (): void => {
  cachedPosts = null;
};