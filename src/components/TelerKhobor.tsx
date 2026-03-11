import React from 'react';
import { PlaySquare, Image as ImageIcon } from 'lucide-react';
import { imagesData, videosData } from '../data/mediaData';
import { MemeCard } from './MemeCard';
import { VideoPlayer } from './VideoPlayer';

export const TelerKhobor: React.FC = () => {

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Page Header */}
      <header className="bg-gradient-to-b from-blue-900 to-blue-800 text-white py-16 px-4 mb-12 shadow-inner">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white drop-shadow-md">
            তেলের খবর
          </h1>
          <p className="text-xl md:text-2xl text-blue-200 font-medium max-w-2xl mx-auto">
            বাংলাদেশের তেলের লাইনের ভাইরাল মুহূর্ত
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

        {/* Meme Image Gallery */}
        <section>
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-200">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ImageIcon size={24} className="text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">ভাইরাল গ্যালারি</h2>
            <span className="ml-auto bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full">
              {/* {imagesData.length} */}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {imagesData.map(img => (
              <MemeCard key={img.id} item={img} />
            ))}
          </div>
        </section>

        {/* Video Feed Section */}
        <section>
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-200">
            <div className="p-2 bg-purple-100 rounded-lg">
              <PlaySquare size={24} className="text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">ভিডিও গ্যালারি</h2>
            <span className="ml-auto bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full">
              {/* {videosData.length} টি ভিডিও */}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {videosData.map(vid => (
              <VideoPlayer key={vid.id} item={vid} />
            ))}
          </div>
        </section>

      </div>
    </main>
  );
};
