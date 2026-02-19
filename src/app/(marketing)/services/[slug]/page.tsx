import { notFound } from 'next/navigation';
import { getServiceBySlug } from '@/lib/marketing/services';
import { ServiceDetailContent } from './ServiceDetailContent';

export default function ServiceDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const service = getServiceBySlug(params.slug);
  if (!service) notFound();
  return <ServiceDetailContent service={service} />;
}
