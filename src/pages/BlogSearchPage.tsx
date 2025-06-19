import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search, Clock, User, Tag, ArrowLeft } from 'lucide-react';
import { searchBlogPosts, formatDate, BlogPost } from '../lib/blog';

const BlogSearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);

  const query = searchParams.get('q') || '';

  useEffect(() => {
    setSearchQuery(query);
    if (query.trim()) {
      setLoading(true);
      const searchResults = searchBlogPosts(query);
      setResults(searchResults);
      setLoading(false);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
    }
  };

  const highlightSearchTerm = (text: string, searchTerm: string): string => {
    if (!searchTerm.trim()) return text;
    
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
  };

  return (
    <>
      <Helmet>
        <title>
          {query ? `「${query}」の検索結果` : '記事検索'} | Honkoma Blog
        </title>
        <meta 
          name="description" 
          content={query ? `「${query}」に関する記事の検索結果です。` : 'ブログ記事を検索できます。'} 
        />
        <meta property="og:title" content={`${query ? `「${query}」の検索結果` : '記事検索'} | Honkoma Blog`} />
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
                    <span className="ml-4 text-gray-700">検索</span>
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

          {/* Search Header */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Search className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">記事検索</h1>
            </div>
            {query && !loading && (
              <p className="text-gray-600">
                「<span className="font-medium">{query}</span>」の検索結果: {results.length}件
              </p>
            )}
          </div>

          {/* Search Form */}
          <div className="mb-12">
            <form onSubmit={handleSearch} className="max-w-2xl">
              <div className="flex">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-l-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="キーワードを入力..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  検索
                </button>
              </div>
            </form>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">検索中...</p>
            </div>
          )}

          {/* Search Results */}
          {!loading && query && (
            <>
              {results.length > 0 ? (
                <div className="space-y-8">
                  {results.map(post => (
                    <article key={post.slug} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
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

                      <h2 className="text-2xl font-bold text-gray-900 mb-3">
                        <Link 
                          to={`/blog/${post.slug}`}
                          className="hover:text-blue-600 transition-colors duration-200"
                          dangerouslySetInnerHTML={{ 
                            __html: highlightSearchTerm(post.title, query) 
                          }}
                        />
                      </h2>

                      {post.description && (
                        <p 
                          className="text-gray-600 mb-4 leading-relaxed"
                          dangerouslySetInnerHTML={{ 
                            __html: highlightSearchTerm(post.description, query) 
                          }}
                        />
                      )}

                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.category && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {post.category}
                          </span>
                        )}
                        {post.tags.slice(0, 3).map(tag => (
                          <Link
                            key={tag}
                            to={`/blog/tags/${encodeURIComponent(tag)}`}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
                            dangerouslySetInnerHTML={{ 
                              __html: `<svg class="h-3 w-3 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>${highlightSearchTerm(tag, query)}`
                            }}
                          />
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
                    </article>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="max-w-md mx-auto">
                    <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      検索結果が見つかりませんでした
                    </h3>
                    <p className="text-gray-500 mb-6">
                      「{query}」に関する記事は見つかりませんでした。<br />
                      別のキーワードで検索してみてください。
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
            </>
          )}

          {/* No Search Query */}
          {!loading && !query && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  記事を検索
                </h3>
                <p className="text-gray-500 mb-6">
                  上の検索ボックスにキーワードを入力して、<br />
                  お探しの記事を見つけてください。
                </p>
                <Link
                  to="/blog"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  ブログ一覧を見る
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BlogSearchPage;