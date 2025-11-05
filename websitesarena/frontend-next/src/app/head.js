export default function Head() {
  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://websitesarena.com/#organization',
    name: 'Websites Arena',
    url: 'https://websitesarena.com',
    logo: 'https://websitesarena.com/logo.jpg',
    sameAs: [
      'https://facebook.com/websitesarena',
      'https://twitter.com/websitesarena',
      'https://linkedin.com/company/websitesarena'
    ]
  };

  return (
    <>
      {/* Link to manifest and basic theme-color; keeps these server-rendered */}
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#1f2937" />

      {/* Organization structured data (server-rendered) */}
      <script type="application/ld+json">{JSON.stringify(orgSchema)}</script>
    </>
  );
}
