import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { CustomerReviewForm } from "@/components/CustomerReviewForm";
import { supabase } from "@/integrations/supabase/client";

export default function Review() {
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get("appointment");
  const email = searchParams.get("email");
  const name = searchParams.get("name");
  
  const [prefillData, setPrefillData] = useState<{
    customer_name: string;
    customer_email: string;
    company: string;
    service_type: string;
  } | null>(null);
  const [loading, setLoading] = useState(!!appointmentId);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (appointmentId) {
      loadAppointmentData();
    } else if (email || name) {
      setPrefillData({
        customer_name: decodeURIComponent(name || ''),
        customer_email: decodeURIComponent(email || ''),
        company: '',
        service_type: ''
      });
    }
  }, [appointmentId, email, name]);

  const loadAppointmentData = async () => {
    try {
      const { data: appointment, error } = await supabase
        .from('appointments')
        .select(`
          *,
          contact_requests (
            name,
            email,
            company,
            service_type
          )
        `)
        .eq('id', appointmentId)
        .single();

      if (!error && appointment?.contact_requests) {
        const cr = appointment.contact_requests;
        setPrefillData({
          customer_name: cr.name || '',
          customer_email: cr.email || '',
          company: cr.company || '',
          service_type: cr.service_type || ''
        });
      }
    } catch (err) {
      console.error('Error loading appointment:', err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
        <div className="max-w-md text-center space-y-6">
          <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold">Vielen Dank!</h1>
          <p className="text-muted-foreground">
            Ihre Bewertung wurde erfolgreich eingereicht. Wir schätzen Ihr Feedback sehr!
          </p>
          <a 
            href="/" 
            className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
          >
            Zur Startseite
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Ihre Meinung zählt!</h1>
          <p className="text-muted-foreground">
            Wir freuen uns über Ihr Feedback zu unserer Zusammenarbeit.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <CustomerReviewForm 
            prefillData={prefillData}
            onSuccess={() => setSubmitted(true)}
          />
        )}
      </div>
    </div>
  );
}
