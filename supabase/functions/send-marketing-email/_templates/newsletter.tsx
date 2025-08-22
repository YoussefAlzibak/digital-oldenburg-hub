import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Img,
  Button,
  Hr,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface NewsletterEmailProps {
  firstName?: string
  lastName?: string
  companyName?: string
  subject?: string
  content?: string
  unsubscribeUrl?: string
  companyLogo?: string
  websiteUrl?: string
}

export const NewsletterEmail = ({
  firstName = 'Kunde',
  lastName = '',
  companyName = 'Digital Masters',
  subject = 'Newsletter',
  content = '',
  unsubscribeUrl = '#',
  companyLogo = '',
  websiteUrl = 'https://digital-masters.de',
}: NewsletterEmailProps) => (
  <Html>
    <Head />
    <Preview>{subject} - Ihre neuesten Updates</Preview>
    <Body style={main}>
      <Container style={container}>
        {companyLogo && (
          <Section style={logoContainer}>
            <Img
              src={companyLogo}
              width="120"
              height="auto"
              alt={companyName}
              style={logo}
            />
          </Section>
        )}
        
        <Section style={headerSection}>
          <Heading style={h1}>{companyName}</Heading>
          <Text style={subtitle}>{subject}</Text>
        </Section>

        <Section style={contentSection}>
          <Text style={greeting}>
            Hallo {firstName} {lastName},
          </Text>
          
          <div dangerouslySetInnerHTML={{ __html: content }} style={htmlContent} />
          
          <Section style={ctaSection}>
            <Button
              href={websiteUrl}
              style={button}
            >
              Mehr erfahren
            </Button>
          </Section>
        </Section>

        <Hr style={hr} />

        <Section style={footerSection}>
          <Text style={footerText}>
            Vielen Dank für Ihr Interesse an {companyName}!
          </Text>
          <Text style={footerText}>
            <Link href={websiteUrl} style={link}>
              {companyName}
            </Link>
          </Text>
          <Text style={unsubscribeText}>
            <Link href={unsubscribeUrl} style={unsubscribeLink}>
              Von diesem Newsletter abmelden
            </Link>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default NewsletterEmail

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '600px',
}

const logoContainer = {
  textAlign: 'center' as const,
  padding: '20px 0',
}

const logo = {
  margin: '0 auto',
}

const headerSection = {
  textAlign: 'center' as const,
  padding: '32px 0',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: '12px 12px 0 0',
}

const h1 = {
  color: '#ffffff',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0 0 12px 0',
  lineHeight: '1.25',
}

const subtitle = {
  color: '#ffffff',
  fontSize: '16px',
  lineHeight: '1.4',
  margin: '0',
  opacity: '0.9',
}

const contentSection = {
  padding: '40px 32px',
  backgroundColor: '#f9f9f9',
}

const greeting = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#333333',
  margin: '0 0 24px 0',
}

const htmlContent = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#555555',
  margin: '0 0 32px 0',
}

const ctaSection = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  backgroundColor: '#667eea',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 28px',
  lineHeight: '1',
}

const hr = {
  borderColor: '#e6e6e6',
  margin: '20px 0',
}

const footerSection = {
  textAlign: 'center' as const,
  padding: '32px',
  backgroundColor: '#ffffff',
  borderRadius: '0 0 12px 12px',
}

const footerText = {
  color: '#666666',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '0 0 8px 0',
}

const link = {
  color: '#667eea',
  textDecoration: 'underline',
}

const unsubscribeText = {
  color: '#999999',
  fontSize: '12px',
  margin: '16px 0 0 0',
}

const unsubscribeLink = {
  color: '#999999',
  textDecoration: 'underline',
}