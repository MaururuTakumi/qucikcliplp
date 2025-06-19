import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Clock, User, Tag, ArrowLeft, Share2, Twitter, Facebook } from 'lucide-react';
import { getBlogPostBySlug, getRelatedPosts, formatDate, markdownToHtml, BlogPost } from '../lib/blog';
import 'highlight.js/styles/github-dark.css';

const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    const blogPost = getBlogPostBySlug(slug);
    if (blogPost) {
      setPost(blogPost);
      setRelatedPosts(getRelatedPosts(blogPost));
    }
    setLoading(false);
  }, [slug]);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = post ? `${post.title} | Honkoma Blog` : '';

  const handleShare = (platform: 'twitter' | 'facebook') => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);
    
    let shareLink = '';
    if (platform === 'twitter') {
      shareLink = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
    } else if (platform === 'facebook') {
      shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    }
    
    window.open(shareLink, '_blank', 'width=600,height=400');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <>
      <Helmet>
        <title>{post.title} | Honkoma Blog</title>
        <meta name="description" content={post.description || `${post.title}について詳しく解説します。`} />
        <meta property="og:title" content={`${post.title} | Honkoma Blog`} />
        <meta property="og:description" content={post.description || `${post.title}について詳しく解説します。`} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={shareUrl} />
        {post.image && <meta property="og:image" content={post.image} />}
        <meta property="article:published_time" content={post.date} />
        {post.author && <meta property="article:author" content={post.author} />}
        {post.tags.map(tag => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${post.title} | Honkoma Blog`} />
        <meta name="twitter:description" content={post.description || `${post.title}について詳しく解説します。`} />
        {post.image && <meta name="twitter:image" content={post.image} />}
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-4">
                <li>
                  <Link to="/" className="text-gray-500 hover:text-gray-700">
                    ホーム
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <Link to="/blog" className="ml-4 text-gray-500 hover:text-gray-700">
                      ブログ
                    </Link>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-4 text-gray-700 truncate">{post.title}</span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back Button */}
          <div className="mb-8">
            <Link
              to="/blog"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              ブログ一覧に戻る
            </Link>
          </div>

          {/* Article Header */}
          <header className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.category && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {post.category}
                </span>
              )}
              {post.tags.map(tag => (
                <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b">
              <div className="flex items-center text-gray-600">
                <Clock className="h-5 w-5 mr-2" />
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                {post.author && (
                  <>
                    <span className="mx-3">•</span>
                    <User className="h-5 w-5 mr-2" />
                    <span>{post.author}</span>
                  </>
                )}
              </div>

              {/* Share Buttons */}
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">共有:</span>
                <button
                  onClick={() => handleShare('twitter')}
                  className="p-2 text-gray-600 hover:text-blue-400 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Twitterで共有"
                >
                  <Twitter className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleShare('facebook')}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Facebookで共有"
                >
                  <Facebook className="h-5 w-5" />
                </button>
                <button
                  onClick={copyToClipboard}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="URLをコピー"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          {post.image && (
            <div className="mb-8">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Article Content */}
          <div 
            className="prose prose-lg max-w-none mb-12 prose-gray
              [&>h1]:border-b [&>h1]:border-gray-200 [&>h1]:pb-2
              [&>h2]:border-b [&>h2]:border-gray-200 [&>h2]:pb-2
              [&>h3]:text-blue-600
              [&>h4]:text-blue-600
              [&>blockquote]:border-l-4 [&>blockquote]:border-blue-500 [&>blockquote]:bg-blue-50 [&>blockquote]:italic
              [&>pre]:bg-gray-900 [&>pre]:text-gray-100
              [&>code]:bg-blue-50 [&>code]:text-blue-600 [&>code]:font-medium
              [&>table]:border [&>table]:border-gray-200
              [&>table>thead>tr>th]:bg-gray-50 [&>table>thead>tr>th]:font-semibold
              [&>table>tbody>tr>td]:border-t [&>table>tbody>tr>td]:border-gray-200
              [&>ul>li::marker]:text-blue-600
              [&>ol>li::marker]:text-blue-600 [&>ol>li::marker]:font-bold
              [&>p>strong]:text-gray-900 [&>p>strong]:font-semibold
              [&>p>em]:text-gray-600 [&>p>em]:italic
              [&>hr]:border-gray-300 [&>hr]:my-8"
            dangerouslySetInnerHTML={{ __html: markdownToHtml(post.content) }}
          />

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-8 mb-12">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Quick Clipについて詳しく知りたい方へ
              </h3>
              <p className="text-gray-700 mb-6">
                App Clipを活用した革新的なQRコード決済ソリューションの詳細を<br />
                こちらからご確認いただけます。
              </p>
              <div className="space-x-4">
                <Link
                  to="/product"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  商品詳細を見る
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-medium rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors"
                >
                  お問い合わせ
                </Link>
              </div>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="bg-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">関連記事</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedPosts.map(relatedPost => (
                  <article key={relatedPost.slug} className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300">
                    {relatedPost.image && (
                      <div className="aspect-w-16 aspect-h-9">
                        <img
                          src={relatedPost.image}
                          alt={relatedPost.title}
                          className="w-full h-40 object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    
                    <div className="p-6">
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <Clock className="h-4 w-4 mr-1" />
                        <time dateTime={relatedPost.date}>{formatDate(relatedPost.date)}</time>
                      </div>

                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                        <Link 
                          to={`/blog/${relatedPost.slug}`}
                          className="hover:text-blue-600 transition-colors duration-200"
                        >
                          {relatedPost.title}
                        </Link>
                      </h3>

                      {relatedPost.description && (
                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                          {relatedPost.description}
                        </p>
                      )}

                      <Link
                        to={`/blog/${relatedPost.slug}`}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        続きを読む
                        <svg className="ml-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default BlogDetailPage;