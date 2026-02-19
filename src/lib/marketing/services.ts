export const SERVICES = [
  {
    slug: 'house-move',
    title: 'House Move',
    description:
      'Full home removals. We pack, load, and deliver so you can focus on settling in.',
    longDescription:
      'Whether you are moving across town or across the country, we handle the heavy lifting. Our team can assist with packing, loading, transport, and unloading. Get an instant quote based on your postcodes and move size.',
  },
  {
    slug: 'office-move',
    title: 'Office Move',
    description:
      'Commercial moves with minimal downtime. Furniture and equipment handled with care.',
    longDescription:
      'Minimise business disruption with a planned office move. We move desks, IT equipment, and filing systems with care. Flexible scheduling including evenings and weekends.',
  },
  {
    slug: 'single-item',
    title: 'Single Item',
    description:
      'Sofas, beds, appliances. One item or a few—same reliable service.',
    longDescription:
      'Need to move a sofa, bed, washing machine, or a few items? We offer the same reliable man and van service for single items. Same-day and next-day options available.',
  },
  {
    slug: 'student-move',
    title: 'Student Move',
    description:
      'End-of-term moves and storage. Student-friendly pricing.',
    longDescription:
      'End-of-term moves and storage made simple. We know student budgets and timelines. Book by the hour or get a fixed quote for your room move.',
  },
  {
    slug: 'ebay-delivery',
    title: 'eBay & Marketplace',
    description:
      'Buyer collection and seller delivery. Same-day options available.',
    longDescription:
      'Collection from sellers and delivery to buyers. Ideal for eBay, Facebook Marketplace, and Gumtree. Same-day and next-day slots available in many areas.',
  },
] as const;

export type ServiceSlug = (typeof SERVICES)[number]['slug'];

export function getServiceBySlug(slug: string) {
  return SERVICES.find((s) => s.slug === slug) ?? null;
}
