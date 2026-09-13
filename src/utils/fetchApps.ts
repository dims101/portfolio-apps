export interface AppItem {
  title: string;
  description: string;
  tech_stack: string;
  image: string;
  live_link?: string;
  github_link?: string;
}

export function getApps(): AppItem[] {
  // Mengambil seluruh file JSON di folder content/apps secara statis saat build
  const modules = import.meta.glob<AppItem>('../content/apps/*.json', {
    eager: true,
    import: 'default',
  });

  return Object.values(modules);
}
