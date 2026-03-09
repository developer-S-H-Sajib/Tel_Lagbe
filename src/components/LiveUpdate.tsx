import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import { Share2, Download, MapPin, Fuel, Users } from 'lucide-react';

const quotes = [
  "যে ভাই তেল নিয়ে তারাতারি বিদায় হন",
  "আজ তেল পাওয়া মানে ভাগ্য ভালো",
  "লাইন দেখে মনে হচ্ছে ঈদের ট্রেন"
];

export function LiveUpdate() {
  const [quote, setQuote] = useState('');
  const cardRef = useRef<HTMLDivElement>(null);

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  };

  useEffect(() => {
    getRandomQuote();
  }, []);

  const handleShare = async () => {
    getRandomQuote();
    if (cardRef.current) {
      try {
        const canvas = await html2canvas(cardRef.current, {
          scale: 2,
          backgroundColor: '#ffffff',
          logging: false,
        });
        
        canvas.toBlob(async (blob) => {
          if (blob && navigator.share) {
            const file = new File([blob], 'fuel-update.png', { type: 'image/png' });
            try {
              await navigator.share({
                title: 'তেলের লাইভ আপডেট',
                text: 'তেল লাগবে - লাইভ আপডেট',
                files: [file],
              });
            } catch (error) {
              console.error('Error sharing:', error);
            }
          } else {
            // Fallback to download if Web Share API is not supported
            handleDownload();
          }
        });
      } catch (error) {
        console.error('Error generating image for share:', error);
      }
    }
  };

  const handleDownload = async () => {
    if (cardRef.current) {
      try {
        const canvas = await html2canvas(cardRef.current, {
          scale: 2,
          backgroundColor: '#ffffff',
          logging: false,
        });
        
        const link = document.createElement('a');
        link.download = `fuel-update-${Date.now()}.jpg`;
        link.href = canvas.toDataURL('image/jpeg', 0.9);
        link.click();
      } catch (error) {
        console.error('Error downloading image:', error);
      }
    }
  };

  return (
    <main className="min-h-[calc(100vh-140px)] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-gray-50">
      <div className="w-full max-w-md mx-auto space-y-8">
        
        {/* Main Heading */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            ভাই তেলের তথ্য কাউকে বলবেন না
          </h1>
          <p className="text-lg text-blue-600 font-medium">
            তেলের লাইভ আপডেট
          </p>
        </div>

        {/* Shareable Card */}
        <div 
          ref={cardRef}
          className="bg-white rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden p-6 sm:p-8 space-y-6"
        >
          {/* Website Name for Share */}
          <div className="flex items-center justify-center gap-2 text-blue-600 pb-4 border-b border-gray-100">
            <Fuel size={24} />
            <span className="font-bold text-xl">তেল লাগবে</span>
          </div>

          {/* Fuel Status */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-gray-700">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                <MapPin className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">লোকেশন</p>
                <p className="text-lg font-bold text-gray-900">ঢাকা শহর</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                <Fuel className="text-orange-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">তেল</p>
                <p className="text-lg font-bold text-orange-600">সীমিত</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                <Users className="text-red-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">লাইন</p>
                <p className="text-lg font-bold text-red-600">খুব লম্বা লাইন</p>
              </div>
            </div>
          </div>

          {/* Random Quote */}
          <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100">
            <p className="text-center text-blue-800 font-medium italic text-lg">
              "{quote}"
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold shadow-lg shadow-blue-600/30 transition-all hover:-translate-y-1"
          >
            <Share2 size={20} />
            শেয়ার করুন
          </button>
          
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 rounded-full font-semibold shadow-sm transition-all hover:-translate-y-1"
          >
            <Download size={20} />
            JPG ডাউনলোড
          </button>
        </div>

      </div>
    </main>
  );
}
