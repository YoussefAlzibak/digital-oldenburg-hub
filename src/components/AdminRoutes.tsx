import { Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import Overview from "@/pages/dashboard/Overview";
import Requests from "@/pages/dashboard/Requests";
import Appointments from "@/pages/dashboard/Appointments";
import Calendar from "@/pages/dashboard/Calendar";
import Analytics from "@/pages/dashboard/Analytics";
import Subscribers from "@/pages/dashboard/Subscribers";
import EmailSettings from "@/pages/dashboard/EmailSettings";
import EmailMarketing from "@/pages/dashboard/EmailMarketing";
import Campaigns from "@/pages/dashboard/Campaigns";
import Renewals from "@/pages/dashboard/Renewals";
import CalendarSettings from "@/pages/dashboard/CalendarSettings";
import Automations from "@/pages/dashboard/Automations";
import Reviews from "@/pages/dashboard/Reviews";
import Templates from "@/pages/dashboard/Templates";
import WorkflowBuilder from "@/pages/dashboard/WorkflowBuilder";

export default function AdminRoutes() {
  return (
    <DashboardLayout>
      <Routes>
        {/* Dashboard Overview */}
        <Route path="/" element={<Overview />} />
        
        {/* Customer Management */}
        <Route path="/requests" element={<Requests />} />
        <Route path="/appointments" element={<Appointments />} />
        
        {/* Calendar & Scheduling */}
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/calendar-settings" element={<CalendarSettings />} />
        <Route path="/renewals" element={<Renewals />} />
        
        {/* Email Marketing */}
        <Route path="/subscribers" element={<Subscribers />} />
        <Route path="/email-marketing" element={<EmailMarketing />} />
        <Route path="/campaigns" element={<Campaigns />} />
        <Route path="/automations" element={<Automations />} />
        <Route path="/workflow-builder" element={<WorkflowBuilder />} />
        <Route path="/templates" element={<Templates />} />
        
        {/* Settings */}
        <Route path="/email-settings" element={<EmailSettings />} />
        
        {/* Reviews */}
        <Route path="/reviews" element={<Reviews />} />
        
        {/* Analytics */}
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </DashboardLayout>
  );
}
