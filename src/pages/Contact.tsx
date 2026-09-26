import React, { useState } from 'react';
import { Mail, MapPin, Send, CheckCircle2 } from 'lucide-react';

export const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: 'partner', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoLink = `mailto:gymtwiq@gmail.com?subject=GYMTwiq Inquiry: ${form.subject}&body=Name: ${form.name}%0D%0AEmail: ${form.email}%0D%0A%0D%0AMessage:%0D%0A${form.message}`;
    window.location.href = mailtoLink;
    setSubmitted(true);
  };

  return (
    <div className="space-y-16 py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="space-y-4 text-center">
        <div className="text-xs uppercase font-bold text-[#D4F447] tracking-widest">Get In Touch</div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">Contact GYMTwiq</h1>
        <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
          Interested in gym partnership, corporate memberships, or have a question for our team? We are here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div className="space-y-6">
          <div className="bg-[#161910] border border-[#272E1B] rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-white text-base">Direct Channels</h3>
            <div className="space-y-3 text-xs text-gray-300">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#D4F447]" />
                <a href="mailto:gymtwiq@gmail.com" className="hover:text-white">gymtwiq@gmail.com</a>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-[#D4F447]" />
                <span>Bengaluru & Mumbai, India</span>
              </div>
            </div>
          </div>

          <div className="bg-[#12140F] border border-[#272E1B] rounded-2xl p-6 space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Operating Hours</h4>
            <p className="text-xs text-gray-400">
              Support desk active Mon – Sat, 8:00 AM to 8:00 PM IST. Typical email response time is under 4 hours.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2 bg-[#161910] border border-[#272E1B] rounded-2xl p-8">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#D4F447]/10 text-[#D4F447] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Inquiry Received</h3>
              <p className="text-xs text-gray-400 max-w-md mx-auto">
                Thank you for reaching out. A GYMTwiq partnership representative will review your message and respond within one business day.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs text-[#D4F447] hover:underline pt-2 inline-block font-semibold"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Your Name</label>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full bg-[#0D0F0A] border border-[#272E1B] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#D4F447]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Email Address</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="e.g. rahul@example.com"
                    className="w-full bg-[#0D0F0A] border border-[#272E1B] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#D4F447]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Topic</label>
                <select
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full bg-[#0D0F0A] border border-[#272E1B] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#D4F447]"
                >
                  <option value="partner">Gym Facility Partnership</option>
                  <option value="member">Member Pass & App Support</option>
                  <option value="trainer">Trainer Onboarding Inquiry</option>
                  <option value="corporate">Corporate Network Plan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Message</label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us about your facility or how we can assist you..."
                  className="w-full bg-[#0D0F0A] border border-[#272E1B] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#D4F447]"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-[#D4F447] hover:bg-[#c2e236] text-black font-bold px-6 py-2.5 rounded-xl text-xs transition-colors shadow-md shadow-[#D4F447]/10"
              >
                <span>Submit Message</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
