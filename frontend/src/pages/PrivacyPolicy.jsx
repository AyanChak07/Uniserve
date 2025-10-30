import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, Bell, FileText } from 'lucide-react';
import { useEffect } from 'react';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Header */}
      <section className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-72 h-72 bg-white opacity-10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-cyan-300 opacity-10 rounded-full blur-3xl animate-pulse"></div>
        </div>
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-white hover:text-cyan-200 mb-8 transition-all duration-300 group hover:scale-110 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold">Back to Home</span>
          </Link>
          <div className="flex items-center justify-center gap-4 mb-6">
            <Shield className="w-16 h-16 text-cyan-300" />
          </div>
          <h1 className="text-6xl font-extrabold mb-4 text-center">Privacy Policy</h1>
          <p className="text-xl text-blue-100 text-center">Last updated: October 30, 2025</p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-8 border-blue-600 p-8 rounded-2xl mb-12 shadow-lg">
          <p className="text-gray-800 leading-relaxed text-lg font-medium">
            At uniServe, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, 
            and safeguard your information when you use our platform.
          </p>
        </div>

        <div className="space-y-10">
          <section className="group">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                1. Information We Collect
              </h2>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border-2 border-transparent hover:border-blue-200">
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Personal Information</h3>
              <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                We collect information that you provide directly to us, including:
              </p>
              <ul className="space-y-3 text-gray-700 text-lg">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 text-2xl">•</span>
                  <span>Name, email address, and phone number</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 text-2xl">•</span>
                  <span>Payment information and billing address</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 text-2xl">•</span>
                  <span>Profile information and preferences</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 text-2xl">•</span>
                  <span>Location data when you use our services</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 text-2xl">•</span>
                  <span>Communication history with our support team</span>
                </li>
              </ul>
            </div>
          </section>

          <section className="group">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                2. How We Use Your Information
              </h2>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border-2 border-transparent hover:border-indigo-200">
              <p className="text-gray-700 mb-6 leading-relaxed text-lg">We use the information we collect to:</p>
              <ul className="space-y-3 text-gray-700 text-lg">
                <li className="flex items-start gap-3">
                  <span className="text-indigo-600 text-2xl">•</span>
                  <span>Provide, maintain, and improve our services</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-indigo-600 text-2xl">•</span>
                  <span>Process your transactions and send related information</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-indigo-600 text-2xl">•</span>
                  <span>Send you technical notices and support messages</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-indigo-600 text-2xl">•</span>
                  <span>Respond to your comments and questions</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-indigo-600 text-2xl">•</span>
                  <span>Monitor and analyze trends and usage</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-indigo-600 text-2xl">•</span>
                  <span>Detect, prevent, and address technical issues and fraud</span>
                </li>
              </ul>
            </div>
          </section>

          <section className="group">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                3. Information Sharing
              </h2>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border-2 border-transparent hover:border-purple-200">
              <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                We do not sell your personal information. We may share your information only in the following circumstances:
              </p>
              <ul className="space-y-3 text-gray-700 text-lg">
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 text-2xl">•</span>
                  <span>With service providers to facilitate our services</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 text-2xl">•</span>
                  <span>With payment processors to complete transactions</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 text-2xl">•</span>
                  <span>When required by law or to protect our rights</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 text-2xl">•</span>
                  <span>With your consent or at your direction</span>
                </li>
              </ul>
            </div>
          </section>

          <section className="group">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                4. Data Security
              </h2>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border-2 border-transparent hover:border-green-200">
              <p className="text-gray-700 leading-relaxed text-lg">
                We implement appropriate technical and organizational measures to protect your personal information 
                against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission 
                over the Internet or electronic storage is 100% secure.
              </p>
            </div>
          </section>

          <section className="group">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                <Bell className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                5. Contact Us
              </h2>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-10 shadow-xl border-2 border-blue-200">
              <p className="text-gray-700 mb-6 leading-relaxed text-lg font-medium">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <div className="space-y-4 text-gray-800 text-lg">
                <p className="flex items-center gap-3">
                  <span className="font-bold text-blue-600">Email:</span>
                  <a href="mailto:aryasbhattacharyya2002@gmail.com" className="hover:text-blue-600 transition-colors">
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
                  <span className="font-bold text-purple-600">Address:</span>
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

export default PrivacyPolicy;