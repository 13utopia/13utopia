import { organizationGraph } from '@/lib/schema';

export default function JsonLd() {
  const data = organizationGraph();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
