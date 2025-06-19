import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Clock, User, Tag, ArrowLeft } from 'lucide-react';
import { getBlogPostsByTag, getAllTags, formatDate, BlogPost } from '../lib/blog';

const BlogTagPage: React.FC = () => {
  const { tag } = useParams<{ tag: string }>();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isValidTag, setIsValidTag] = useState(true);

  const allTags = getAllTags();

  useEffect(() => {
    if (!tag) {
      setLoading(false);
      setIsValidTag(false);
      return;
    }

    const decodedTag = decodeURIComponent(tag);
    const tagExists = allTags.some(t => t.toLowerCase() === decodedTag.toLowerCase());
    
    if (!tagExists) {
      setIsValidTag(false);
      setLoading(false);
      return;
    }

    const tagPosts = getBlogPostsByTag(decodedTag);
    setPosts(tagPosts);
    setLoading(false);
  }, [tag, allTags]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isValidTag) {
    return <Navigate to="/blog" replace />;
  }

  const decodedTag = tag ? decodeURIComponent(tag) : '';

  return (
    <>
      <Helmet>
        <title>{decodedTag}の記事一覧 | Honkoma Blog</title>
        <meta 
          name="description" 
          content={`${decodedTag}に関する記事一覧です。Quick Clipや決済業界に関する最新情報をお届けします。`} 
        />
        <meta property="og:title" content={`${decodedTag}の記事一覧 | Honkoma Blog`} />
        <meta property="og:description" content={`${decodedTag}に関する記事一覧です。`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
                    <span className="ml-4 text-gray-700">{decodedTag}</span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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

          {/* Page Header */}
          <div className="mb-12">
            <div className="flex items-center mb-4">
              <Tag className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">
                {decodedTag}
              </h1>
            </div>
            <p className="text-gray-600">
              {posts.length}件の記事が見つかりました
            </p>
          </div>

          {/* Blog Posts */}
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map(post => (
                <article key={post.slug} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  {post.image && (
                    <div className="aspect-w-16 aspect-h-9">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <Clock className="h-4 w-4 mr-1" />
                      <time dateTime={post.date}>{formatDate(post.date)}</time>
                      {post.author && (
                        <>
                          <span className="mx-2">•</span>
                          <User className="h-4 w-4 mr-1" />
                          <span>{post.author}</span>
                        </>
                      )}
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      <Link 
                        to={`/blog/${post.slug}`}
                        className="hover:text-blue-600 transition-colors duration-200"
                      >
                        {post.title}
                      </Link>
                    </h2>

                    {post.description && (
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.category && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {post.category}
                        </span>
                      )}
                      {post.tags.slice(0, 3).map(postTag => (
                        <Link
                          key={postTag}
                          to={`/blog/tags/${encodeURIComponent(postTag)}`}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                            postTag === decodedTag
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {postTag}
                        </Link>
                      ))}
                      {post.tags.length > 3 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          +{post.tags.length - 3}
                        </span>
                      )}
                    </div>

                    <Link
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                    >
                      続きを読む
                      <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  このタグの記事が見つかりませんでした
                </h3>
                <p className="text-gray-500 mb-6">
                  他のタグや記事一覧をご覧ください。
                </p>
                <Link
                  to="/blog"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  ブログ一覧に戻る
                </Link>
              </div>
            </div>
          )}

          {/* All Tags */}
          <div className="mt-16 pt-8 border-t">
            <h2 className="text-xl font-bold text-gray-900 mb-6">すべてのタグ</h2>
            <div className="flex flex-wrap gap-3">
              {allTags.map(tagItem => (
                <Link
                  key={tagItem}
                  to={`/blog/tags/${encodeURIComponent(tagItem)}`}
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    tagItem === decodedTag
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  <Tag className="h-4 w-4 mr-1" />
                  {tagItem}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogTagPage;