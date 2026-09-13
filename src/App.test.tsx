import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App Main Component', () => {
  it('renders application catalog header without hero banner', () => {
    render(<App />);
    expect(screen.getByText('Aplikasi & Portofolio')).toBeInTheDocument();
    expect(screen.queryByText(/download cv/i)).not.toBeInTheDocument();
  });

  it('renders apps in grid and filters by search query', () => {
    render(<App />);

    // Check initial apps rendered
    expect(screen.getByText('SmartPOS — Sistem Kasir Modern')).toBeInTheDocument();
    expect(screen.getByText('Internal Sales Analytics & CRM')).toBeInTheDocument();

    // Test Search input
    const searchInput = screen.getByPlaceholderText(/cari berdasarkan nama/i);
    fireEvent.change(searchInput, { target: { value: 'SmartPOS' } });

    expect(screen.getByText('SmartPOS — Sistem Kasir Modern')).toBeInTheDocument();
    expect(screen.queryByText('Internal Sales Analytics & CRM')).not.toBeInTheDocument();
  });

  it('filters apps by Live Demo status', () => {
    render(<App />);

    const liveFilterBtn = screen.getByRole('button', { name: /live demo/i });
    fireEvent.click(liveFilterBtn);

    // SmartPOS has live_link -> should be visible
    expect(screen.getByText('SmartPOS — Sistem Kasir Modern')).toBeInTheDocument();
    // CRM does not have live_link -> should not be visible
    expect(screen.queryByText('Internal Sales Analytics & CRM')).not.toBeInTheDocument();
  });
});
