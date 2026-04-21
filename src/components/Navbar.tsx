import { Button } from "@/components/ui/button";
import { Cloud, Bitcoin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

export const Navbar = () => {
  const { user, signOut, isAdmin, loading, session } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  // Only show Sign Out if we're not loading AND we have a verified user with a valid session
  const showSignOut = !loading && Boolean(user) && Boolean(session);

  const handleAuthAction = async () => {
    if (isProcessing) return;

    if (showSignOut) {
      try {
        setIsProcessing(true);
        await signOut();
        navigate("/");
      } finally {
        setIsProcessing(false);
      }
    } else {
      navigate("/login");
    }
  };

  const handleLogoClick = () => {
    if (showSignOut) {
      navigate(isAdmin ? "/admin" : "/dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050c18]/90 backdrop-blur-md border-b border-white/8">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleLogoClick}
            className="flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md px-1 group"
          >
            <div className="relative flex items-center justify-center w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg shadow-glow">
              <Bitcoin className="w-4 h-4 text-black" />
              <Cloud className="w-3 h-3 text-black/70 absolute -bottom-0.5 -right-0.5" />
            </div>
            <span className="text-xl font-black tracking-tight">
              <span className="text-white">Btc</span>
              <span className="text-gradient-gold">CloudBase</span>
            </span>
          </button>
          <Button
            size="sm"
            className="hover:scale-105 transition-transform bg-gradient-gold shadow-glow font-bold text-black rounded-lg px-5"
            onClick={handleAuthAction}
            disabled={isProcessing}
          >
            {showSignOut ? (isProcessing ? "Signing Out..." : "Sign Out") : "Sign In"}
          </Button>
        </div>
      </div>
    </nav>
  );
};
