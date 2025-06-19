import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search, Clock, Tag, User } from 'lucide-react';
import { getAllBlogPostMeta, getAllCategories, getAllTags, formatDate } from '../lib/blog';

const BlogPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTag, setSelectedTag] = useState('all');

  const allPosts = getAllBlogPostMeta();
  const categories = getAllCategories();
  const tags = getAllTags();

  const filteredPosts = useMemo(() => {
    return allPosts.filter(post => {
      const matchesSearch = !searchQuery || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
      const matchesTag = selectedTag === 'all' || post.tags.includes(selectedTag);
      
      return matchesSearch && matchesCategory && matchesTag;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [allPosts, searchQuery, selectedCategory, selectedTag]);

  return (
    <>
      <Helmet>
        <title>ブログ | 株式会社Honkoma</title>
        <meta 
          name="description" 
          content="App Clipを活用したQRコード決済ソリューション「Quick Clip」に関する最新情報、技術解説、市場分析などをお届けします。" 
        />
        <meta property="og:title" content="ブログ | 株式会社Honkoma" />
        <meta property="og:description" content="Quick Clipに関する最新情報をお届けします。" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">ブログ</h1>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Quick Clipの最新情報から決済業界のトレンドまで、<br />
                価値ある情報をお届けします
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Search and Filters */}
          <div className="mb-12">
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* Search Bar */}
              <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="記事を検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Category and Tag Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    カテゴリー
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">すべて</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    タグ
                  </label>
                  <select
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                    className="block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">すべて</option>
                    {tags.map(tag => (
                      <option key={tag} value={tag}>{tag}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-8">
            <p className="text-gray-600">
              {filteredPosts.length}件の記事が見つかりました
            </p>
          </div>

          {/* Blog Posts Grid */}
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map(post => (
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
                      {post.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                      {post.tags.length > 2 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          +{post.tags.length - 2}
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
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">記事が見つかりませんでした</h3>
                <p className="text-gray-500">
                  検索条件を変更して再度お試しください。
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BlogPage;