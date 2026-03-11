import React, { useState, useMemo, useRef, useEffect } from 'react';
import { FuelMap } from './components/FuelMap';
import { LiveUpdate } from './components/LiveUpdate';
import { TelerKhobor } from './components/TelerKhobor';
import { pumpsData, Division, Pump } from './data/pumps';
import { MapPin, Fuel, AlertCircle, Search, Filter, Info, ChevronRight, Menu, X, ExternalLink, Image as ImageIcon } from 'lucide-react';

const divisions: Division[] = ['ঢাকা', 'চট্টগ্রাম', 'রাজশাহী', 'খুলনা', 'বরিশাল', 'সিলেট', 'রংপুর', 'ময়মনসিংহ'];

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'about' | 'live' | 'teler-khobor'>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState<Division | 'সব'>('সব');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPump, setSelectedPump] = useState<Pump | null>(null);

  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      if (path === '/teler-khobor') setCurrentPage('teler-khobor');
      else if (path === '/about') setCurrentPage('about');
      else if (path === '/live') setCurrentPage('live');
      else setCurrentPage('home');
    };

    handleLocationChange(); // Initial check on load
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const handleNavigation = (page: 'home' | 'about' | 'live' | 'teler-khobor', path: string) => {
    setCurrentPage(page);
    window.history.pushState({}, '', path);
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const mapSectionRef = useRef<HTMLElement>(null);

  const filteredPumps = useMemo(() => {
    return pumpsData.filter((pump) => {
      const matchDivision = selectedDivision === 'সব' || pump.division === selectedDivision;
      const matchSearch = pump.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pump.district.toLowerCase().includes(searchQuery.toLowerCase());
      return matchDivision && matchSearch;
    });
  }, [selectedDivision, searchQuery]);

  const handlePumpClick = (pump: Pump) => {
    setSelectedPump(pump);
    if (mapSectionRef.current) {
      mapSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToMap = () => {
    if (mapSectionRef.current) {
      mapSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const renderHomePage = () => (
    <main className="space-y-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 border-b border-blue-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex-1 space-y-6 text-center md:text-left">
              <div className="inline-block px-4 py-1.5 rounded-full bg-red-100 text-red-700 font-semibold text-sm mb-2">
                তেল না পাইলে জীবন শেষ
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
                ভাই তেল নিয়ে <span className="text-blue-600">তারাতারি বিদায় হন</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto md:mx-0">
                আমেরিকা যদি বাংলাদেশে তেলের খবর পায় তাহলে গণতন্ত্র প্রতিষ্ঠা করে দিবে।
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-4">
                <button
                  onClick={scrollToMap}
                  className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold shadow-lg shadow-blue-600/30 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  <MapPin size={20} />
                  ম্যাপ দেখুন
                </button>
                <button
                  onClick={scrollToMap}
                  className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 rounded-full font-semibold shadow-sm transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  <Search size={20} />
                  কাছাকাছি পাম্প খুঁজুন
                </button>
              </div>
            </div>
            <div className="flex-1 flex justify-center md:justify-end w-full max-w-md md:max-w-none">
              <div className="relative w-64 h-64 md:w-96 md:h-96 bg-blue-100 rounded-full flex items-center justify-center shadow-2xl shadow-blue-200/50">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-200 to-indigo-100 rounded-full animate-pulse opacity-50"></div>
                <Fuel size={120} className="text-blue-600 relative z-10 drop-shadow-xl" />
                {/* Decorative elements */}
                <div className="absolute top-10 right-10 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-bounce" style={{ animationDuration: '3s' }}>
                  <span className="text-yellow-900 font-bold text-xs">তেল!</span>
                </div>
                <div className="absolute bottom-12 left-8 w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-lg animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
                  <span className="text-white font-bold text-xs">লাইন!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-12">
        {/* Mobile Search */}
        <div className="md:hidden relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="পাম্প বা জেলা খুঁজুন..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Division Filter */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-gray-700 font-medium">
            <Filter size={18} />
            <h2>বিভাগ অনুযায়ী খুঁজুন</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedDivision('সব')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedDivision === 'সব'
                ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-600 ring-offset-2'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                }`}
            >
              সব
            </button>
            {divisions.map((div) => (
              <button
                key={div}
                onClick={() => setSelectedDivision(div)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedDivision === div
                  ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-600 ring-offset-2'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                  }`}
              >
                {div}
              </button>
            ))}
          </div>
        </div>

        {/* Map Section */}
        <section ref={mapSectionRef} className="relative z-0 scroll-mt-24">
          <FuelMap pumps={filteredPumps} selectedPump={selectedPump} />

          {/* Map Legend */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-md border border-gray-100 z-[400] text-xs space-y-2 pointer-events-none">
            <div className="font-semibold text-gray-700 mb-1">তেলের অবস্থা</div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500 border border-white shadow-sm"></div>
              <span>পাওয়া যাচ্ছে</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500 border border-white shadow-sm"></div>
              <span>সীমিত</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 border border-white shadow-sm"></div>
              <span>নেই</span>
            </div>
          </div>
        </section>

        {/* Station List */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">পাম্পের তালিকা</h2>
            <span className="text-sm text-gray-500 bg-gray-200 px-3 py-1 rounded-full">{filteredPumps.length} টি পাম্প</span>
          </div>

          {filteredPumps.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-200 border-dashed">
              <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <h3 className="text-lg font-medium text-gray-900">কোনো পাম্প পাওয়া যায়নি</h3>
              <p className="text-gray-500">অন্য বিভাগ বা নাম দিয়ে চেষ্টা করুন।</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPumps.slice(0, 30).map((pump) => (
                <div
                  key={pump.id}
                  onClick={() => handlePumpClick(pump)}
                  className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1" title={pump.name}>
                      {pump.name}
                    </h3>
                    <span className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-medium ${pump.fuelStatus === 'তেল পাওয়া যাচ্ছে' ? 'bg-green-100 text-green-700' :
                      pump.fuelStatus === 'সীমিত তেল' ? 'bg-orange-100 text-orange-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                      {pump.fuelStatus}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-gray-400" />
                      <span>{pump.district}, {pump.division}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Fuel size={16} className="text-gray-400" />
                      <span>{pump.fuelType}</span>
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-50">
                      <span className="text-gray-500">লাইন:</span>
                      <span className={`font-medium ${pump.queueStatus === 'খুব লম্বা লাইন' ? 'text-red-600' :
                        pump.queueStatus === 'মাঝারি লাইন' ? 'text-orange-600' :
                          'text-green-600'
                        }`}>
                        {pump.queueStatus}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {filteredPumps.length > 30 && (
            <div className="text-center pt-4">
              <p className="text-sm text-gray-500">আরও {filteredPumps.length - 30} টি পাম্প দেখতে ম্যাপ ব্যবহার করুন অথবা ফিল্টার করুন।</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );

  const renderAboutPage = () => (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12 text-center space-y-6">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Info className="text-blue-600" size={40} />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">আমাদের সম্পর্কে</h1>
        <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full"></div>
        <p className="text-lg text-gray-600 leading-relaxed pt-4">
          তেল লাগবে একটি মজার এবং পরীক্ষামূলক ওয়েব প্রজেক্ট। এটি বাস্তব জ্বালানি তথ্য প্রদানের জন্য তৈরি করা হয়নি। এখানে প্রদর্শিত পাম্প, জ্বালানি অবস্থা বা লাইনের তথ্য বাস্তব নাও হতে পারে। এটি শুধুমাত্র ডিজাইন, প্রযুক্তি এবং সৃজনশীল ধারণা প্রদর্শনের উদ্দেশ্যে তৈরি।
        </p>
        <div className="pt-8">
          <button
            onClick={() => handleNavigation('home', '/')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-full font-medium transition-colors"
          >
            হোমপেজে ফিরে যান
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </main>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => handleNavigation('home', '/')}
          >
            <Fuel className="text-blue-600" size={32} />
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">তেল লাগবে</h1>
          </div>

          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6">
              <button
                onClick={() => handleNavigation('home', '/')}
                className={`text-sm font-medium transition-colors ${currentPage === 'home' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
              >
                হোম
              </button>
              <button
                onClick={() => handleNavigation('teler-khobor', '/teler-khobor')}
                className={`text-sm font-bold flex items-center gap-1 transition-colors px-3 py-1.5 rounded-full ${currentPage === 'teler-khobor' ? 'bg-orange-100 text-orange-600 shadow-sm' : 'text-orange-500 bg-orange-50 hover:bg-orange-100'}`}
              >
                <ImageIcon size={14} />
                তেলের খবর
              </button>
              <a
                href="https://www.facebook.com/Sayem1271/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1"
              >
                তেলের আপডেট <ExternalLink size={14} />
              </a>
            </nav>

            {currentPage === 'home' && (
              <div className="hidden md:flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="পাম্প বা জেলা খুঁজুন..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <div className="px-4 py-4 flex flex-col gap-4">
              <button
                onClick={() => handleNavigation('home', '/')}
                className={`text-left text-base font-medium transition-colors ${currentPage === 'home' ? 'text-blue-600' : 'text-gray-600'}`}
              >
                হোম
              </button>
              <button
                onClick={() => handleNavigation('teler-khobor', '/teler-khobor')}
                className={`text-left text-base font-bold flex items-center gap-2 transition-colors ${currentPage === 'teler-khobor' ? 'text-orange-600' : 'text-orange-500'}`}
              >
                <ImageIcon size={16} />
                তেলের খবর
              </button>
              <a
                href="https://www.facebook.com/Sayem1271/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-left text-base font-medium text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2"
              >
                তেলের আপডেট <ExternalLink size={16} />
              </a>

              {currentPage === 'home' && (
                <div className="relative mt-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="পাম্প বা জেলা খুঁজুন..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      <div className="flex-1">
        {currentPage === 'home' ? renderHomePage() :
          currentPage === 'about' ? renderAboutPage() :
            currentPage === 'teler-khobor' ? <TelerKhobor /> :
              <LiveUpdate />}
      </div>

      {/* Footer Disclaimer */}
      <footer className="bg-gray-900 text-gray-400 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-gray-300">
            <Fuel size={20} />
            <span className="font-bold text-lg">তেল লাগবে</span>
          </div>
          <p className="text-sm max-w-2xl mx-auto leading-relaxed">
            "তেল লাগবে" একটি পরীক্ষামূলক এবং মজার প্রযুক্তি প্রজেক্ট। এখানে প্রদর্শিত তথ্য বাস্তব নাও হতে পারে। এটি শুধুমাত্র ডেমো উদ্দেশ্যে তৈরি।
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <button onClick={() => handleNavigation('home', '/')} className="text-xs hover:text-white transition-colors">হোম</button>
            <span className="text-gray-600">•</span>
            <button onClick={() => handleNavigation('teler-khobor', '/teler-khobor')} className="text-xs text-orange-400 hover:text-orange-300 transition-colors font-semibold">তেলের খবর</button>
          </div>
          <p className="text-xs text-gray-500 pt-2">
            &copy; {new Date().getFullYear()} তেল লাগবে ডেমো। সর্বস্বত্ব সংরক্ষিত।
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
