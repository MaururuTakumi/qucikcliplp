import { Buffer } from 'buffer';
import matter from 'gray-matter';

// Make Buffer available globally for gray-matter
if (typeof globalThis !== 'undefined') {
  globalThis.Buffer = Buffer;
} else if (typeof window !== 'undefined') {
  (window as any).Buffer = Buffer;
}

// Import MD files directly as raw text
import appClipPost from '../content/blog/app-clip-future-of-payments.md?raw';
import qrTrendsPost from '../content/blog/qr-payment-trends-2024.md?raw';
import testPost from '../content/blog/test-new-md-system.md?raw';
import uxPost from '../content/blog/user-experience-design-principles.md?raw';

export interface BlogPostData {
  slug: string;
  title: string;
  description?: string;
  content: string;
  date: string;
  tags: string[];
  category?: string;
  author?: string;
  image?: string;
  published: boolean;
}

// Parse a single markdown file
const parseMarkdownFile = (rawContent: string, slug: string): BlogPostData | null => {
  try {
    const { data: frontmatter, content } = matter(rawContent);
    
    if (!frontmatter.title || !frontmatter.date || !frontmatter.published) {
      console.warn(`⚠️ Invalid blog post: ${slug}`);
      return null;
    }

    return {
      slug,
      title: frontmatter.title,
      description: frontmatter.description || '',
      content,
      date: frontmatter.date,
      tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
      category: frontmatter.category || '',
      author: frontmatter.author || '',
      image: frontmatter.image || '',
      published: Boolean(frontmatter.published)
    };
  } catch (error) {
    console.error(`❌ Error parsing ${slug}:`, error);
    return null;
  }
};

// Static list of all blog posts
export const getStaticBlogPosts = (): BlogPostData[] => {
  console.log('📄 Loading static blog posts...');
  
  const rawPosts = [
    { content: appClipPost, slug: 'app-clip-future-of-payments' },
    { content: qrTrendsPost, slug: 'qr-payment-trends-2024' },
    { content: testPost, slug: 'test-new-md-system' },
    { content: uxPost, slug: 'user-experience-design-principles' }
  ];

  const posts: BlogPostData[] = [];
  
  for (const { content, slug } of rawPosts) {
    console.log(`🔍 Processing: ${slug}`);
    const parsed = parseMarkdownFile(content, slug);
    if (parsed) {
      posts.push(parsed);
      console.log(`✅ Successfully loaded: ${parsed.title}`);
    }
  }

  // Sort by date (newest first)
  const sortedPosts = posts.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  console.log(`📄 Total loaded posts: ${sortedPosts.length}`);
  return sortedPosts;
};