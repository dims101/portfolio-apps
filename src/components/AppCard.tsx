import { ExternalLink, Key, Images, Lock, Globe } from 'lucide-react';
import type { AppItem } from '../utils/fetchApps';

export interface AppCardProps {
  app: AppItem;
  onOpenGallery?: (app: AppItem) => void;
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

export default function AppCard({ app, onOpenGallery }: AppCardProps) {
  const {
    title,
    description,
    tech_stack,
    image,
    live_link,
    github_link,
    demo_username,
    demo_password,
    gallery,
  } = app;

  const stacks = tech_stack
    ? tech_stack
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const isLive = Boolean(live_link && live_link.trim().length > 0);
  const hasGithub = Boolean(github_link && github_link.trim().length > 0);
  const hasLoginInfo = Boolean(demo_username || demo_password);
  const photoCount = gallery && gallery.length > 0 ? gallery.length : 1;

  const handleCardClick = () => {
    if (onOpenGallery) {
      onOpenGallery(app);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="group h-full flex flex-col bg-white border border-zinc-200/90 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:border-zinc-300 hover:-translate-y-1 select-none"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      {/* Fixed-Height Thumbnail Container */}
      <div className="relative w-full h-48 sm:h-52 overflow-hidden bg-zinc-100 border-b border-zinc-100 flex-shrink-0">
        <img
          src={image}
          alt={`Screenshot ${title}`}
          className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Hover Hint Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-white/95 drop-shadow-sm">
            <Images className="w-3.5 h-3.5 text-emerald-400" />
            <span>Klik kartu untuk galeri & detail</span>
          </span>
        </div>

        {/* Top Badges (Multi-photo badge & Live badge) */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          {photoCount > 1 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-zinc-900/80 text-zinc-100 backdrop-blur-md shadow-xs border border-white/10">
              <Images className="w-3 h-3 text-emerald-400" />
              <span>{photoCount} Foto</span>
            </span>
          )}

          {hasLoginInfo && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold bg-emerald-950/80 text-emerald-300 backdrop-blur-md border border-emerald-500/30">
              <Key className="w-3 h-3" />
              <span>Info Login</span>
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3">
          {isLive ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/90 text-white backdrop-blur-md shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Live Demo
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-zinc-900/75 text-zinc-200 backdrop-blur-md shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
              Lokal
            </span>
          )}
        </div>
      </div>

      {/* Structured Content Container with Fixed Height Rhythms */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Uniform Title Slot (2 lines) */}
          <div className="h-14 flex items-start overflow-hidden">
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-900 group-hover:text-emerald-700 transition-colors line-clamp-2">
              {title}
            </h3>
          </div>

          {/* Uniform Description Slot (3 lines) */}
          <div className="h-16 overflow-hidden my-1">
            <p className="text-xs sm:text-sm leading-relaxed text-zinc-600 line-clamp-3">
              {description}
            </p>
          </div>

          {/* Uniform Access / Login Info Slot (fixed 36px height) */}
          <div className="h-9 my-3 flex items-center flex-shrink-0">
            {hasLoginInfo ? (
              <div className="w-full px-3 py-1.5 rounded-lg bg-emerald-50/80 border border-emerald-200/70 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-emerald-800 font-medium truncate">
                  <Lock className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span className="truncate">Info Login: <span className="font-mono font-semibold">{demo_username || 'Tersedia'}</span></span>
                </div>
                <span className="text-[11px] text-emerald-700 underline font-medium flex-shrink-0">
                  Lihat Info
                </span>
              </div>
            ) : (
              <div className="w-full px-3 py-1.5 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center text-xs text-zinc-400">
                <Globe className="w-3.5 h-3.5 text-zinc-400 mr-1.5 flex-shrink-0" />
                <span className="truncate">Akses langsung tanpa login khusus</span>
              </div>
            )}
          </div>

          {/* Uniform Tech Stack Slot (fixed 48px height) */}
          <div className="h-12 overflow-hidden flex flex-wrap gap-1.5 content-start flex-shrink-0">
            {stacks.map((stack) => (
              <span
                key={stack}
                className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-zinc-100 text-zinc-700 border border-zinc-200/60 flex-shrink-0"
              >
                {stack}
              </span>
            ))}
          </div>
        </div>

        {/* Uniform Actions Footer (pinned to bottom with fixed 42px height) */}
        <div className="mt-5 pt-4 border-t border-zinc-100 flex items-center gap-2.5 flex-shrink-0">
          {/* Kasus 1: Keduanya ada -> tampil berdampingan */}
          {isLive && hasGithub && (
            <>
              <a
                href={live_link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                aria-label="Buka Aplikasi Langsung"
                className="flex-1 h-[42px] inline-flex items-center justify-center gap-1.5 px-3 rounded-xl text-xs sm:text-sm font-semibold bg-zinc-900 text-white hover:bg-zinc-800 active:scale-[0.98] transition-all duration-200 shadow-sm"
              >
                <span>Buka Aplikasi</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={github_link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                aria-label="Lihat Source Code GitHub"
                className="flex-1 h-[42px] inline-flex items-center justify-center gap-1.5 px-3 rounded-xl text-xs sm:text-sm font-medium border border-zinc-300 text-zinc-800 hover:bg-zinc-100 active:scale-[0.98] transition-all duration-200 bg-white"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>Source Code</span>
              </a>
            </>
          )}

          {/* Kasus 2: Hanya Live Link */}
          {isLive && !hasGithub && (
            <a
              href={live_link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label="Buka Aplikasi Langsung"
              className="w-full h-[42px] inline-flex items-center justify-center gap-1.5 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-zinc-900 text-white hover:bg-zinc-800 active:scale-[0.98] transition-all duration-200 shadow-sm"
            >
              <span>Buka Aplikasi</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          {/* Kasus 3: Hanya GitHub Link */}
          {!isLive && hasGithub && (
            <a
              href={github_link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label="Lihat Source Code GitHub"
              className="w-full h-[42px] inline-flex items-center justify-center gap-1.5 px-4 rounded-xl text-xs sm:text-sm font-medium border border-zinc-300 text-zinc-800 hover:bg-zinc-100 active:scale-[0.98] transition-all duration-200 bg-white shadow-2xs"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span>Source Code</span>
            </a>
          )}

          {/* Kasus 4: Kedua link kosong (Internal/Local only) -> Fallback berukuran pas 42px tanpa error UI */}
          {!isLive && !hasGithub && (
            <div className="w-full h-[42px] px-3.5 rounded-xl bg-zinc-50 border border-zinc-200/60 flex items-center justify-center text-xs text-zinc-500 font-medium select-none">
              Dokumentasi & Pratinjau Internal
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
