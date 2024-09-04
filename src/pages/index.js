import React from 'react';
import { ThemeProvider } from 'theme-ui';
import theme from '../theme';
import SEO from '../components/seo';
import Layout from '../components/layout';
import Banner from '../sections/banner';
import Services from '../sections/services';
import UltimateFeatures from '../sections/ultimate-feature';
import Faq from '../sections/faq';

export default function IndexPage() {
  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <SEO
          title="Legaltestation: Decentralized dispute resolution platform"
          description="Legaltestation leverages the power of the Sign Protocol, a robust blockchain attestation protocol, to provide a secure, transparent, and efficient solution for resolving legal conflicts."
        />
        <Banner />
        <Services />
        <UltimateFeatures />
        <Faq /> 
      </Layout>
    </ThemeProvider>
  );
}
