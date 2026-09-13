export interface GalleryPhoto {
  image: string;
  title?: string;
  description?: string;
}

export interface AppItem {
  id?: string;
  title: string;
  description: string;
  tech_stack: string;
  image: string;
  live_link?: string;
  login_link?: string;
  github_link?: string;
  demo_username?: string;
  demo_password?: string;
  demo_note?: string;
  gallery?: GalleryPhoto[];
}

export function getApps(): AppItem[] {
  // Mengambil seluruh file JSON di folder content/apps secara statis saat build
  const modules = import.meta.glob<AppItem>('../content/apps/*.json', {
    eager: true,
    import: 'default',
  });

  return Object.values(modules);
}
