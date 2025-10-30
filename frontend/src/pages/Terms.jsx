import { Link } from 'react-router-dom';
import { ArrowLeft, FileCheck, Scale, AlertCircle, UserCheck, ScrollText } from 'lucide-react';
import { useEffect } from 'react';

const Terms = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Header */}
      <section className="relative bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white opacity-10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-300 opacity-10 rounded-full blur-3xl animate-pulse"></div>
        </div>
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-white hover:text-pink-200 mb-8 transition-all duration-300 group hover:scale-110 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold">Back to Home</span>
          </Link>
          <div className="flex items-center justify-center gap-4 mb-6">
            <Scale className="w-16 h-16 text-pink-300" />
          </div>
          <h1 className="text-6xl font-extrabold mb-4 text-center">Terms of Service</h1>
          <p className="text-xl text-purple-100 text-center">Last updated: October 30, 2025</p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-l-8 border-purple-600 p-8 rounded-2xl mb-12 shadow-lg">
          <p className="text-gray-800 leading-relaxed text-lg font-medium">
            Please read these Terms of Service carefully before using the uniServe platform. 
            By accessing or using our services, you agree to be bound by these terms.
          </p>
        </div>

        <div className="space-y-10">
          <section className="group">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-gradient-to-br from-violet-500 to-purple-600 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                <FileCheck className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                1. Acceptance of Terms
              </h2>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border-2 border-transparent hover:border-purple-200">
              <p className="text-gray-700 leading-relaxed text-lg">
                By creating an account or using uniServe services, you agree to comply with and be bound by these 
                Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our services.
              </p>
            </div>
          </section>

          <section className="group">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                <UserCheck className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                2. Use of Services
              </h2>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border-2 border-transparent hover:border-blue-200">
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Eligibility</h3>
              <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                You must be at least 18 years old to use our services. By using uniServe, you represent and warrant 
                that you meet this requirement.
              </p>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Account Registration</h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                You are responsible for maintaining the confidentiality of your account credentials and for all 
                activities that occur under your account.
              </p>
            </div>
          </section>

          <section className="group">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                <ScrollText className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                3. Service Availability
              </h2>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border-2 border-transparent hover:border-green-200">
              <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                uniServe provides a platform connecting users with third-party service providers. We do not:
              </p>
              <ul className="space-y-3 text-gray-700 text-lg">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 text-2xl">•</span>
                  <span>Employ drivers, restaurant staff, or other service providers</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 text-2xl">•</span>
                  <span>Guarantee the availability of services at all times</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 text-2xl">•</span>
                  <span>Control the quality of services provided by third parties</span>
                </li>
              </ul>
            </div>
          </section>

          <section className="group">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                <AlertCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                4. Payment Terms
              </h2>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border-2 border-transparent hover:border-orange-200">
              <p className="text-gray-700 mb-6 leading-relaxed text-lg">Payment obligations include:</p>
              <ul className="space-y-3 text-gray-700 text-lg">
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 text-2xl">•</span>
                  <span>You agree to pay all fees for services booked through our platform</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 text-2xl">•</span>
                  <span>Prices are subject to change with notice</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 text-2xl">•</span>
                  <span>Payment methods must be valid and authorized</span>
                </li>
              </ul>
            </div>
          </section>

          <section className="group">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-gradient-to-br from-pink-500 to-rose-600 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                <Scale className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                5. Contact Information
              </h2>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-10 shadow-xl border-2 border-purple-200">
              <p className="text-gray-700 mb-6 leading-relaxed text-lg font-medium">
                For questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-4 text-gray-800 text-lg">
                <p className="flex items-center gap-3">
                  <span className="font-bold text-purple-600">Email:</span>
                  <a href="mailto:aryasbhattacharyya2002@gmail.com" className="hover:text-purple-600 transition-colors">
                    aryasbhattacharyya2002@gmail.com
                  </a>
                </p>
                <p className="flex items-center gap-3">
                  <span className="font-bold text-green-600">Phone:</span>
                  <a href="tel:+917003888896" className="hover:text-green-600 transition-colors">
                    +91 7003888896
                  </a>
                </p>
                <p className="flex items-start gap-3">
                  <span className="font-bold text-pink-600">Address:</span>
                  <span>KP - 6, School of Computer Engineering, KIIT University</span>
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;