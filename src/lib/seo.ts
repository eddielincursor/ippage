import { site, siteUrl, topics, type Topic } from '../config';
import { type Essay, essayTopics } from './essays';
import { stringifyJsonLd } from './json-ld';
import { absoluteUrl, ogImageForEssayId } from './urls';

const personId = `${siteUrl}/about/#person`;
const siteId = `${siteUrl}/#website`;

export type JsonLd = Record<string, unknown>;

export function personSchema(): JsonLd {
  return {
    '@type': 'Person',
    '@id': personId,
    name: site.author,
    url: absoluteUrl('/about/'),
    email: site.email,
    description: site.description,
    knowsAbout: topics.map((topic) => topic.name),
  };
}

export function websiteSchema(): JsonLd {
  return {
    '@type': 'WebSite',
    '@id': siteId,
    url: `${siteUrl}/`,
    name: site.name,
    description: site.description,
    inLanguage: 'zh-Hant-TW',
    publisher: { '@id': personId },
  };
}

export function blogPostingSchema(essay: Essay): JsonLd {
  const url = absoluteUrl(`/essays/${essay.id}/`);

  return {
    '@type': 'BlogPosting',
    headline: essay.data.title,
    description: essay.data.description,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    datePublished: essay.data.pubDate.toISOString(),
    dateModified: (essay.data.updatedDate ?? essay.data.pubDate).toISOString(),
    articleSection: essayTopics(essay).map((topic) => topic.name),
    image: ogImageForEssayId(essay.id),
    inLanguage: 'zh-Hant-TW',
    author: { '@id': personId },
    publisher: { '@id': personId },
    isPartOf: { '@id': siteId },
  };
}

export function collectionSchema(topic: Topic, essays: Essay[]): JsonLd {
  return {
    '@type': 'CollectionPage',
    name: `${topic.name} · ${site.name}`,
    description: topic.description,
    url: absoluteUrl(`/topics/${topic.slug}/`),
    inLanguage: 'zh-Hant-TW',
    isPartOf: { '@id': siteId },
    about: topic.name,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: essays.map((essay, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: absoluteUrl(`/essays/${essay.id}/`),
        name: essay.data.title,
      })),
    },
  };
}

export type Crumb = { name: string; href: string };

export function breadcrumbSchema(crumbs: Crumb[]): JsonLd {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.href),
    })),
  };
}

export function graph(nodes: JsonLd[]): string {
  return stringifyJsonLd({ '@context': 'https://schema.org', '@graph': nodes });
}
