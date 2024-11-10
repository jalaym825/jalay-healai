import React from 'react';
import { Heart, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 font-dm-sans text-white py-8">
      <div className="max-w-5xl mx-auto px-4 mb-6">
        <div className="bg-teal-600 rounded-lg p-3 flex justify-center items-center gap-3">
          <Phone className="h-5 w-5 text-white animate-pulse" />
          <span className="font-semibold">24/7 Emergency: 1-800-HEALTH</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
              <Heart className="h-6 w-6 text-teal-500" />
              <span className="text-xl font-bold text-white">HealthCare Plus</span>
            </div>
            <p className="text-sm text-gray-400">
              Bringing quality healthcare to your digital doorstep
            </p>
          </div>

          <div className="text-center md:text-left">
            <h3 className="font-semibold text-white mb-3">Quick Access</h3>
            <div className="space-y-2 text-sm">
              <div><a href="#" className="text-gray-400 hover:text-teal-500 transition-colors">Virtual Consultation</a></div>
              <div><a href="#" className="text-gray-400 hover:text-teal-500 transition-colors">Find a Specialist</a></div>
              <div><a href="#" className="text-gray-400 hover:text-teal-500 transition-colors">Patient Portal</a></div>
            </div>
          </div>

          {/* Contact */}
          <div className="text-center md:text-left">
            <h3 className="font-semibold text-white mb-3">Contact Us</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Mail className="h-4 w-4 text-teal-500" />
                <span className="text-gray-400">help@healthcareplus.com</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <MapPin className="h-4 w-4 text-teal-500" />
                <span className="text-gray-400">123 Digital Lane, Web City</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>© {new Date().getFullYear()} VirtualCare. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-teal-500 transition-colors">Privacy</a>
              <a href="#" className="hover:text-teal-500 transition-colors">Terms</a>
              <a href="#" className="hover:text-teal-500 transition-colors">Support</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;