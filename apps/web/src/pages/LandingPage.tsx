import React from 'react';
import { Navbar } from '../components/landing/Navbar';
import { HeroSection } from '../components/landing/HeroSection';
import { BenefitsStrip } from '../components/landing/BenefitsStrip';
import { FeatureCards } from '../components/landing/FeatureCards';
import { HowItWorks } from '../components/landing/HowItWorks';
import { CallToAction } from '../components/landing/CallToAction';
import { Footer } from '../components/landing/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#03120F] font-sans text-white selection:bg-[#20E875] selection:text-[#03120F]">
      <Navbar />
      <HeroSection />
      <BenefitsStrip />
      <FeatureCards />
      <HowItWorks />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default LandingPage;