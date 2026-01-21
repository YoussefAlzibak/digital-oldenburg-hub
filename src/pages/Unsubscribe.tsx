import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle, XCircle, Loader2, Mail, ArrowLeft, MessageSquare, Trash2, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Footer } from '@/components/Footer';

export default function Unsubscribe() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'confirm' | 'success' | 'error' | 'invalid'>('loading');
  const [email, setEmail] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackReason, setFeedbackReason] = useState<string>('');
  const [feedbackComment, setFeedbackComment] = useState<string>('');
  const [deleteData, setDeleteData] = useState(false);
  const [actionType, setActionType] = useState<'unsubscribe' | 'delete'>('unsubscribe');
  const { toast } = useToast();

  const token = searchParams.get('token');
  const emailParam = searchParams.get('email');
  const actionParam = searchParams.get('action');

  useEffect(() => {
    if (!token && !emailParam) {
      setStatus('invalid');
      return;
    }

    // Check if delete action is requested
    if (actionParam === 'delete') {
      setDeleteData(true);
      setActionType('delete');
    }

    if (emailParam) {
      try {
        const decodedEmail = atob(emailParam);
        setEmail(decodedEmail);
        setStatus('confirm');
      } catch {
        setStatus('invalid');
      }
    } else if (token) {
      try {
        const decodedEmail = atob(token);
        setEmail(decodedEmail);
        setStatus('confirm');
      } catch {
        setStatus('invalid');
      }
    }
  }, [token, emailParam, actionParam]);

  const handleUnsubscribe = async () => {
    if (!email) {
      setStatus('invalid');
      return;
    }

    setIsProcessing(true);

    try {
      const { data: subscriber, error: fetchError } = await supabase
        .from('email_subscribers')
        .select('id, first_name')
        .eq('email', email)
        .single();

      if (fetchError || !subscriber) {
        throw new Error('Abonnent nicht gefunden');
      }

      if (deleteData) {
        // Delete all data related to this subscriber
        // First delete from email_list_subscribers
        await supabase
          .from('email_list_subscribers')
          .delete()
          .eq('subscriber_id', subscriber.id);

        // Delete from email_queue
        await supabase
          .from('email_queue')
          .delete()
          .eq('subscriber_id', subscriber.id);

        // Delete from email_events
        await supabase
          .from('email_events')
          .delete()
          .eq('subscriber_id', subscriber.id);

        // Finally delete the subscriber
        const { error: deleteError } = await supabase
          .from('email_subscribers')
          .delete()
          .eq('id', subscriber.id);

        if (deleteError) throw deleteError;

        // Send confirmation email
        try {
          await supabase.functions.invoke('send-smtp-email', {
            body: {
              emailData: {
                to: email,
                subject: 'Ihre Daten wurden gelöscht - Unicum Tech',
                html: `<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"></head>
<body style="margin: 0; padding: 0; background-color: #f4f4f7; font-family: 'Segoe UI', sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f7;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden;">
          <tr>
            <td style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); padding: 40px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 800;">
                <span style="color: #4ecdc4;">Unicum</span><span style="color: #ffffff;">Tech</span>
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px 0; color: #1e3a5f;">Datenlöschung bestätigt</h2>
              <p style="color: #4a5568; font-size: 16px; line-height: 1.7;">
                Wie von Ihnen gewünscht, wurden alle Ihre personenbezogenen Daten aus unserem System vollständig gelöscht.
              </p>
              <p style="color: #4a5568; font-size: 16px; line-height: 1.7; margin-top: 20px;">
                Dies umfasst:
              </p>
              <ul style="color: #4a5568; font-size: 16px; line-height: 1.7;">
                <li>Ihre E-Mail-Adresse</li>
                <li>Alle persönlichen Informationen</li>
                <li>Ihr Newsletter-Abonnement</li>
                <li>Zugehörige Ereignisdaten</li>
              </ul>
              <p style="margin: 30px 0 0 0; color: #1e3a5f;">
                Mit freundlichen Grüßen,<br><strong>Das Unicum Tech Team</strong>
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #1e3a5f; padding: 20px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #8ec5fc;">
                © ${new Date().getFullYear()} Unicum Tech. Alle Rechte vorbehalten.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
              }
            }
          });
        } catch (emailErr) {
          console.error('Error sending deletion confirmation:', emailErr);
        }

      } else {
        // Just unsubscribe
        const { error: updateError } = await supabase
          .from('email_subscribers')
          .update({ 
            status: 'unsubscribed',
            updated_at: new Date().toISOString()
          })
          .eq('id', subscriber.id);

        if (updateError) throw updateError;

        await supabase
          .from('email_events')
          .insert({
            subscriber_id: subscriber.id,
            event_type: 'unsubscribed',
            event_data: { 
              reason: feedbackReason || 'not_provided',
              comment: feedbackComment || null,
              unsubscribed_at: new Date().toISOString()
            }
          });

        try {
          await supabase.functions.invoke('send-smtp-email', {
            body: {
              emailData: {
                to: email,
                subject: 'Abmeldung bestätigt - Unicum Tech',
                html: `<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"></head>
<body style="margin: 0; padding: 0; background-color: #f4f4f7; font-family: 'Segoe UI', sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f7;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden;">
          <tr>
            <td style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); padding: 40px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 800;">
                <span style="color: #4ecdc4;">Unicum</span><span style="color: #ffffff;">Tech</span>
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px 0; color: #1e3a5f;">Abmeldung bestätigt</h2>
              <p style="color: #4a5568; font-size: 16px; line-height: 1.7;">
                Ihre Abmeldung von unserem Newsletter wurde erfolgreich verarbeitet. 
                Sie werden keine weiteren Marketing-E-Mails von uns erhalten.
              </p>
              <p style="color: #4a5568; font-size: 16px; line-height: 1.7; margin-top: 20px;">
                Falls Sie Ihre Meinung ändern, können Sie sich jederzeit wieder anmelden.
              </p>
              <p style="color: #4a5568; font-size: 16px; line-height: 1.7; margin-top: 20px;">
                <strong>Hinweis:</strong> Möchten Sie auch Ihre Daten löschen lassen? 
                <a href="https://digital-oldenburg-hub.onrender.com/unsubscribe?email=${btoa(email)}&action=delete" style="color: #4ecdc4;">Hier klicken</a>
              </p>
              <p style="margin: 30px 0 0 0; color: #1e3a5f;">
                Mit freundlichen Grüßen,<br><strong>Das Unicum Tech Team</strong>
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #1e3a5f; padding: 20px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #8ec5fc;">
                © ${new Date().getFullYear()} Unicum Tech. Alle Rechte vorbehalten.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
              }
            }
          });
        } catch (emailErr) {
          console.error('Error sending unsubscribe confirmation:', emailErr);
        }
      }

      setStatus('success');
      if (!deleteData) {
        setShowFeedback(true);
      }

      toast({
        title: deleteData ? "Daten gelöscht" : "Erfolgreich abgemeldet",
        description: deleteData 
          ? "Alle Ihre Daten wurden vollständig gelöscht." 
          : "Sie wurden von unserem Newsletter abgemeldet.",
      });

    } catch (error: unknown) {
      console.error('Unsubscribe error:', error);
      setStatus('error');
      const errorMessage = error instanceof Error ? error.message : "Ein Fehler ist aufgetreten.";
      toast({
        title: "Fehler",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!feedbackReason && !feedbackComment) return;

    try {
      const { data: subscriber } = await supabase
        .from('email_subscribers')
        .select('id')
        .eq('email', email)
        .single();

      if (subscriber) {
        await supabase
          .from('email_events')
          .insert({
            subscriber_id: subscriber.id,
            event_type: 'unsubscribe_feedback',
            event_data: { 
              reason: feedbackReason,
              comment: feedbackComment
            }
          });
      }

      toast({
        title: "Vielen Dank!",
        description: "Ihr Feedback hilft uns, besser zu werden.",
      });

      setShowFeedback(false);
    } catch (error) {
      console.error('Feedback error:', error);
    }
  };

  const feedbackReasons = [
    { value: 'too_many', label: 'Zu viele E-Mails' },
    { value: 'not_relevant', label: 'Inhalte nicht relevant' },
    { value: 'never_signed_up', label: 'Nie angemeldet' },
    { value: 'changed_email', label: 'E-Mail-Adresse gewechselt' },
    { value: 'other', label: 'Sonstiges' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          {status === 'loading' && (
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Wird verarbeitet...</p>
            </CardContent>
          )}

          {status === 'invalid' && (
            <>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
                  <XCircle className="w-8 h-8 text-destructive" />
                </div>
                <CardTitle>Ungültiger Link</CardTitle>
                <CardDescription>
                  Der Abmelde-Link ist ungültig oder abgelaufen.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button asChild>
                  <Link to="/">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Zur Startseite
                  </Link>
                </Button>
              </CardContent>
            </>
          )}

          {status === 'confirm' && (
            <>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center">
                  {actionType === 'delete' ? (
                    <Trash2 className="w-8 h-8 text-orange-500" />
                  ) : (
                    <Mail className="w-8 h-8 text-orange-500" />
                  )}
                </div>
                <CardTitle>
                  {actionType === 'delete' ? 'Daten löschen' : 'Newsletter abmelden'}
                </CardTitle>
                <CardDescription>
                  {actionType === 'delete' 
                    ? 'Möchten Sie wirklich alle Ihre Daten löschen lassen?' 
                    : 'Möchten Sie sich wirklich von unserem Newsletter abmelden?'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">E-Mail-Adresse:</p>
                  <p className="font-medium">{email}</p>
                </div>

                {actionType !== 'delete' && (
                  <div className="flex items-start space-x-3 p-4 border rounded-lg bg-muted/50">
                    <Checkbox 
                      id="delete-data" 
                      checked={deleteData}
                      onCheckedChange={(checked) => setDeleteData(checked === true)}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="delete-data" className="cursor-pointer font-medium">
                        Meine Daten vollständig löschen
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Löscht alle Ihre gespeicherten Daten unwiderruflich (gemäß DSGVO)
                      </p>
                    </div>
                  </div>
                )}

                {(deleteData || actionType === 'delete') && (
                  <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-destructive">Achtung: Unwiderruflich</p>
                        <p className="text-muted-foreground mt-1">
                          Alle Ihre Daten werden permanent gelöscht und können nicht wiederhergestellt werden.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex flex-col gap-3">
                  <Button 
                    onClick={handleUnsubscribe}
                    disabled={isProcessing}
                    variant="destructive"
                    className="w-full"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Wird verarbeitet...
                      </>
                    ) : (deleteData || actionType === 'delete') ? (
                      <>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Ja, alle Daten löschen
                      </>
                    ) : (
                      'Ja, abmelden'
                    )}
                  </Button>
                  
                  <Button asChild variant="outline">
                    <Link to="/">
                      Abbrechen
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </>
          )}

          {status === 'success' && (
            <>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <CardTitle>
                  {deleteData ? 'Daten gelöscht' : 'Erfolgreich abgemeldet'}
                </CardTitle>
                <CardDescription>
                  {deleteData 
                    ? 'Alle Ihre Daten wurden vollständig aus unserem System gelöscht.'
                    : 'Sie wurden von unserem Newsletter abgemeldet und erhalten keine weiteren E-Mails mehr.'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {showFeedback && !deleteData && (
                  <div className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold">Feedback (optional)</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Helfen Sie uns, besser zu werden. Warum haben Sie sich abgemeldet?
                    </p>
                    
                    <RadioGroup value={feedbackReason} onValueChange={setFeedbackReason}>
                      {feedbackReasons.map((reason) => (
                        <div key={reason.value} className="flex items-center space-x-2">
                          <RadioGroupItem value={reason.value} id={reason.value} />
                          <Label htmlFor={reason.value} className="cursor-pointer">
                            {reason.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                    
                    <div className="space-y-2">
                      <Label htmlFor="comment">Zusätzliche Anmerkungen</Label>
                      <Textarea
                        id="comment"
                        placeholder="Ihre Anmerkungen..."
                        value={feedbackComment}
                        onChange={(e) => setFeedbackComment(e.target.value)}
                        rows={3}
                      />
                    </div>
                    
                    <Button onClick={handleSubmitFeedback} variant="outline" className="w-full">
                      Feedback senden
                    </Button>
                  </div>
                )}
                
                <Button asChild className="w-full">
                  <Link to="/">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Zur Startseite
                  </Link>
                </Button>
              </CardContent>
            </>
          )}

          {status === 'error' && (
            <>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
                  <XCircle className="w-8 h-8 text-destructive" />
                </div>
                <CardTitle>Fehler aufgetreten</CardTitle>
                <CardDescription>
                  Bei der Verarbeitung ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <Button onClick={() => setStatus('confirm')}>
                  Erneut versuchen
                </Button>
                <Button asChild variant="outline">
                  <Link to="/contact">
                    Kontakt aufnehmen
                  </Link>
                </Button>
              </CardContent>
            </>
          )}
        </Card>
      </div>
      <Footer />
    </div>
  );
}