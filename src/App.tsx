import { useState, useMemo, useRef } from 'react';
import AppCard from './components/AppCard';
import { PhotoGalleryModal } from './components/PhotoGalleryModal';
import { getApps, type AppItem } from './utils/fetchApps';
import {
  Layers,
  Search,
} from 'lucide-react';

export default function App() {
  const allApps = useMemo(() => getApps(), []);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'live' | 'offline'>('all');
  const [selectedAppForGallery, setSelectedAppForGallery] = useState<AppItem | null>(null);

  // Secret admin shortcut: triple click on brand logo
  const clickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clickCountRef = useRef(0);

  const handleBrandTripleClick = () => {
    clickCountRef.current += 1;
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }

    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0;
      window.location.href = '/admin/index.html';
      return;
    }

    clickTimeoutRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 1000);
  };

  const filteredApps = useMemo(() => {
    return allApps.filter((app) => {
      const matchSearch =
        app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.tech_stack.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchSearch) return false;

      const hasLiveLink = Boolean(app.live_link && app.live_link.trim().length > 0);
      if (filterType === 'live') return hasLiveLink;
      if (filterType === 'offline') return !hasLiveLink;
      return true;
    });
  }, [allApps, searchQuery, filterType]);

  const liveCount = allApps.filter((a) => a.live_link && a.live_link.trim().length > 0).length;

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50/70 text-zinc-900">
      {/* Top Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 border-b border-zinc-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div
            onClick={handleBrandTripleClick}
            className="flex items-center gap-3 cursor-pointer select-none group"
            title="Dims Dev"
          >
            <div className="w-9 h-9 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-bold text-sm shadow-xs transition-transform duration-200 group-hover:scale-105 active:scale-95">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-base tracking-tight text-zinc-900 group-hover:text-emerald-700 transition-colors">
                Dims Dev
              </h1>
              <p className="text-xs text-zinc-500 hidden sm:block">
                Katalog portofolio aplikasi dan proyek software saya
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Apps Showcase Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Sticky Floating Search & Filter Toolbar */}
        <div className="sticky top-16 z-30 bg-zinc-50/95 backdrop-blur-md py-3.5 border-b border-zinc-200/80 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 mb-4 transition-all">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Cari berdasarkan nama, deskripsi, atau tech stack..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white border border-zinc-200 focus:outline-hidden focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all shadow-2xs"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  filterType === 'all'
                    ? 'bg-zinc-900 text-white shadow-xs'
                    : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                Semua ({allApps.length})
              </button>
              <button
                onClick={() => setFilterType('live')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  filterType === 'live'
                    ? 'bg-zinc-900 text-white shadow-xs'
                    : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                Live Demo ({liveCount})
              </button>
              <button
                onClick={() => setFilterType('offline')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  filterType === 'offline'
                    ? 'bg-zinc-900 text-white shadow-xs'
                    : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                Lokal / Screenshot ({allApps.length - liveCount})
              </button>
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="py-4 flex items-center justify-between text-xs text-zinc-500">
          <span>
            Menampilkan <strong className="text-zinc-900 font-semibold">{filteredApps.length}</strong> aplikasi
          </span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-zinc-700 underline hover:text-black font-medium"
            >
              Reset pencarian
            </button>
          )}
        </div>

        {/* Apps Grid */}
        {filteredApps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-2">
            {filteredApps.map((app, index) => (
              <AppCard
                key={`${app.title}-${index}`}
                app={app}
                onOpenGallery={(clickedApp) => setSelectedAppForGallery(clickedApp)}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-white border border-dashed border-zinc-300 rounded-2xl p-8 my-6">
            <div className="w-12 h-12 rounded-full bg-zinc-100 text-zinc-400 mx-auto flex items-center justify-center mb-3">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-zinc-900">
              Tidak ada aplikasi yang cocok
            </h3>
            <p className="text-sm text-zinc-500 mt-1 max-w-sm mx-auto">
              Tidak ditemukan aplikasi dengan kata kunci "{searchQuery}". Coba kata kunci lain atau reset filter.
            </p>
          </div>
        )}
      </main>

      {/* Photo Gallery & Detail Lightbox Modal */}
      <PhotoGalleryModal
        app={selectedAppForGallery}
        onClose={() => setSelectedAppForGallery(null)}
      />

      {/* Minimal Clean Footer */}
      <footer className="border-t border-zinc-200/80 bg-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-end text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} Dims Dev</p>
        </div>
      </footer>
    </div>
  );
}
