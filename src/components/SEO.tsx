import React from 'react';
import { Helmet } from 'react-helmet-async';
import { getBaseURL, getCurrentURL, buildImageURL } from '@/lib/env';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = "Bengaluru Flower School - Best Flower Arranging Classes in Bangalore",
  description = "Learn professional flower arranging at Bengaluru Flower School. Expert classes in bangalore for beginners to advanced students. Join the best flower arrangement workshops in bengaluru.",
  keywords = "bengaluru flower school, bangalore flower classes, flower arranging bengaluru, flower workshops bangalore, floral design classes bengaluru, flower arrangement courses bangalore, best flower school bengaluru, professional floristry bengaluru",
  image = "/flower-school-logo.png",
  url
}) => {
  const currentURL = url || getCurrentURL();
  const baseURL = getBaseURL();
  const fullImageURL = buildImageURL(image);

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Bengaluru Flower School" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="city" content="Bengaluru" />
      <meta name="country" content="India" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={currentURL} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageURL} />
      <meta property="og:url" content={currentURL} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Bengaluru Flower School" />
      <meta property="og:locale" content="en_IN" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageURL} />
      
      {/* Local Business Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          "name": "Bengaluru Flower School",
          "description": "Professional flower arranging classes and workshops in Bengaluru",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Bengaluru",
            "addressRegion": "Karnataka",
            "addressCountry": "India"
          },
          "url": baseURL,
          "logo": fullImageURL,
          "sameAs": [
            "https://www.instagram.com/flowerschoolbengaluru",
            "https://www.facebook.com/flowerschoolbengaluru"
          ],
          "offers": {
            "@type": "Offer",
            "description": "Flower arranging classes in Bengaluru",
            "category": "Education"
          }
        })}
      </script>
    </Helmet>
  );
};

export default SEO;