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
import Renewals from "@/pages/dashboard/Renewals";
import CalendarSettings from "@/pages/dashboard/CalendarSettings";

export default function AdminRoutes() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/requests" element={<Requests />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/subscribers" element={<Subscribers />} />
        <Route path="/email-settings" element={<EmailSettings />} />
        <Route path="/email-marketing" element={<EmailMarketing />} />
        <Route path="/renewals" element={<Renewals />} />
        <Route path="/calendar-settings" element={<CalendarSettings />} />
      </Routes>
    </DashboardLayout>
  );
}