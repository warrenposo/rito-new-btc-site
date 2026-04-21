import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Mail, User, Lock, Phone, MapPin } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Footer } from "@/components/Footer";

const SignUp = () => {
  const navigate = useNavigate();
  const redirectedRef = useRef(false);
  const { signUp, user, profile, isAdmin, loading: authLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    country: "",
    agreeToTerms: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle automatic redirects after successful sign up
  // Wait for authLoading=false so profile (and thus isAdmin) is fully known
  useEffect(() => {
    if (authLoading) return;

    if (user && !redirectedRef.current) {
      redirectedRef.current = true;
      setIsLoading(false);
      navigate(isAdmin ? '/admin' : '/dashboard', { replace: true });
    } else if (!user && !authLoading) {
      redirectedRef.current = false;
    }
  }, [user, isAdmin, authLoading, navigate]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
    if (error) {
      setError(null);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (!formData.agreeToTerms) newErrors.agreeToTerms = "You must agree to the terms and conditions";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    try {
      const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim();
      const emailLower = formData.email.trim().toLowerCase();

      await signUp(emailLower, formData.password, fullName);

      // After signUp completes, get the current session directly and navigate
      // This bypasses the useEffect timing issue entirely
      const { data: { user: currentUser } } = await supabase.auth.getUser();

      if (currentUser) {
        // Save optional profile fields in background (non-blocking)
        const phoneValue = formData.phone.trim();
        const countryValue = formData.country.trim();
        if (phoneValue || countryValue) {
          supabase.from('profiles').update({
            ...(phoneValue ? { mobile: phoneValue } : {}),
            ...(countryValue ? { country: countryValue } : {}),
          }).eq('user_id', currentUser.id).then().catch(console.error);
        }

        // Navigate immediately — don't wait for profile
        const isAdminUser = currentUser.email?.toLowerCase() === 'warrenokumu98@gmail.com';
        setIsLoading(false);
        navigate(isAdminUser ? '/admin' : '/dashboard', { replace: true });
        return;
      }

      // Fallback: no user in session yet — let the useEffect handle it
      // (should not normally reach here)

    } catch (error: any) {
      console.error('Sign up error:', error);

      let errorMessage = 'Sign up failed. Please try again.';

      if (error.message) {
        if (error.message.includes('User already registered') || error.message.includes('already registered')) {
          errorMessage = 'An account with this email already exists. Please sign in instead.';
        } else if (error.message.includes('Password should be at least')) {
          errorMessage = 'Password must be at least 6 characters long.';
        } else if (error.message.includes('Invalid email')) {
          errorMessage = 'Please enter a valid email address.';
        } else if (
          error.message.toLowerCase().includes('email rate limit') ||
          error.message.toLowerCase().includes('rate limit') ||
          error.message.toLowerCase().includes('over_email_send_rate_limit')
        ) {
          errorMessage =
            'Too many sign-up attempts. Please wait a few minutes and try again, or ask the admin to disable email confirmation in Supabase settings.';
        } else {
          errorMessage = error.message;
        }
      }

      setError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#040a0f] flex flex-col">
      {/* Header Section */}
      <div className="relative h-32 bg-[#040a0f] border-b border-teal-500/10 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 circuit-bg opacity-50 pointer-events-none" />
        <div className="absolute inset-0 diagonal-lines pointer-events-none" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-4 left-10 w-16 h-16 rounded-full blur-2xl animate-pulse" style={{ background: "rgba(0,229,255,0.15)" }} />
          <div className="absolute top-8 right-20 w-12 h-12 rounded-full blur-2xl animate-pulse" style={{ background: "rgba(0,200,83,0.12)", animationDelay: "0.5s" }} />
          <div className="absolute bottom-4 left-1/4 w-20 h-20 rounded-full blur-3xl animate-pulse" style={{ background: "rgba(0,229,255,0.10)", animationDelay: "1s" }} />
        </div>
        <h1 className="text-4xl font-bold text-white relative z-10">Create Account</h1>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-[#040a0f] flex items-center justify-center p-4 sm:p-8">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12 items-center max-w-6xl">
          {/* Left Column - Illustration */}
          <div className="hidden lg:block relative h-full flex items-center justify-center">
            <div className="relative w-full max-w-md">
              {/* Room/Building Outline - Minimalist structure */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-32 h-32 border-2 border-white/30 rounded-lg"></div>
                <div className="absolute top-0 right-0 w-24 h-24 border-2 border-white/30 rounded-lg"></div>
                <div className="absolute bottom-0 left-1/4 w-40 h-32 border-2 border-white/30 rounded-lg"></div>
              </div>
              
              {/* Character Illustration */}
              <div className="relative z-10 flex items-end justify-center">
                {/* Person Character */}
                <div className="relative">
                  {/* Head */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-12 h-12 bg-white/30 rounded-full border-2 border-white/40"></div>
                  
                  {/* Body - Teal shirt with black polka dots */}
                  <div className="relative w-16 h-20 bg-teal-500 rounded-lg">
                    {/* Polka dots */}
                    <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-black rounded-full"></div>
                    <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-black rounded-full"></div>
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-black rounded-full"></div>
                    <div className="absolute top-6 left-3 w-1.5 h-1.5 bg-black rounded-full"></div>
                    <div className="absolute top-6 right-3 w-1.5 h-1.5 bg-black rounded-full"></div>
                  </div>
                  
                  {/* Pants */}
                  <div className="absolute top-20 left-1/2 -translate-x-1/2 w-12 h-12 bg-gray-600 rounded-b-lg"></div>
                  
                  {/* Shoes */}
                  <div className="absolute top-28 left-1/2 -translate-x-1/2 w-16 h-3 bg-teal-500 rounded"></div>
                  
                  {/* Mobile Device - Large phone/tablet */}
                  <div className="absolute top-4 left-full ml-4 w-28 h-40 bg-[#040a0f] rounded-xl border-2 border-white/30 p-3 shadow-xl">
                    <div className="text-white text-xs font-bold mb-2 text-center">Sign Up</div>
                    <div className="w-10 h-10 bg-teal-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <User className="h-5 w-5 text-black" />
                    </div>
                    <div className="space-y-2 mb-3">
                      <div className="h-2 bg-white/20 rounded w-full"></div>
                      <div className="h-2 bg-white/20 rounded w-full"></div>
                      <div className="h-2 bg-white/20 rounded w-full"></div>
                    </div>
                    <div className="flex items-center gap-1 mb-3 justify-center">
                      <div className="w-1 h-1 bg-white/30 rounded-full"></div>
                    </div>
                    <div className="h-5 bg-teal-500 rounded w-full"></div>
                  </div>
                </div>
                
                {/* Plant - Yellow potted plant */}
                <div className="absolute bottom-0 left-0">
                  <div className="relative">
                    {/* Pot */}
                    <div className="w-10 h-10 bg-teal-500 rounded-full"></div>
                    {/* Leaves */}
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-8 h-8 bg-emerald-400 rounded-full"></div>
                    <div className="absolute -top-4 -left-2 w-6 h-6 bg-emerald-400 rounded-full"></div>
                    <div className="absolute -top-6 right-0 w-6 h-6 bg-emerald-400 rounded-full"></div>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-5 h-5 bg-emerald-300 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sign Up Form */}
          <div className="w-full max-w-md mx-auto">
            <div className="bg-[#060d13] rounded-xl p-4 sm:p-8 border border-teal-500/15">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Create Your Account</h2>
              
              {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-md">
                  <p className="text-sm text-red-400">{error}</p>
                  {(error.includes('already exists') || error.includes('already registered')) && (
                    <Link to="/login" className="mt-2 block text-sm text-teal-400 hover:underline font-medium">
                      → Go to Sign In
                    </Link>
                  )}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-white/70">First Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className={`pl-10 bg-[#040a0f] text-white border-white/10 ${errors.firstName ? "border-red-500" : ""}`}
                      />
                    </div>
                    {errors.firstName && <p className="text-sm text-red-400 mt-1">{errors.firstName}</p>}
                  </div>
                  
                  <div>
                    <Label htmlFor="lastName" className="text-white/70">Last Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        className={`pl-10 bg-[#040a0f] text-white border-white/10 ${errors.lastName ? "border-red-500" : ""}`}
                      />
                    </div>
                    {errors.lastName && <p className="text-sm text-red-400 mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email" className="text-white/70">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={`pl-10 bg-[#040a0f] text-white border-white/10 ${errors.email ? "border-red-500" : ""}`}
                    />
                  </div>
                  {errors.email && <p className="text-sm text-red-400 mt-1">{errors.email}</p>}
                </div>

                {/* Phone - Optional */}
                <div>
                  <Label htmlFor="phone" className="text-white/70">Phone Number <span className="text-white/40 text-xs">(Optional)</span></Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 234 567 8900"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="pl-10 bg-[#040a0f] text-white border-white/10"
                    />
                  </div>
                </div>

                {/* Country - Optional */}
                <div>
                  <Label htmlFor="country" className="text-white/70">Country <span className="text-white/40 text-xs">(Optional)</span></Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                    <Input
                      id="country"
                      type="text"
                      placeholder="United States"
                      value={formData.country}
                      onChange={(e) => handleInputChange("country", e.target.value)}
                      className="pl-10 bg-[#040a0f] text-white border-white/10"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <Label htmlFor="password" className="text-white/70">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className={`pl-10 pr-10 bg-[#040a0f] text-white border-white/10 ${errors.password ? "border-red-500" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 h-4 w-4 text-white/40 hover:text-white/70"
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                  {errors.password && <p className="text-sm text-red-400 mt-1">{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div>
                  <Label htmlFor="confirmPassword" className="text-white/70">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className={`pl-10 pr-10 bg-[#040a0f] text-white border-white/10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 h-4 w-4 text-white/40 hover:text-white/70"
                    >
                      {showConfirmPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-sm text-red-400 mt-1">{errors.confirmPassword}</p>}
                </div>

                {/* Terms Agreement */}
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                    className={`mt-1 ${errors.agreeToTerms ? "border-red-500" : ""}`}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none text-white/70 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I agree to the{" "}
                      <Link to="/terms" className="text-teal-400 hover:underline">
                        Terms and Conditions
                      </Link>{" "}
                      and{" "}
                      <Link to="/privacy" className="text-teal-400 hover:underline">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>
                </div>
                {errors.agreeToTerms && <p className="text-sm text-red-400">{errors.agreeToTerms}</p>}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full font-semibold py-3 text-black border-0 hover:opacity-90 transition-opacity"
                  style={{ background: "linear-gradient(135deg, #00e5ff 0%, #00c853 100%)" }}
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>

              {/* Sign In Link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-white/50">
                  Already have an account?{" "}
                  <Link to="/login" className="text-teal-400 hover:underline font-medium">
                    Sign In
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SignUp;
