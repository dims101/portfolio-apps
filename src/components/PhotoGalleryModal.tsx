import { useState, useEffect, useMemo, useCallback, type FC, type TouchEvent } from 'react';
import { ExternalLink, Check, Copy, ChevronLeft, ChevronRight, X, ImageOff, Lock } from 'lucide-react';
import type { AppItem, GalleryPhoto } from '../utils/fetchApps';

interface PhotoGalleryModalProps {
  app: AppItem | null;
  onClose: () => void;
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className || 'w-4 h-4'}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

export const PhotoGalleryModal: FC<PhotoGalleryModalProps> = ({ app, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copiedUser, setCopiedUser] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});
  const [isClosing, setIsClosing] = useState(false);
  const [isRendered, setIsRendered] = useState(false);

  // Normalisasi daftar foto dari app.gallery atau app.image
  const photos: GalleryPhoto[] = useMemo(() => {
    if (!app) return [];
    if (app.gallery && Array.isArray(app.gallery) && app.gallery.length > 0) {
      return app.gallery;
    }
    if (app.image) {
      return [{ image: app.image, title: app.title, description: 'Screenshot utama aplikasi' }];
    }
    return [];
  }, [app]);

  // Trigger zoom-in animation when opened
  useEffect(() => {
    if (app) {
      setIsClosing(false);
      setFailedImages({});
      setCurrentIndex(0);
      setCopiedUser(false);
      setCopiedPass(false);
      requestAnimationFrame(() => {
        setIsRendered(true);
      });
    } else {
      setIsRendered(false);
    }
  }, [app]);

  // Smooth Zoom-Out when closing
  const handleSafeClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
      setIsRendered(false);
    }, 200);
  }, [onClose]);

  const handleNext = useCallback(() => {
    if (photos.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  }, [photos.length]);

  const handlePrev = useCallback(() => {
    if (photos.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  }, [photos.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!app) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleSafeClose();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [app, handleSafeClose, handleNext, handlePrev]);

  // Touch swipe handling for mobile
  const handleTouchStart = (e: TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    setTouchStartX(null);
  };

  const copyToClipboard = async (text: string, type: 'user' | 'pass') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'user') {
        setCopiedUser(true);
        setTimeout(() => setCopiedUser(false), 2000);
      } else {
        setCopiedPass(true);
        setTimeout(() => setCopiedPass(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
  };

  if (!app) return null;

  const currentPhoto = photos[currentIndex] || { image: app.image, title: app.title };
  const hasLoginInfo = Boolean(app.demo_username || app.demo_password || app.login_link);
  const hasAnyLink = Boolean(app.live_link || app.github_link);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-zinc-900/60 backdrop-blur-md transition-opacity duration-200 ${isRendered && !isClosing ? 'opacity-100' : 'opacity-0'
        }`}
      onClick={handleSafeClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Detail & Galeri ${app.title}`}
    >
      {/* Modal Container: Fixed uniform height (h-[90vh] max-h-[820px] min-h-[580px]), light theme, zoom in/out */}
      <div
        className={`relative bg-white/95 backdrop-blur-xl border border-zinc-200/90 text-zinc-900 rounded-2xl shadow-2xl max-w-4xl w-full h-[90vh] max-h-[820px] min-h-[580px] flex flex-col overflow-hidden transition-all duration-200 ease-out ${isRendered && !isClosing
          ? 'scale-100 opacity-100 translate-y-0'
          : 'scale-95 opacity-0 translate-y-2'
          }`}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Header Modal (Fixed 64px height) */}
        <div className="h-16 flex-shrink-0 flex items-center justify-between px-5 sm:px-6 border-b border-zinc-200/80 bg-white/90">
          <div className="min-w-0 pr-4">
            <h3 className="text-lg sm:text-xl font-bold text-zinc-900 truncate tracking-tight">
              {app.title}
            </h3>
            <p className="text-xs text-zinc-500 truncate mt-0.5">
              {photos.length > 1 ? `Foto ${currentIndex + 1} dari ${photos.length}` : 'Detail Aplikasi'}
            </p>
          </div>

          <button
            onClick={handleSafeClose}
            aria-label="Tutup modal"
            className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body (Scrollbar completely hidden) */}
        <div className="flex-1 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden p-4 sm:p-6 space-y-5">
          {/* Main Photo Display with Horizontal Slide Carousel */}
          <div className="relative group bg-zinc-100/90 rounded-xl border border-zinc-200/80 overflow-hidden h-[350px] sm:h-[390px] w-full flex-shrink-0">
            {/* Sliding Track */}
            <div
              className="flex h-full w-full transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {photos.map((photoItem, idx) => (
                <div
                  key={idx}
                  className="min-w-full w-full h-full flex items-center justify-center p-2 flex-shrink-0"
                >
                  {!failedImages[idx] ? (
                    <img
                      src={photoItem.image}
                      alt={photoItem.title || app.title}
                      onError={() => {
                        setFailedImages((prev) => ({ ...prev, [idx]: true }));
                      }}
                      className="w-full h-full object-contain select-none pointer-events-none"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-6 text-zinc-400 gap-2">
                      <div className="w-12 h-12 rounded-full bg-zinc-200/70 flex items-center justify-center text-zinc-400 mb-1">
                        <ImageOff className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-semibold text-zinc-700">Foto tidak dapat dibuka</p>
                      <span className="text-xs text-zinc-400">File gambar tidak ditemukan atau link bermasalah</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Carousel Navigation Arrows */}
            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Foto sebelumnya"
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/90 hover:bg-white text-zinc-800 shadow-md border border-zinc-200/80 transition-transform active:scale-90 focus:outline-none focus:ring-2 focus:ring-zinc-800"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Foto selanjutnya"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/90 hover:bg-white text-zinc-800 shadow-md border border-zinc-200/80 transition-transform active:scale-90 focus:outline-none focus:ring-2 focus:ring-zinc-800"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Photo Counter Badge */}
            {photos.length > 1 && (
              <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-md text-[11px] font-semibold text-zinc-700 border border-zinc-200 shadow-xs">
                {currentIndex + 1} / {photos.length}
              </div>
            )}
          </div>

          {/* Caption & Description of Active Photo (if provided) */}
          {(currentPhoto.title || currentPhoto.description) && (
            <div className="bg-zinc-50 rounded-xl p-3.5 border border-zinc-200/70 flex-shrink-0">
              {currentPhoto.title && (
                <h4 className="text-sm font-semibold text-zinc-900">
                  {currentPhoto.title}
                </h4>
              )}
              {currentPhoto.description && (
                <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                  {currentPhoto.description}
                </p>
              )}
            </div>
          )}

          {/* Thumbnails list if > 1 */}
          {photos.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden flex-shrink-0">
              {photos.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all flex items-center justify-center bg-zinc-100 ${idx === currentIndex
                    ? 'border-emerald-600 ring-2 ring-emerald-500/20 scale-105'
                    : 'border-zinc-200 opacity-70 hover:opacity-100'
                    }`}
                >
                  <img
                    src={p.image}
                    alt=""
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=200&q=80';
                    }}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Nama Aplikasi dan Deskripsi (Diletakkan di atas informasi login) */}
          <div className="bg-zinc-50 rounded-xl p-4 sm:p-5 border border-zinc-200/80 flex-shrink-0 space-y-1.5">
            <h4 className="text-base sm:text-lg font-bold text-zinc-900 tracking-tight">
              {app.title}
            </h4>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              {app.description}
            </p>
          </div>

          {/* Section Informasi Login (Tanpa dot, ganti nama jadi INFORMASI LOGIN) */}
          {hasLoginInfo && (
            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-4 sm:p-5 shadow-xs space-y-3 flex-shrink-0">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h4 className="text-xs sm:text-sm font-bold text-emerald-950 tracking-wide uppercase flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-emerald-700" />
                  INFORMASI LOGIN
                </h4>
                {app.demo_note && (
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {app.demo_note}
                  </span>
                )}
              </div>

              <p className="text-xs text-emerald-900/80">
                Gunakan kredensial berikut untuk login ke aplikasi:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* Username Box */}
                {app.demo_username && (
                  <div className="bg-white border border-emerald-200/90 rounded-lg p-3 flex items-center justify-between gap-2 shadow-2xs">
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] uppercase font-bold text-zinc-500 block mb-0.5">
                        Username / Email
                      </span>
                      <code className="text-xs font-mono font-bold text-emerald-800 truncate block">
                        {app.demo_username}
                      </code>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(app.demo_username!, 'user')}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 flex-shrink-0 ${copiedUser
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200'
                        }`}
                    >
                      {copiedUser ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-zinc-500" />
                          <span>Salin User</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Password Box */}
                {app.demo_password && (
                  <div className="bg-white border border-emerald-200/90 rounded-lg p-3 flex items-center justify-between gap-2 shadow-2xs">
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] uppercase font-bold text-zinc-500 block mb-0.5">
                        Password
                      </span>
                      <code className="text-xs font-mono font-bold text-emerald-800 truncate block">
                        {app.demo_password}
                      </code>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(app.demo_password!, 'pass')}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 flex-shrink-0 ${copiedPass
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200'
                        }`}
                    >
                      {copiedPass ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-zinc-500" />
                          <span>Salin Pass</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Quick Login Link Button if provided */}
              {app.login_link && (
                <div className="pt-2 flex items-center justify-between border-t border-emerald-200/60 mt-2">
                  <span className="text-xs text-emerald-900 font-medium">
                    Halaman form otentikasi login:
                  </span>
                  <a
                    href={app.login_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-2xs"
                  >
                    <span>Buka Halaman Login</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Tech Stack & Action Links (Source Code berdampingan dengan Buka Aplikasi) */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-200/70 flex-shrink-0">
            <div className="flex flex-wrap gap-1.5">
              {app.tech_stack.split(',').map((tech, i) => (
                <span key={i} className="text-[11px] font-medium bg-zinc-100 text-zinc-700 px-2.5 py-0.5 rounded-md border border-zinc-200">
                  {tech.trim()}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2.5">
              {app.github_link && (
                <a
                  href={app.github_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200 transition-colors inline-flex items-center gap-1.5 shadow-2xs"
                >
                  <GithubIcon className="w-4 h-4" />
                  <span>Source Code</span>
                </a>
              )}

              {app.live_link && (
                <a
                  href={app.live_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-white transition-colors shadow-sm inline-flex items-center gap-1.5"
                >
                  <span>Buka Aplikasi</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              {!hasAnyLink && (
                <span className="text-xs text-zinc-400 italic py-1">
                  Dokumentasi internal
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
