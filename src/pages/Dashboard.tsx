import { DashboardLayout } from "@/components/DashboardLayout";
import { Routes, Route } from "react-router-dom";
import Overview from "./dashboard/Overview";
import Requests from "./dashboard/Requests";
import Appointments from "./dashboard/Appointments";
import Calendar from "./dashboard/Calendar";
import Analytics from "./dashboard/Analytics";
import Subscribers from "./dashboard/Subscribers";
import EmailSettings from "./dashboard/EmailSettings";
import EmailMarketing from "./dashboard/EmailMarketing";
import Renewals from "./dashboard/Renewals";

export default function Dashboard() {
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
      </Routes>
    </DashboardLayout>
  );
}