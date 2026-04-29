import { useEffect } from 'react';

/**
 * SEO component to handle dynamic title, description, canonical link, and JSON-LD structured data.
 */
const SEO = ({ title, description, canonical, schema }) => {
  useEffect(() => {
    // Update title
    if (title) {
      document.title = `${title} | PDFMasterstool`;
    }

    // Update description meta tag
    let descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta) {
      descriptionMeta.setAttribute('content', description || '100% private, browser-side PDF tools. No file uploads. Process PDFs locally in your browser for maximum privacy.');
    }

    // Update canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    const currentUrl = window.location.origin + window.location.pathname;
    const finalCanonical = canonical || currentUrl;

    if (canonicalLink) {
      canonicalLink.setAttribute('href', finalCanonical);
    } else {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      canonicalLink.setAttribute('href', finalCanonical);
      document.head.appendChild(canonicalLink);
    }

    // Update Open Graph and Twitter tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title || 'PDFMasterstool');

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', finalCanonical);

    // Structured Data (JSON-LD)
    let scriptTag = document.getElementById('json-ld-schema');
    if (scriptTag) {
      scriptTag.innerHTML = JSON.stringify(schema || defaultSchema(finalCanonical));
    } else {
      scriptTag = document.createElement('script');
      scriptTag.id = 'json-ld-schema';
      scriptTag.type = 'application/ld+json';
      scriptTag.innerHTML = JSON.stringify(schema || defaultSchema(finalCanonical));
      document.head.appendChild(scriptTag);
    }

    return () => {
      // Cleanup if needed (though usually title/meta updates stay)
    };
  }, [title, description, canonical, schema]);

  return null; // This component doesn't render any visible UI
};

const defaultSchema = (url) => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "PDFMasterstool",
  "operatingSystem": "Web Browser",
  "applicationCategory": "UtilitiesApplication",
  "url": url,
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "author": {
    "@type": "Organization",
    "name": "PDFMasterstool Team"
  }
});

export default SEO;
