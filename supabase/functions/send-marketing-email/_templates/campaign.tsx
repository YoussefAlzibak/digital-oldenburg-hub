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
  Column,
  Row,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface CampaignEmailProps {
  firstName?: string
  lastName?: string
  email?: string
  company?: string
  companyName?: string
  subject?: string
  htmlContent?: string
  textContent?: string
  unsubscribeUrl?: string
  campaignId?: string
  trackingPixelUrl?: string
  websiteUrl?: string
  // Custom variables for formulas
  [key: string]: any
}

export const CampaignEmail = ({
  firstName = 'Kunde',
  lastName = '',
  email = '',
  company = '',
  companyName = 'Digital Masters',
  subject = 'Kampagne',
  htmlContent = '',
  textContent = '',
  unsubscribeUrl = '#',
  campaignId = '',
  trackingPixelUrl = '',
  websiteUrl = 'https://digital-masters.de',
  ...customVariables
}: CampaignEmailProps) => {
  // Process content with variables
  const processContent = (content: string) => {
    let processed = content
      .replace(/\{\{firstName\}\}/g, firstName)
      .replace(/\{\{first_name\}\}/g, firstName)
      .replace(/\{\{lastName\}\}/g, lastName)
      .replace(/\{\{last_name\}\}/g, lastName)
      .replace(/\{\{email\}\}/g, email)
      .replace(/\{\{company\}\}/g, company)
      .replace(/\{\{companyName\}\}/g, companyName)
      .replace(/\{\{company_name\}\}/g, companyName)
      .replace(/\{\{websiteUrl\}\}/g, websiteUrl)
      .replace(/\{\{website_url\}\}/g, websiteUrl)

    // Process custom variables
    Object.entries(customVariables).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g')
      processed = processed.replace(regex, String(value))
    })

    return processed
  }

  const processedContent = processContent(htmlContent)
  const processedSubject = processContent(subject)

  return (
    <Html>
      <Head />
      <Preview>{processedSubject}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={headerSection}>
            <Row>
              <Column style={headerColumn}>
                <Heading style={h1}>{companyName}</Heading>
                <Text style={headerSubtitle}>
                  {processedSubject}
                </Text>
              </Column>
            </Row>
          </Section>

          {/* Main Content */}
          <Section style={contentSection}>
            <Text style={greeting}>
              Hallo {firstName}{lastName ? ` ${lastName}` : ''},
            </Text>
            
            <div 
              dangerouslySetInnerHTML={{ __html: processedContent }} 
              style={htmlContentStyle} 
            />
            
            {/* Call-to-Action Section */}
            <Section style={ctaSection}>
              <Button
                href={`${websiteUrl}?utm_source=email&utm_campaign=${campaignId}`}
                style={primaryButton}
              >
                Jetzt entdecken
              </Button>
            </Section>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footerSection}>
            <Row>
              <Column style={footerColumn}>
                <Text style={footerTitle}>
                  {companyName}
                </Text>
                <Text style={footerText}>
                  Ihr Partner für digitale Lösungen
                </Text>
                <Text style={footerLinks}>
                  <Link href={websiteUrl} style={footerLink}>
                    Website
                  </Link>
                  {' | '}
                  <Link href={`${websiteUrl}/contact`} style={footerLink}>
                    Kontakt
                  </Link>
                  {' | '}
                  <Link href={`${websiteUrl}/services`} style={footerLink}>
                    Services
                  </Link>
                </Text>
              </Column>
            </Row>
            
            <Hr style={footerHr} />
            
            <Text style={unsubscribeText}>
              Sie erhalten diese E-Mail, weil Sie sich für unsere Updates angemeldet haben.
              <br />
              <Link href={unsubscribeUrl} style={unsubscribeLink}>
                Hier klicken, um sich abzumelden
              </Link>
            </Text>
            
            {/* Tracking Pixel */}
            {trackingPixelUrl && (
              <Img
                src={trackingPixelUrl}
                width="1"
                height="1"
                alt=""
                style={{ display: 'none' }}
              />
            )}
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default CampaignEmail

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px',
  maxWidth: '600px',
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
}

const headerSection = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: '12px 12px 0 0',
  padding: '40px 32px',
}

const headerColumn = {
  textAlign: 'center' as const,
}

const h1 = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: '700',
  margin: '0 0 8px 0',
  lineHeight: '1.2',
}

const headerSubtitle = {
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '400',
  margin: '0',
  opacity: '0.9',
  lineHeight: '1.4',
}

const contentSection = {
  padding: '40px 32px',
}

const greeting = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#2d3748',
  margin: '0 0 24px 0',
  lineHeight: '1.4',
}

const htmlContentStyle = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#4a5568',
  margin: '0 0 32px 0',
}

const ctaSection = {
  textAlign: 'center' as const,
  margin: '40px 0',
}

const primaryButton = {
  backgroundColor: '#667eea',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '16px 32px',
  lineHeight: '1',
  boxShadow: '0 4px 6px rgba(102, 126, 234, 0.25)',
}

const hr = {
  borderColor: '#e2e8f0',
  margin: '32px 0',
}

const footerSection = {
  padding: '32px',
  backgroundColor: '#f7fafc',
  borderRadius: '0 0 12px 12px',
}

const footerColumn = {
  textAlign: 'center' as const,
}

const footerTitle = {
  color: '#2d3748',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 8px 0',
}

const footerText = {
  color: '#718096',
  fontSize: '14px',
  margin: '0 0 16px 0',
  lineHeight: '1.4',
}

const footerLinks = {
  color: '#718096',
  fontSize: '14px',
  margin: '0 0 24px 0',
}

const footerLink = {
  color: '#667eea',
  textDecoration: 'none',
  fontWeight: '500',
}

const footerHr = {
  borderColor: '#e2e8f0',
  margin: '24px 0',
}

const unsubscribeText = {
  color: '#a0aec0',
  fontSize: '12px',
  lineHeight: '1.4',
  textAlign: 'center' as const,
  margin: '0',
}

const unsubscribeLink = {
  color: '#a0aec0',
  textDecoration: 'underline',
}