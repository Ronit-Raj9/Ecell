import React from 'react';
import TeamHero from '@/components/team/TeamHero';
import TeamSection from '@/components/team/TeamSection';

export const metadata = {
  title: 'Our Team | E-Cell',
  description: 'Meet the dedicated team behind E-Cell - our executives and student members from all years',
};

export default function TeamPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <TeamHero />
      
      <div className="space-y-20 mt-16">
        <TeamSection 
          title="Executive Team" 
          subtitle="Meet our leadership team driving E-Cell's vision forward"
          members={[]} // Will be populated from a backend API or CMS
          yearFilter="executive" // Custom filter to show only executives
        />
        
        <TeamSection 
          title="1st Year Members" 
          subtitle="Our newest members bringing fresh perspectives"
          members={[]} 
          yearFilter="first" // Custom filter to show only first years
        />
      </div>
    </div>
  );
} 