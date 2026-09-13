import { useState, useMemo } from 'react';
import AppCard from './components/AppCard';
import { getApps } from './utils/fetchApps';
import {
  Layers,
  Search,
  Lock,
  Plus,
  X,
  Download,
  Copy,
  Check,
  FolderOpen,
} from 'lucide-react';

export default function App() {
  const allApps = useMemo(() => getApps(), []);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'live' | 'offline'>('all');

  // Modal State for Adding Application
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [newApp, setNewApp] = useState({
    title: '',
    description: '',
    tech_stack: '',
    image: '',
    live_link: '',
    github_link: '',
  });

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

  // Helper to handle JSON file download
  const handleDownloadJSON = () => {
    if (!newApp.title) {
      alert('Mohon masukkan judul aplikasi terlebih dahulu.');
      return;
    }

    const filename = `${newApp.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'aplikasi-baru'}.json`;

    const jsonString = JSON.stringify(newApp, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyJSON = () => {
    const jsonString = JSON.stringify(newApp, null, 2);
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50/70 text-zinc-900">
      {/* Top Minimalist Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 border-b border-zinc-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-base tracking-tight text-zinc-900">
                Aplikasi & Portofolio
              </h1>
              <p className="text-xs text-zinc-500 hidden sm:block">
                Katalog aplikasi web, tools, dan proyek produksi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Add Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 text-white hover:bg-zinc-800 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Aplikasi</span>
            </button>

            {/* CMS Admin Link */}
            <a
              href="/admin/index.html"
              title="Buka Sveltia CMS Admin"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-800 transition-colors border border-zinc-200"
            >
              <Lock className="w-3.5 h-3.5 text-zinc-500" />
              <span>Admin CMS</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Apps Showcase Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between pb-8 border-b border-zinc-200/80">
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
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
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
                title={app.title}
                description={app.description}
                techStack={app.tech_stack}
                image={app.image}
                liveLink={app.live_link}
                githubLink={app.github_link}
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

      {/* Minimal Footer */}
      <footer className="border-t border-zinc-200/80 bg-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} Katalog Aplikasi</p>

          <p className="text-center">
            Daftar aplikasi dapat diperbarui via{' '}
            <a href="/admin/index.html" className="font-semibold text-zinc-800 underline hover:text-black">
              Sveltia CMS
            </a>
          </p>
        </div>
      </footer>

      {/* Modal Form Tambah Aplikasi */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-zinc-200 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-zinc-900">Tambah Aplikasi Baru</h2>
                  <p className="text-xs text-zinc-500">Isi data aplikasi portofolio Anda</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleDownloadJSON();
              }}
              className="mt-4 space-y-4 text-xs"
            >
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Judul Aplikasi *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Smart POS System"
                  value={newApp.title}
                  onChange={(e) => setNewApp({ ...newApp, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-zinc-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Deskripsi Singkat *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Jelaskan fungsi aplikasi dan masalah apa yang diselesaikan..."
                  value={newApp.description}
                  onChange={(e) => setNewApp({ ...newApp, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-zinc-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Tech Stack (Pisahkan Koma) *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: React, TypeScript, Tailwind CSS, SQLite"
                  value={newApp.tech_stack}
                  onChange={(e) => setNewApp({ ...newApp, tech_stack: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-zinc-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">URL Screenshot / Gambar *</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/... atau /uploads/gambar.png"
                  value={newApp.image}
                  onChange={(e) => setNewApp({ ...newApp, image: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-zinc-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">
                    Link Live Demo <span className="font-normal text-zinc-400">(Opsional)</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://aplikasianda.com"
                    value={newApp.live_link}
                    onChange={(e) => setNewApp({ ...newApp, live_link: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-zinc-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">
                    Link GitHub <span className="font-normal text-zinc-400">(Opsional)</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={newApp.github_link}
                    onChange={(e) => setNewApp({ ...newApp, github_link: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-zinc-900"
                  />
                </div>
              </div>

              <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl space-y-1 text-zinc-600">
                <div className="flex items-center gap-1.5 font-semibold text-zinc-800">
                  <FolderOpen className="w-4 h-4 text-zinc-500" />
                  <span>Petunjuk Penyimpanan:</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Unduh file <code>.json</code> ini dan letakkan di folder:
                  <br />
                  <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-zinc-200 inline-block mt-1">
                    src/content/apps/
                  </span>
                  <br />
                  Aplikasi akan langsung muncul otomatis di portofolio Anda!
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-zinc-900 text-white hover:bg-zinc-800 transition-colors shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Download File JSON</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyJSON}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-zinc-200 hover:bg-zinc-100 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Tersalin!' : 'Salin JSON'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
