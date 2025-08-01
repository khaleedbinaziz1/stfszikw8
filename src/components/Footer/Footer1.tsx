"use client";
import React from 'react';
import Link from 'next/link';

export default function Footer1() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-2xl font-bold text-primary mb-4 block">
              Logo
            </Link>
            <p className="text-gray-300 mb-4">
              Your trusted source for quality products and exceptional service.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-300 hover:text-white">About Company</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-white">Contact Us</Link></li>
              <li><Link href="/careers" className="text-gray-300 hover:text-white">Careers</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Help</h3>
            <ul className="space-y-2">
              <li><Link href="/help" className="text-gray-300 hover:text-white">Help Center</Link></li>
              <li><Link href="/returns" className="text-gray-300 hover:text-white">Return Policy</Link></li>
              <li><Link href="/privacy" className="text-gray-300 hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-300 hover:text-white">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <span className="text-primary mr-2">📞</span>
              <span>phone</span>
            </div>
            <div className="flex items-center">
              <span className="text-primary mr-2">📍</span>
              <span>location</span>
            </div>
            <div className="flex items-center">
              <span className="text-primary mr-2">⏰</span>
              <span>opening Hours</span>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-lg font-semibold mb-2">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white">Facebook</a>
                <a href="#" className="text-gray-300 hover:text-white">Twitter</a>
                <a href="#" className="text-gray-300 hover:text-white">Instagram</a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © 2025 Alfredo. All rights reserved.
          </p>
          <p className="text-gray-400 mt-2">
            Powered by{' '}
            <span className="text-primary font-semibold">PIXENTIX</span>
          </p>
        </div>
      </div>
    </footer>
  );
}