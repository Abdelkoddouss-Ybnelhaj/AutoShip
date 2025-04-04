"use client";
import { useAuth } from "../hooks/useAuth";
import { Navbar } from "@/components/features/landing/navbar";
import { HeroSection } from "@/components/features/landing/hero-section";
import { LogosSection } from "@/components/features/landing/logos-section";
import { FeaturesSection } from "@/components/features/landing/features-section";
import { HowItWorksSection } from "@/components/features/landing/how-it-works";
import { PricingSection } from "@/components/features/landing/pricing-section";
import { TestimonialsSection } from "@/components/features/landing/testimonials-section";
import { FAQSection } from "@/components/features/landing/faq-section";
import { CTASection } from "@/components/features/landing/cta-section";
import { Footer } from "@/components/features/landing/footer";

export default function LandingPage() {
  const { login, isLoading } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <Navbar login={login} isLoading={isLoading} />
      <HeroSection login={login} isLoading={isLoading} />
      <LogosSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection login={login} isLoading={isLoading} />
      <Footer />
    </div>
  );
}
