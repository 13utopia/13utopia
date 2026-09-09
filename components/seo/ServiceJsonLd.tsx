import { servicePageGraph } from '@/lib/schema';

export default function ServiceJsonLd({ path }: { path: string }) {
  const data = servicePageGraph(path);
  if (!data) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
