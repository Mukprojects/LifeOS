import React from 'react';
import { BookRecommendation } from '../../types';

interface BookCardProps {
  book: BookRecommendation;
}

export const BookCard: React.FC<BookCardProps> = ({ book }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl border border-gray-100 hover:border-blue-200 transform hover:scale-[1.01] duration-300">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{book.title}</h3>
            <p className="text-gray-600 mb-4 text-lg italic">by {book.author}</p>
          </div>
          
          {book.rating && (
            <div className="flex items-center">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i} 
                    className={`w-5 h-5 ${i < Math.floor(book.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2 text-sm font-medium text-gray-600">{book.rating}</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="mb-6">
          <p className="text-gray-700 leading-relaxed">{book.description}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2">Category</h4>
            <div>
              <span className="inline-block bg-gradient-to-r from-blue-500 to-blue-700 text-white text-sm px-3 py-1 rounded-full">
                {book.category}
              </span>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {book.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="inline-block bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2">Relevant for your goals</h4>
          <div className="flex flex-wrap gap-2">
            {book.relevantGoals.map((goal, index) => (
              <span 
                key={index} 
                className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs px-3 py-1 rounded-full"
              >
                {goal}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end">
          {book.amazonUrl ? (
            <a 
              href={book.amazonUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View on Amazon
            </a>
          ) : (
            <a 
              href={`https://www.amazon.com/s?k=${encodeURIComponent(book.title + ' ' + book.author)}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Search on Amazon
            </a>
          )}
        </div>
      </div>
    </div>
  );
}; 