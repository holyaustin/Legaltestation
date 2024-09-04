/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, Box, Container } from 'theme-ui';
import SectionHeading from '../components/section-heading';
import Service from '../components/cards/service';
import { transform } from 'framer-motion';

const services = [

  {
    title: 'Consumer Protection:',
    price: 'Ensuring fair and transparent terms in consumer contracts, warranties, and service agreements.'
  },
  {
    title: 'Mergers and Acquisitions:',
    price: 'Verifying and securing agreements related to mergers, acquisitions, and corporate takeovers.'
  },
  {
    title: 'Real Estate Transactions:',
    price: 'Facilitating secure and transparent real estate transactions, including property transfers, leases, and title deeds.',
  },
  {
    title: 'Contract Verification:',
    price: 'Attestation and verification of legal contracts and agreements, ensuring their authenticity and enforceability.'
  },
  {
    title: 'Family Law Agreements:',
    price: 'Securing prenuptial agreements, divorce settlements, and child custody arrangements with transparent and enforceable terms.',
  },
  {
    title: 'Supply Chain Management:',
    price: 'Verifying and tracking the authenticity of goods and services across complex supply chains, preventing fraud and counterfeiting.',
  },
  {
    title: 'Estate Planning and Wills:',
    price: 'Securing and attesting wills, trusts, and estate plans, ensuring they are executed according to the deceased wishes.'
  },
  {
    title: 'Employment Contracts:',
    price: 'Attestation and enforcement of employment contracts, non-disclosure agreements (NDAs), and non-compete clauses.'
  },
  {
    title: 'Intellectual Property Protection:',
    price: 'Secure registration and proof of ownership for intellectual property, such as patents, trademarks, and copyrights.'
  },


  {
    title: 'Debt Settlement and Loan Agreements',
    price: 'Managing and securing loan agreements, promissory notes, and debt settlements, ensuring terms are met.'
  },
  {
    title: 'Digital Signature Authentication:',
    price: 'Providing legally binding digital signatures for contracts, agreements, and other legal documents.'
  },
  {
    title: 'Cross-Border Agreements:',
    price: 'Managing and enforcing international contracts and agreements, ensuring compliance with different legal jurisdictions',
  },



];

const Services = () => {
  return (
    <Box as="section" id="services" sx={styles.section}>
      <Container>
        <SectionHeading
          slogan="Ideal solutions for you"
          title="Legaltestation can be applied across diverse sectors, offering a versatile and secure solution for a wide range of legal needs."
        />
        <Box sx={styles.grid}>
          {services.map((service, i) => (
            <Service key={i} service={service} />
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Services;

const styles = {
  section: {
    pt: [8, null, null, null, 10, 12],
    pb: [12, null, null, null, null, 15],
  },
  grid: {
    gap: [3, null, null, 4],
    display: 'grid',
    justifyContent: 'center',
    fontSize: "40px",
    gridTemplateColumns: [
      'repeat(2, 1fr)',
      null,
      null,
      'repeat(3, 1fr)',
      null,
      'repeat(4, 1fr)',
      'repeat(4, 300px)',
    ],
  },
};
