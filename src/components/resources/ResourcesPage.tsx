import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useSupabaseData } from '../../hooks/useSupabaseData';
import { BookCard } from './BookCard';
import { BookRecommendation } from '../../types';

export const ResourcesPage: React.FC = () => {
  const { user } = useAuth();
  const { 
    resourcesData, 
    isLoadingResources, 
    resourcesError, 
    refreshBookRecommendations 
  } = useSupabaseData(user?.id || null);
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Please sign in to view your personalized resources</h1>
      </div>
    );
  }
  
  if (isLoadingResources) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Loading your personalized book recommendations...</p>
      </div>
    );
  }
  
  if (resourcesError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">Failed to load book recommendations.</span>
        </div>
        <button 
          onClick={() => refreshBookRecommendations()}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md"
        >
          Try Again
        </button>
      </div>
    );
  }
  
  if (!resourcesData || !resourcesData.books || resourcesData.books.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <div className="mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4 text-center text-gray-900">No Book Recommendations Yet</h1>
          <p className="text-gray-600 mb-8 text-center text-lg max-w-2xl">
            We'll analyze your goals and lifestyle to provide personalized book recommendations tailored to help you achieve your objectives.
          </p>
          <button 
            onClick={() => refreshBookRecommendations()}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            Generate Recommendations
          </button>
        </div>
      </div>
    );
  }
  
  // Get unique categories
  const categories = Array.from(new Set(resourcesData.books.map(book => book.category)));
  
  // Filter books by category and search query
  let filteredBooks = resourcesData.books;
  
  if (selectedCategory) {
    filteredBooks = filteredBooks.filter(book => book.category === selectedCategory);
  }
  
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredBooks = filteredBooks.filter(book => 
      book.title.toLowerCase().includes(query) || 
      book.author.toLowerCase().includes(query) || 
      book.description.toLowerCase().includes(query) ||
      book.tags.some(tag => tag.toLowerCase().includes(query)) ||
      book.relevantGoals.some(goal => goal.toLowerCase().includes(query))
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-gray-900">Your Personalized Resources</h1>
            <p className="text-gray-600 mb-4">
              Book recommendations tailored to your goals and lifestyle
            </p>
          </div>
          <button 
            onClick={() => refreshBookRecommendations()}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Recommendations
          </button>
        </div>
        
        {resourcesData.personalizedNote && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-500 p-6 mb-8 rounded-r-lg">
            <p className="text-blue-700 leading-relaxed">{resourcesData.personalizedNote}</p>
          </div>
        )}
        
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-2/3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search books by title, author, or description..."
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full md:w-1/3">
              <select
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-8">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book: BookRecommendation) => (
            <BookCard key={book.id} book={book} />
          ))
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg border border-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-600 text-lg">No books match your filters. Try adjusting your search.</p>
          </div>
        )}
      </div>
      
      {resourcesData.lastUpdated && (
        <div className="mt-8 text-right text-sm text-gray-500">
          Last updated: {new Date(resourcesData.lastUpdated).toLocaleString()}
        </div>
      )}
    </div>
  );
}; 