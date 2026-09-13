import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AppCard from './AppCard';

describe('AppCard Component', () => {
  it('renders application title, description, and tech stack tags', () => {
    render(
      <AppCard
        title="Finance Dashboard"
        description="Sistem analitik keuangan real-time."
        techStack="React, TypeScript, Tailwind CSS"
        image="https://images.unsplash.com/photo-1551288049-bebda4e38f71"
      />
    );

    expect(screen.getByText('Finance Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Sistem analitik keuangan real-time.')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Tailwind CSS')).toBeInTheDocument();
  });

  it('renders live link button when liveLink is provided', () => {
    render(
      <AppCard
        title="Finance Dashboard"
        description="Sistem analitik keuangan real-time."
        techStack="React"
        image="https://images.unsplash.com/photo-1551288049-bebda4e38f71"
        liveLink="https://example.com"
      />
    );

    const liveBtn = screen.getByRole('link', { name: /buka aplikasi/i });
    expect(liveBtn).toBeInTheDocument();
    expect(liveBtn).toHaveAttribute('href', 'https://example.com');
  });

  it('does not render live link button when liveLink is empty or not provided', () => {
    render(
      <AppCard
        title="Internal Tool"
        description="Aplikasi internal perusahaan."
        techStack="React"
        image="https://images.unsplash.com/photo-1551288049-bebda4e38f71"
      />
    );

    expect(screen.queryByRole('link', { name: /buka aplikasi/i })).not.toBeInTheDocument();
    expect(screen.getByText(/lokal \/ screenshot/i)).toBeInTheDocument();
  });

  it('renders github link button when githubLink is provided', () => {
    render(
      <AppCard
        title="Open Source Library"
        description="Library utilitas."
        techStack="TypeScript"
        image="https://images.unsplash.com/photo-1551288049-bebda4e38f71"
        githubLink="https://github.com/example/lib"
      />
    );

    const githubBtn = screen.getByRole('link', { name: /source code/i });
    expect(githubBtn).toBeInTheDocument();
    expect(githubBtn).toHaveAttribute('href', 'https://github.com/example/lib');
  });
});
