import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import { getStaticBlogPosts, type BlogPostData } from './staticBlogPosts';

export interface BlogPost {
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

export interface BlogPostMeta {
  slug: string;
  title: string;
  description?: string;
  date: string;
  tags: string[];
  category?: string;
  author?: string;
  image?: string;
  published: boolean;
}

// Configure marked with syntax highlighting and enhanced features
marked.use(markedHighlight({
  langPrefix: 'hljs language-',
  highlight(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    const highlighted = hljs.highlight(code, { language }).value;
    return highlighted;
  }
}));

marked.setOptions({
  breaks: true, // Convert line breaks to <br>
  gfm: true, // GitHub Flavored Markdown
  headerIds: true, // Add IDs to headings
  mangle: false, // Don't escape HTML
  sanitize: false, // Allow HTML (ensure content is trusted)
  smartLists: true, // Use smarter list behavior
  smartypants: true, // Use smart quotes
  xhtml: false, // Don't use XHTML
  pedantic: false, // Don't be pedantic about original markdown bugs
});

// Convert BlogPostData to BlogPost format
const convertStaticPost = (staticPost: BlogPostData): BlogPost => ({
  slug: staticPost.slug,
  title: staticPost.title,
  description: staticPost.description,
  content: staticPost.content,
  date: staticPost.date,
  tags: staticPost.tags,
  category: staticPost.category,
  author: staticPost.author,
  image: staticPost.image,
  published: staticPost.published
});

// Cache for blog posts to prevent infinite loops
let blogPostsCache: BlogPost[] | null = null;
let cacheInitialized = false;

// Get blog posts from actual MD files
const getBlogPostsFromFiles = (): BlogPost[] => {
  // Return cached data if available
  if (cacheInitialized && blogPostsCache) {
    return blogPostsCache;
  }

  try {
    console.log('🔄 Attempting to load blog posts from static imports...');
    const staticPosts = getStaticBlogPosts();
    console.log(`📄 Loaded ${staticPosts.length} posts from static imports`);
    
    if (staticPosts.length === 0) {
      console.log('⚠️ No static posts found, falling back to mock data');
      blogPostsCache = getMockBlogPosts();
      cacheInitialized = true;
      return blogPostsCache;
    }
    
    const processedPosts = staticPosts
      .filter(post => post.published)
      .map(convertStaticPost);
    
    blogPostsCache = processedPosts;
    cacheInitialized = true;
    console.log(`✅ Successfully cached ${processedPosts.length} blog posts`);
    return processedPosts;
  } catch (error) {
    console.error('❌ Error loading blog posts from static imports:', error);
    console.log('🔄 Falling back to mock data');
    // Fallback to mock data in case of error
    blogPostsCache = getMockBlogPosts();
    cacheInitialized = true;
    return blogPostsCache;
  }
};

// Fallback mock data for development/error cases
const getMockBlogPosts = (): BlogPost[] => [
  {
    slug: 'app-clip-future-of-payments',
    title: 'App Clipが切り拓く決済の未来',
    description: 'App Clipを活用したQRコード決済の革新的な体験について解説します。',
    content: `# App Clipが切り拓く決済の未来

App Clipは、アプリをダウンロードすることなく、QRコードをスキャンするだけで瞬時にアプリの機能を利用できる革新的な技術です。

## Quick Clipの革新性

Quick Clipは、この技術を活用して、従来の決済体験を根本的に変革します。

### 主な特徴

1. **瞬時起動**: アプリダウンロード不要
2. **セキュア**: Apple Payとの連携
3. **シンプル**: 直感的なUI/UX

## 導入効果

Quick Clipを導入することで、以下の効果が期待できます：

- **ユーザビリティ向上**: スムーズな決済体験
- **コンバージョン率向上**: 離脱率の大幅減少
- **運用効率化**: 簡単な導入と管理

Quick Clipは、売り手と買い手の両方にとってWin-Winの関係を築く、次世代の決済ソリューションです。`,
    date: '2024-01-15',
    tags: ['App Clip', '決済', 'QRコード', 'フィンテック'],
    category: 'テクノロジー',
    author: 'Honkoma編集部',
    image: '/blog/app-clip-future.jpg',
    published: true
  },
  {
    slug: 'qr-payment-trends-2024',
    title: '2024年のQRコード決済トレンド',
    description: '2024年のQRコード決済市場の動向と今後の展望について詳しく解説します。',
    content: `# 2024年のQRコード決済トレンド

2024年、QRコード決済市場は新たな局面を迎えています。

## 市場の現状

日本国内でのQRコード決済の普及率は着実に上昇しており、特に若年層を中心に利用が拡大しています。

### 統計データ

- 利用率: 45%（2023年比+8%）
- 月間取引額: 1.2兆円
- 主要プレイヤー: PayPay、楽天ペイ、d払い等

## 新しい技術動向

### App Clipの活用

App Clipを活用したQRコード決済は、従来の課題を解決する革新的なアプローチです。

### セキュリティの強化

生体認証との組み合わせにより、より安全な決済体験を提供します。

## 今後の展望

2024年後半には、以下の変化が予想されます：

1. **統合化の進展**: 複数サービスの統合
2. **国際化**: 訪日外国人への対応強化
3. **IoT連携**: スマートデバイスとの連携

Quick Clipは、これらのトレンドを先取りしたソリューションとして、市場をリードしていきます。`,
    date: '2024-01-10',
    tags: ['QRコード決済', '市場分析', 'トレンド', 'フィンテック'],
    category: '市場分析',
    author: 'Honkoma編集部',
    image: '/blog/qr-trends-2024.jpg',
    published: true
  },
  {
    slug: 'user-experience-design-principles',
    title: 'ユーザー体験を重視した決済UIデザイン原則',
    description: '優れた決済体験を提供するためのUIデザイン原則について解説します。',
    content: `# ユーザー体験を重視した決済UIデザイン原則

決済アプリケーションにおいて、ユーザー体験（UX）は成功の鍵を握る重要な要素です。

## 基本原則

### 1. シンプリシティ

複雑な操作を排除し、最小限のステップで決済を完了できるようにします。

### 2. 信頼性

ユーザーが安心して利用できる、信頼性の高いデザインを心がけます。

### 3. 直感性

初回利用者でも迷わず操作できる、直感的なインターフェースを提供します。

## Quick Clipの実装例

Quick Clipでは、以下のデザイン原則を採用しています：

### ワンタップ決済

QRコードスキャン後、Apple Payでワンタップで決済完了。

### 視覚的フィードバック

各ステップで適切な視覚的フィードバックを提供し、ユーザーの不安を解消。

### エラーハンドリング

分かりやすいエラーメッセージと、簡単な復旧手順を提供。

## 測定指標

UXの改善効果は以下の指標で測定できます：

- **コンバージョン率**: 決済完了率
- **離脱率**: 各ステップでの離脱率
- **所要時間**: 決済完了までの時間
- **エラー率**: エラー発生頻度

継続的な改善により、ユーザーにとって最適な決済体験を提供し続けます。`,
    date: '2024-01-05',
    tags: ['UX', 'UI', 'デザイン', '決済'],
    category: 'デザイン',
    author: 'Honkoma編集部',
    image: '/blog/ux-design-principles.jpg',
    published: true
  }
];

// Get all published blog posts
export const getAllBlogPosts = (): BlogPost[] => {
  return getBlogPostsFromFiles();
};

// Get blog post by slug
export const getBlogPostBySlug = (slug: string): BlogPost | null => {
  const allPosts = getBlogPostsFromFiles();
  return allPosts.find(post => post.slug === slug && post.published) || null;
};

// Get blog post metadata only
export const getAllBlogPostMeta = (): BlogPostMeta[] => {
  return getBlogPostsFromFiles()
    .map(({ content, ...meta }) => meta);
};

// Get posts by tag
export const getBlogPostsByTag = (tag: string): BlogPost[] => {
  return getBlogPostsFromFiles().filter(post => 
    post.published && post.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  );
};

// Get posts by category
export const getBlogPostsByCategory = (category: string): BlogPost[] => {
  return getBlogPostsFromFiles().filter(post => 
    post.published && post.category?.toLowerCase() === category.toLowerCase()
  );
};

// Search posts
export const searchBlogPosts = (query: string): BlogPost[] => {
  const lowerQuery = query.toLowerCase();
  return getBlogPostsFromFiles().filter(post => 
    post.published && (
      post.title.toLowerCase().includes(lowerQuery) ||
      post.description?.toLowerCase().includes(lowerQuery) ||
      post.content.toLowerCase().includes(lowerQuery) ||
      post.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
  );
};

// Get all unique tags
export const getAllTags = (): string[] => {
  const tags = new Set<string>();
  getBlogPostsFromFiles().forEach(post => {
    if (post.published) {
      post.tags.forEach(tag => tags.add(tag));
    }
  });
  return Array.from(tags).sort();
};

// Get all unique categories
export const getAllCategories = (): string[] => {
  const categories = new Set<string>();
  getBlogPostsFromFiles().forEach(post => {
    if (post.published && post.category) {
      categories.add(post.category);
    }
  });
  return Array.from(categories).sort();
};

// Convert markdown to HTML with enhanced settings
export const markdownToHtml = (markdown: string): string => {
  return marked(markdown);
};

// Get recent posts
export const getRecentBlogPosts = (limit: number = 5): BlogPost[] => {
  return getAllBlogPosts()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
};

// Get related posts (same category or common tags)
export const getRelatedPosts = (currentPost: BlogPost, limit: number = 3): BlogPost[] => {
  const allPosts = getAllBlogPosts().filter(post => post.slug !== currentPost.slug);
  
  // Score posts based on relationship
  const scoredPosts = allPosts.map(post => {
    let score = 0;
    
    // Same category gets higher score
    if (post.category === currentPost.category) {
      score += 3;
    }
    
    // Common tags get points
    const commonTags = post.tags.filter(tag => currentPost.tags.includes(tag));
    score += commonTags.length;
    
    return { post, score };
  });
  
  // Sort by score and return top posts
  return scoredPosts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.post);
};

// Format date for display
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Generate RSS feed data
export const generateRSSFeed = (): string => {
  const posts = getRecentBlogPosts(20);
  const siteUrl = 'https://honkoma.com';
  
  const rssItems = posts.map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.description || ''}]]></description>
      <link>${siteUrl}/blog/${post.slug}</link>
      <guid>${siteUrl}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      ${post.category ? `<category><![CDATA[${post.category}]]></category>` : ''}
    </item>
  `).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Honkoma Blog</title>
    <description>App Clipを活用したQRコード決済ソリューション「Quick Clip」に関する最新情報をお届けします。</description>
    <link>${siteUrl}/blog</link>
    <atom:link href="${siteUrl}/blog/rss.xml" rel="self" type="application/rss+xml"/>
    <language>ja</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${rssItems}
  </channel>
</rss>`;
};