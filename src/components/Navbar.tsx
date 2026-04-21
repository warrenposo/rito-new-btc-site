import { Button } from "@/components/ui/button";
import { Cpu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

export const Navbar = () => {
  const { user, signOut, isAdmin, loading, session } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#040a0f]/95 backdrop-blur-md border-b border-teal-500/10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleLogoClick}
            className="flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 rounded-md px-1 group"
          >
            <div
              className="relative flex items-center justify-center w-9 h-9 rounded-xl shadow-lg"
              style={{ background: "linear-gradient(135deg, #00e5ff 0%, #00c853 100%)" }}
            >
              <Cpu className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-black tracking-tight">
              <span className="text-white">Btc</span>
              <span className="text-gradient-teal">NminingBase</span>
            </span>
          </button>
          <Button
            size="sm"
            className="hover:scale-105 transition-transform font-bold text-black rounded-lg px-5 border-0"
            style={{ background: "linear-gradient(135deg, #00e5ff 0%, #00c853 100%)" }}
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
