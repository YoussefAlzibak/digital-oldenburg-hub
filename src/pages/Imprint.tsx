import { WebsiteLayout } from "@/components/WebsiteLayout";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Building2, User, Mail, Phone, Globe } from "lucide-react";

const Imprint = () => {
  return (
    <WebsiteLayout>
      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-8 sm:mb-12">
              <Badge className="mb-4 px-4 py-2 bg-primary/10 text-primary border-primary/20">
                <FileText className="h-4 w-4 mr-2" />
                Rechtliches
              </Badge>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                Impressum
              </h1>
              <p className="text-muted-foreground text-lg">
                Angaben gemäß § 5 TMG
              </p>
            </div>
          </ScrollReveal>

          <div className="space-y-6 sm:space-y-8">
            {/* Anbieter */}
            <ScrollReveal animation="fade-up" delay={100}>
              <Card className="glass-card">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold">Anbieter</h2>
                  </div>
                  <div className="space-y-2 text-muted-foreground">
                    <p className="font-semibold text-foreground">Unicum Tech</p>
                    <p>Hirschberger Straße 30</p>
                    <p>26135 Oldenburg</p>
                    <p>Deutschland</p>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Kontakt */}
            <ScrollReveal animation="fade-up" delay={200}>
              <Card className="glass-card">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold">Kontakt</h2>
                  </div>
                  <div className="space-y-3 text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4" />
                      <a href="tel:+491706666809" className="hover:text-primary transition-colors">
                        +49 170 6666809
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4" />
                      <a href="mailto:info@unicum-tech.com" className="hover:text-primary transition-colors">
                        info@unicum-tech.com
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4" />
                      <a href="https://www.unicum-tech.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                        www.unicum-tech.com
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Verantwortlich für den Inhalt */}
            <ScrollReveal animation="fade-up" delay={300}>
              <Card className="glass-card">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
                  </div>
                  <div className="space-y-2 text-muted-foreground">
                    <p className="font-semibold text-foreground">Unicum Tech</p>
                    <p>Hirschberger Straße 30</p>
                    <p>26135 Oldenburg</p>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Haftungsausschluss */}
            <ScrollReveal animation="fade-up" delay={400}>
              <Card className="glass-card">
                <CardContent className="p-6 sm:p-8">
                  <h2 className="text-xl sm:text-2xl font-bold mb-4">Haftungsausschluss</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Haftung für Inhalte</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den 
                        allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht 
                        verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen 
                        zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder 
                        Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. 
                        Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten 
                        Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese 
                        Inhalte umgehend entfernen.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg mb-2">Haftung für Links</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. 
                        Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der 
                        verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die 
                        verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. 
                        Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche 
                        Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht 
                        zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg mb-2">Urheberrecht</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen 
                        Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der 
                        Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. 
                        Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. 
                        Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter 
                        beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine 
                        Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden 
                        von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Streitschlichtung */}
            <ScrollReveal animation="fade-up" delay={500}>
              <Card className="glass-card">
                <CardContent className="p-6 sm:p-8">
                  <h2 className="text-xl sm:text-2xl font-bold mb-4">Streitschlichtung</h2>
                  <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
                    <p>
                      Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
                      <a 
                        href="https://ec.europa.eu/consumers/odr/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline ml-1"
                      >
                        https://ec.europa.eu/consumers/odr/
                      </a>
                    </p>
                    <p>
                      Unsere E-Mail-Adresse finden Sie oben im Impressum.
                    </p>
                    <p>
                      Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer 
                      Verbraucherschlichtungsstelle teilzunehmen.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </WebsiteLayout>
  );
};

export default Imprint;
