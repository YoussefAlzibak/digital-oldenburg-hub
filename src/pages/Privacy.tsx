import { WebsiteLayout } from "@/components/WebsiteLayout";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Database, Cookie, Mail, Eye, Lock, UserCheck, Server } from "lucide-react";

const Privacy = () => {
  return (
    <WebsiteLayout>
      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-8 sm:mb-12">
              <Badge className="mb-4 px-4 py-2 bg-primary/10 text-primary border-primary/20">
                <Shield className="h-4 w-4 mr-2" />
                Datenschutz
              </Badge>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                Datenschutzerklärung
              </h1>
              <p className="text-muted-foreground text-lg">
                Informationen zum Schutz Ihrer personenbezogenen Daten
              </p>
            </div>
          </ScrollReveal>

          <div className="space-y-6 sm:space-y-8">
            {/* Verantwortlicher */}
            <ScrollReveal animation="fade-up" delay={100}>
              <Card className="glass-card">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <UserCheck className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold">1. Verantwortlicher</h2>
                  </div>
                  <div className="space-y-2 text-muted-foreground text-sm">
                    <p>Verantwortlich für die Datenverarbeitung auf dieser Website:</p>
                    <p className="font-semibold text-foreground mt-3">Unicum Tech</p>
                    <p>Hirschberger Straße 30</p>
                    <p>26135 Oldenburg</p>
                    <p>Deutschland</p>
                    <p className="mt-3">
                      E-Mail: <a href="mailto:info@unicum-tech.com" className="text-primary hover:underline">info@unicum-tech.com</a>
                    </p>
                    <p>Telefon: 0170 6666809</p>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Datenerfassung */}
            <ScrollReveal animation="fade-up" delay={200}>
              <Card className="glass-card">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Database className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold">2. Datenerfassung auf dieser Website</h2>
                  </div>
                  
                  <div className="space-y-6 text-muted-foreground text-sm leading-relaxed">
                    <div>
                      <h3 className="font-semibold text-foreground text-lg mb-2">Server-Log-Dateien</h3>
                      <p className="mb-3">
                        Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten Server-Log-Dateien, 
                        die Ihr Browser automatisch an uns übermittelt. Dies sind:
                      </p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Browsertyp und Browserversion</li>
                        <li>Verwendetes Betriebssystem</li>
                        <li>Referrer URL</li>
                        <li>Hostname des zugreifenden Rechners</li>
                        <li>Uhrzeit der Serveranfrage</li>
                        <li>IP-Adresse</li>
                      </ul>
                      <p className="mt-3">
                        Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen. Die Erfassung dieser 
                        Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-foreground text-lg mb-2">Kontaktformular</h3>
                      <p>
                        Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular 
                        inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall 
                        von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter. 
                        Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-foreground text-lg mb-2">Newsletter</h3>
                      <p>
                        Wenn Sie den auf der Website angebotenen Newsletter beziehen möchten, benötigen wir von Ihnen eine 
                        E-Mail-Adresse sowie Informationen, welche uns die Überprüfung gestatten, dass Sie der Inhaber der 
                        angegebenen E-Mail-Adresse sind und mit dem Empfang des Newsletters einverstanden sind. Weitere Daten 
                        werden nicht bzw. nur auf freiwilliger Basis erhoben. Die von Ihnen zum Zwecke des Newsletter-Bezugs 
                        bei uns hinterlegten Daten werden von uns bis zu Ihrer Austragung aus dem Newsletter bei uns gespeichert 
                        und nach der Abbestellung des Newsletters gelöscht. Die Datenverarbeitung erfolgt auf Grundlage von 
                        Art. 6 Abs. 1 lit. a DSGVO.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Cookies */}
            <ScrollReveal animation="fade-up" delay={300}>
              <Card className="glass-card">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Cookie className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold">3. Cookies</h2>
                  </div>
                  
                  <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
                    <p>
                      Unsere Internetseiten verwenden so genannte „Cookies". Cookies sind kleine Datenpakete und richten auf 
                      Ihrem Endgerät keinen Schaden an. Sie werden entweder vorübergehend für die Dauer einer Sitzung 
                      (Session-Cookies) oder dauerhaft (permanente Cookies) auf Ihrem Endgerät gespeichert.
                    </p>
                    <p>
                      Session-Cookies werden nach Ende Ihres Besuchs automatisch gelöscht. Permanente Cookies bleiben auf 
                      Ihrem Endgerät gespeichert, bis Sie diese selbst löschen oder eine automatische Löschung durch Ihren 
                      Webbrowser erfolgt.
                    </p>
                    <p>
                      Cookies, die zur Durchführung des elektronischen Kommunikationsvorgangs, zur Bereitstellung bestimmter, 
                      von Ihnen erwünschter Funktionen oder zur Optimierung der Website erforderlich sind (notwendige Cookies), 
                      werden auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO gespeichert.
                    </p>
                    <p>
                      Sie können Ihren Browser so einstellen, dass Sie über das Setzen von Cookies informiert werden und 
                      Cookies nur im Einzelfall erlauben, die Annahme von Cookies für bestimmte Fälle oder generell ausschließen 
                      sowie das automatische Löschen der Cookies beim Schließen des Browsers aktivieren.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Hosting */}
            <ScrollReveal animation="fade-up" delay={400}>
              <Card className="glass-card">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Server className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold">4. Hosting</h2>
                  </div>
                  
                  <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
                    <p>
                      Wir hosten die Inhalte unserer Website bei folgenden Anbietern:
                    </p>
                    <p>
                      Die personenbezogenen Daten, die auf dieser Website erfasst werden, werden auf den Servern des Hosters 
                      gespeichert. Hierbei kann es sich v. a. um IP-Adressen, Kontaktanfragen, Meta- und Kommunikationsdaten, 
                      Vertragsdaten, Kontaktdaten, Namen, Websitezugriffe und sonstige Daten, die über eine Website generiert 
                      werden, handeln.
                    </p>
                    <p>
                      Der Einsatz des Hosters erfolgt zum Zwecke der Vertragserfüllung gegenüber unseren potenziellen und 
                      bestehenden Kunden (Art. 6 Abs. 1 lit. b DSGVO) und im Interesse einer sicheren, schnellen und effizienten 
                      Bereitstellung unseres Online-Angebots durch einen professionellen Anbieter (Art. 6 Abs. 1 lit. f DSGVO).
                    </p>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Betroffenenrechte */}
            <ScrollReveal animation="fade-up" delay={500}>
              <Card className="glass-card">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Eye className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold">5. Ihre Rechte</h2>
                  </div>
                  
                  <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
                    <p>Sie haben gegenüber uns folgende Rechte hinsichtlich der Sie betreffenden personenbezogenen Daten:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li><strong>Recht auf Auskunft</strong> (Art. 15 DSGVO)</li>
                      <li><strong>Recht auf Berichtigung</strong> (Art. 16 DSGVO)</li>
                      <li><strong>Recht auf Löschung</strong> (Art. 17 DSGVO)</li>
                      <li><strong>Recht auf Einschränkung der Verarbeitung</strong> (Art. 18 DSGVO)</li>
                      <li><strong>Recht auf Datenübertragbarkeit</strong> (Art. 20 DSGVO)</li>
                      <li><strong>Widerspruchsrecht</strong> (Art. 21 DSGVO)</li>
                    </ul>
                    <p className="mt-4">
                      Sie haben zudem das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die Verarbeitung Ihrer 
                      personenbezogenen Daten durch uns zu beschweren.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* SSL/TLS */}
            <ScrollReveal animation="fade-up" delay={600}>
              <Card className="glass-card">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Lock className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold">6. SSL- bzw. TLS-Verschlüsselung</h2>
                  </div>
                  
                  <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
                    <p>
                      Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte, wie zum 
                      Beispiel Bestellungen oder Anfragen, die Sie an uns als Seitenbetreiber senden, eine SSL- bzw. 
                      TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers 
                      von „http://" auf „https://" wechselt und an dem Schloss-Symbol in Ihrer Browserzeile.
                    </p>
                    <p>
                      Wenn die SSL- bzw. TLS-Verschlüsselung aktiviert ist, können die Daten, die Sie an uns übermitteln, 
                      nicht von Dritten mitgelesen werden.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Widerruf */}
            <ScrollReveal animation="fade-up" delay={700}>
              <Card className="glass-card">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold">7. Widerruf Ihrer Einwilligung</h2>
                  </div>
                  
                  <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
                    <p>
                      Viele Datenverarbeitungsvorgänge sind nur mit Ihrer ausdrücklichen Einwilligung möglich. Sie können eine 
                      bereits erteilte Einwilligung jederzeit widerrufen. Die Rechtmäßigkeit der bis zum Widerruf erfolgten 
                      Datenverarbeitung bleibt vom Widerruf unberührt.
                    </p>
                    <p>
                      Sie können jederzeit gegen die Verarbeitung Ihrer personenbezogenen Daten Widerspruch einlegen. Eine 
                      formlose Mitteilung per E-Mail an uns reicht dafür aus.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Aktualität */}
            <ScrollReveal animation="fade-up" delay={800}>
              <Card className="glass-card bg-muted/50">
                <CardContent className="p-6 sm:p-8">
                  <p className="text-muted-foreground text-sm">
                    <strong>Stand:</strong> Dezember 2024
                  </p>
                  <p className="text-muted-foreground text-sm mt-2">
                    Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den aktuellen rechtlichen 
                    Anforderungen entspricht oder um Änderungen unserer Leistungen in der Datenschutzerklärung umzusetzen.
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </WebsiteLayout>
  );
};

export default Privacy;
