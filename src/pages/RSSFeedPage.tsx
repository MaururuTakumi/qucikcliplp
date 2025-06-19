import React, { useEffect } from 'react';
import { generateRSSFeed } from '../lib/blog';

const RSSFeedPage: React.FC = () => {
  useEffect(() => {
    // Generate RSS feed XML
    const rssXml = generateRSSFeed();
    
    // Set the content type and return XML
    const response = new Response(rssXml, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
      },
    });

    // Create a blob and download it
    const blob = new Blob([rssXml], { type: 'application/rss+xml' });
    const url = URL.createObjectURL(blob);
    
    // Replace current page content with XML
    document.open();
    document.write(rssXml);
    document.close();
    
    // Clean up
    return () => {
      URL.revokeObjectURL(url);
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">RSS Feed</h1>
        <p className="text-gray-600">
          RSS フィードを生成しています...
        </p>
      </div>
    </div>
  );
};

export default RSSFeedPage;