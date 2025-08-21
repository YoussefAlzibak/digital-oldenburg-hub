import AdminDashboard from "@/components/AdminDashboard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Users, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="bg-background border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Zurück zur Website
            </Button>
            <div className="h-6 w-px bg-border" />
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-semibold">Admin Panel</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Verwaltung</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span>Dashboard</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <AdminDashboard />
      </main>
    </div>
  );
}