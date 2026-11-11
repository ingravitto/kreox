import { SITE } from './site';

export const ORG_ID = `${SITE.url}/#organization`;

export function organizationSchema() {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE.name,
    legalName: SITE.legalName,
    alternateName: 'KREOX Sistemas de Nivelación',
    url: `${SITE.url}/`,
    logo: `${SITE.url}/img/kreox-logo.png`,
    description: SITE.description,
    taxID: SITE.cif,
    telephone: SITE.phoneHref.replace('tel:', ''),
    email: SITE.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.address.street,
      postalCode: SITE.address.postalCode,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.region,
      addressCountry: SITE.address.country,
    },
    contactPoint: [
      { '@type': 'ContactPoint', contactType: 'sales', telephone: SITE.phoneHref.replace('tel:', ''), email: SITE.email, areaServed: 'ES', availableLanguage: ['es'] },
      { '@type': 'ContactPoint', contactType: 'sales', name: 'Exportación', email: SITE.emailExport, availableLanguage: ['es', 'en'] },
    ],
    sameAs: Object.values(SITE.social),
    knowsAbout: ['mortero autonivelante', 'nivelación de pavimentos', 'suelo radiante', 'recrecidos', 'colocación de azulejos'],
  };
}

export function websiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': `${SITE.url}/#website`,
    url: `${SITE.url}/`,
    name: SITE.name,
    inLanguage: 'es',
    publisher: { '@id': ORG_ID },
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: new URL(it.url, SITE.url).href,
    })),
  };
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function productSchema(p: {
  id: string;
  name: string;
  alternateName?: string[];
  description: string;
  images: string[];
  weightG?: number;
  related?: string;
  props: [string, string][];
}) {
  return {
    '@type': 'Product',
    '@id': p.id.includes('#') ? `${SITE.url}${p.id}` : `${SITE.url}${p.id}#product`,
    url: `${SITE.url}${p.id}`,
    name: p.name,
    ...(p.alternateName ? { alternateName: p.alternateName } : {}),
    description: p.description,
    brand: { '@type': 'Brand', name: SITE.name },
    manufacturer: { '@id': ORG_ID },
    category: 'Niveladores para mortero autonivelante',
    image: p.images.map((i) => new URL(i, SITE.url).href),
    countryOfOrigin: 'ES',
    ...(p.weightG ? { weight: { '@type': 'QuantitativeValue', value: p.weightG, unitCode: 'GRM' } } : {}),
    ...(p.related ? { isRelatedTo: { '@id': `${SITE.url}${p.related}#product` } } : {}),
    additionalProperty: p.props.map(([name, value]) => ({ '@type': 'PropertyValue', name, value })),
  };
}
