import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mail, MapPin, Award, Settings, LogOut } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();

  const user = {
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    location: "San Francisco, CA",
    memberSince: "Jan 2025",
    rank: "Community Hero",
    level: 5
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/home")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Profile</h1>
            <p className="text-xs text-muted-foreground">Manage your account</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-4">
        {/* Profile Card */}
        <Card className="border-l-4 border-l-primary animate-fade-in">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Avatar className="w-20 h-20 border-4 border-primary/20">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-foreground">{user.name}</h2>
                <p className="text-muted-foreground flex items-center gap-1 mt-1">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </p>
                <p className="text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="w-4 h-4" />
                  {user.location}
                </p>
                <div className="flex gap-2 mt-3">
                  <Badge className="bg-primary text-primary-foreground">
                    <Award className="w-3 h-3 mr-1" />
                    {user.rank}
                  </Badge>
                  <Badge variant="outline">Level {user.level}</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 animate-slide-up">
          <Card>
            <CardContent className="pt-4 pb-3 text-center">
              <div className="text-2xl font-bold text-primary">12</div>
              <div className="text-xs text-muted-foreground">Jobs Done</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3 text-center">
              <div className="text-2xl font-bold text-accent">$340</div>
              <div className="text-xs text-muted-foreground">Earned</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3 text-center">
              <div className="text-2xl font-bold text-foreground">87</div>
              <div className="text-xs text-muted-foreground">Impact</div>
            </CardContent>
          </Card>
        </div>

        {/* Account Info */}
        <Card className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <CardHeader>
            <CardTitle className="text-base">Account Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Member Since</span>
              <span className="font-medium text-foreground">{user.memberSince}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Account Status</span>
              <Badge className="bg-primary/10 text-primary">Active</Badge>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Verification</span>
              <Badge className="bg-primary/10 text-primary">Verified</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="space-y-2 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => {}}
          >
            <Settings className="w-4 h-4 mr-3" />
            Settings
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start text-destructive hover:text-destructive"
            onClick={() => navigate("/")}
          >
            <LogOut className="w-4 h-4 mr-3" />
            Log Out
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Profile;
