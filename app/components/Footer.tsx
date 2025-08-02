


import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 md:gap-12">

          <div className="col-span-1 lg:col-span-2 text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
              Ready to Transform Your Institution's Operations?
            </h2>
            <p className="text-gray-400 mb-6 md:mb-8 text-sm md:text-base max-w-lg mx-auto lg:mx-0">
              Discover how ExamEase can revolutionize your examination workflow. Contact us today for a demo.
            </p>
            <Link 
              href="/demo" 
              className="inline-flex items-center px-6 py-3 rounded-full bg-white text-black hover:bg-gray-100 transition text-sm md:text-base"
            >
              Get Started →
            </Link>
          </div>

          <div className="col-span-1 text-center lg:text-left">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 md:space-y-3">
              <li>
                <Link 
                  href="/#features" 
                  className="text-gray-400 hover:text-white transition text-sm md:text-base"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link 
                  href="/#about" 
                  className="text-gray-400 hover:text-white transition text-sm md:text-base"
                >
                  Why Choose ExamEase?
                </Link>
              </li>
              <li>
                <Link 
                  href="/demo" 
                  className="text-gray-400 hover:text-white transition text-sm md:text-base"
                >
                  Request Demo
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1 text-center lg:text-left">
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 md:space-y-3 text-gray-400">
              <li className="text-sm md:text-base">
                <a 
                  href="mailto:support@examease.com" 
                  className="hover:text-white transition"
                >
                  support@examease.com
                </a>
              </li>
              <li className="text-sm md:text-base">
                <a 
                  href="tel:+917738305400" 
                  className="hover:text-white transition"
                >
                  +91-77383 05400
                </a>
              </li>
              <li className="text-sm md:text-base max-w-xs mx-auto lg:mx-0">
                Kasarvadawali, Thane, Maharashtra
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 md:mt-16 pt-6 md:pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm md:text-base text-center md:text-left">
              © 2024 ExamEase. All rights reserved.
            </p>
            <div className="flex gap-6 md:gap-4">
              <Link 
                href="/privacy" 
                className="text-gray-400 hover:text-white transition text-sm md:text-base"
              >
                Privacy
              </Link>
              <Link 
                href="/terms" 
                className="text-gray-400 hover:text-white transition text-sm md:text-base"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}