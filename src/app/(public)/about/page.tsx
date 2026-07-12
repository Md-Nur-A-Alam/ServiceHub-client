"use client";

import { Container } from "@/components/layout/Container";
import { Award, Compass, Heart, Users } from "lucide-react";

const teamMembers = [
  {
    name: "Marcus Vance",
    role: "CEO & Co-Founder",
    bio: "Marcus has over 15 years of experience scaling local service marketplaces and is passionate about community growth.",
    initials: "MV",
  },
  {
    name: "Sophia Patel",
    role: "CTO & Co-Founder",
    bio: "Sophia is an expert in distributed systems and real-time networking. She leads the ServiceHub engineering team.",
    initials: "SP",
  },
  {
    name: "Liam Sinclair",
    role: "Head of Product",
    bio: "Liam ensures our booking and review systems remain transparent, secure, and user-friendly for all members.",
    initials: "LS",
  },
  {
    name: "Clara Montgomery",
    role: "Lead UI Designer",
    bio: "Clara crafted the premium design and fluid interactions of ServiceHub, focusing on maximum accessibility.",
    initials: "CM",
  },
];

const values = [
  {
    title: "Transparency First",
    desc: "Every review represents a verified booking, ensuring trust between providers and customers.",
    icon: Award,
  },
  {
    title: "Community Driven",
    desc: "We empower independent local providers to grow their businesses and connect directly with neighbors.",
    icon: Users,
  },
  {
    title: "Seamless Experience",
    desc: "We build intuitive booking dashboards and real-time channels, eliminating all friction.",
    icon: Compass,
  },
];

export default function AboutPage() {
  return (
    <div className="bg-background min-h-screen py-12 space-y-16">
      <Container className="space-y-6 text-center max-w-3xl">
        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
          Our Story
        </span>
        <h1 className="text-4xl lg:text-5xl font-black text-on-surface font-display leading-tight">
          Redefining Local Service Bookings
        </h1>
        <p className="text-base text-on-surface/70 leading-relaxed">
          Founded in 2024, ServiceHub was created to bridge the gap between skilled service professionals and local customers. We believe booking home, tutoring, or technical services should be as instant as reserving a ride or ordering food.
        </p>
      </Container>

      {/* Mission & Values */}
      <div className="bg-surface-container/30 py-16 border-t border-b border-outline-variant">
        <Container className="space-y-12">
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-on-surface font-display">Driven By Our Core Values</h2>
            <p className="text-xs text-on-surface/50">These principles guide our product roadmap and community standards.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="bg-surface border border-outline-variant rounded-2xl p-6 flex flex-col gap-3 shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-on-surface text-base">{v.title}</h3>
                  <p className="text-xs text-on-surface/75 leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </div>

      {/* Team Section */}
      <Container className="space-y-12">
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <h2 className="text-2xl font-bold text-on-surface font-display">Meet the Innovators</h2>
          <p className="text-xs text-on-surface/50">The dedicated professionals behind the ServiceHub platform.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="bg-surface border border-outline-variant rounded-2xl p-5 shadow-xs flex flex-col gap-4 text-center items-center"
            >
              <div className="w-16 h-16 rounded-full bg-secondary/15 text-secondary font-black text-lg flex items-center justify-center">
                {member.initials}
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-on-surface">{member.name}</h3>
                <span className="text-[10px] font-bold text-primary uppercase tracking-wide block">{member.role}</span>
              </div>
              <p className="text-xs text-on-surface/65 leading-relaxed">{member.bio}</p>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
