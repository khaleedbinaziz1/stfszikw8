"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface TopCategories3Props {
  onCategoryClick?: (categoryName: string) => void;
}

export default function TopCategories3({ onCategoryClick }: TopCategories3Props) {
  const handleCategoryClick = (categoryName: string) => {
    if (onCategoryClick) {
      onCategoryClick(categoryName);
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Top Categories
          </h2>
          <p className="text-lg text-gray-600">
            Explore our most popular product categories
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {['PANJABI', 'T-SHIRT', 'PANT-TROUSERS', 'ATTAR'].map((category, index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleCategoryClick(category)}
            >
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🛍️</span>
                </div>
                <h3 className="font-semibold text-gray-900">{category}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}