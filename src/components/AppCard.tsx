import React from 'react';
import { ExternalLink } from 'lucide-react';

export interface AppCardProps {
  title: string;
  description: string;
  techStack: string;
  image: string;
  liveLink?: string;
  githubLink?: string;
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

export default function AppCard({
  title,
  description,
  techStack,
  image,
  liveLink,
  githubLink,
}: AppCardProps) {
  const stacks = techStack
    ? techStack
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const isLive = Boolean(liveLink && liveLink.trim().length > 0);

  return (
    <div className="group flex flex-col bg-white border border-zinc-200 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-zinc-400 hover:-translate-y-1">
      {/* Thumbnail / Screenshot Container */}
      <div className="relative w-full h-52 overflow-hidden bg-zinc-100 border-b border-zinc-100">
        <img
          src={image}
          alt={`Screenshot ${title}`}
          className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            // Fallback placeholder if image fails to load
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Live / Offline Status Badge */}
        <div className="absolute top-3 right-3">
          {isLive ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/90 text-white backdrop-blur-md shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Live Demo
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-900/75 text-zinc-200 backdrop-blur-md shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
              Lokal / Screenshot
            </span>
          )}
        </div>
      </div>

      {/* Content Container */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-zinc-900 group-hover:text-zinc-700 transition-colors">
            {title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600 line-clamp-3">
            {description}
          </p>

          {/* Tech Stack Pills */}
          {stacks.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {stacks.map((stack) => (
                <span
                  key={stack}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-zinc-100 text-zinc-700 border border-zinc-200/60"
                >
                  {stack}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Actions Footer */}
        <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center gap-3">
          {isLive && (
            <a
              href={liveLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Buka Aplikasi"
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-zinc-900 text-white hover:bg-zinc-800 active:scale-[0.98] transition-all duration-200 shadow-sm"
            >
              <span>Buka Aplikasi</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}

          {githubLink && (
            <a
              href={githubLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Source Code"
              className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-zinc-300 text-zinc-800 hover:bg-zinc-100 active:scale-[0.98] transition-all duration-200 ${
                !isLive ? 'flex-1 bg-white' : ''
              }`}
            >
              <GithubIcon className="w-4 h-4" />
              <span>Source Code</span>
            </a>
          )}

          {!isLive && !githubLink && (
            <span className="text-xs text-zinc-400 italic py-2">
              Dokumentasi aplikasi internal
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
