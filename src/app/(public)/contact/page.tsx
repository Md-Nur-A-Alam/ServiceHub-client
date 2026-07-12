"use client";

import { useState } from "react";
import { Container } from "@/components/layout/Container";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { toast } from "react-toastify";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
      toast.error("Please fill in all fields.");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success("Message sent! We will get back to you shortly.");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="bg-background min-h-screen py-12">
      <Container className="space-y-12">
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <h1 className="text-3xl lg:text-4xl font-extrabold text-on-surface font-display">Get In Touch</h1>
          <p className="text-sm text-on-surface/65">
            Have questions about our platform or need support with a booking? Drop us a line.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Contact Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-surface border border-outline-variant rounded-2xl p-6 space-y-6 shadow-xs">
              <h3 className="font-bold text-lg text-on-surface font-display">Contact Information</h3>

              <div className="space-y-4 text-sm text-on-surface/80">
                <div className="flex gap-3">
                  <Mail className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-on-surface block">Email Support</span>
                    <a href="mailto:support@servicehub.com" className="hover:text-primary transition-colors text-xs">
                      support@servicehub.com
                    </a>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Phone className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-on-surface block">Phone Hotline</span>
                    <a href="tel:+15550199" className="hover:text-primary transition-colors text-xs">
                      +1 (555) 0199
                    </a>
                  </div>
                </div>

                <div className="flex gap-3">
                  <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-on-surface block">Headquarters</span>
                    <span className="text-xs">100 Pine Street, San Francisco, CA 94111</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-on-surface block">Business Hours</span>
                    <span className="text-xs">Monday – Friday: 9:00 AM – 6:00 PM EST</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stylized Mock Map */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-outline-variant bg-surface-container flex flex-col items-center justify-center p-6 text-center">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2 animate-bounce">
                <MapPin className="w-6 h-6 fill-primary" />
              </div>
              <span className="font-bold text-xs text-on-surface">San Francisco Corporate HQ</span>
              <span className="text-[10px] text-on-surface/50 mt-1">100 Pine Street Suite 2400</span>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="bg-surface border border-outline-variant rounded-2xl p-6 space-y-4 shadow-xs">
              <h3 className="font-bold text-lg text-on-surface font-display">Send a Message</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contact-name" className="text-xs font-semibold text-on-surface/70">Your Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-outline-variant bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contact-email" className="text-xs font-semibold text-on-surface/70">Email Address</label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-outline-variant bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="contact-subject" className="text-xs font-semibold text-on-surface/70">Subject</label>
                <input
                  id="contact-subject"
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="How can we help you?"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-outline-variant bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="contact-message" className="text-xs font-semibold text-on-surface/70">Message</label>
                <textarea
                  id="contact-message"
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message details here..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-outline-variant bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary h-36 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-primary text-on-primary font-semibold rounded-xl hover:brightness-110 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
              </button>
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
}
