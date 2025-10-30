import { Link } from 'react-router-dom';
import { Shield, Users, Award, Target, Heart, Zap, ArrowLeft, Sparkles } from 'lucide-react';
import { useEffect } from 'react';

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const values = [
    {
      icon: Shield,
      title: 'Trust & Safety',
      description: 'Your security and privacy are our top priorities. We ensure all services meet the highest standards.',
      color: 'from-blue-500 to-blue-600',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      icon: Users,
      title: 'Customer First',
      description: 'Every decision we make is centered around providing the best experience for our users.',
      color: 'from-green-500 to-green-600',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'We strive for excellence in every service we offer, from transport to entertainment.',
      color: 'from-purple-500 to-purple-600',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      icon: Target,
      title: 'Innovation',
      description: 'Constantly evolving and improving to bring you the latest in service technology.',
      color: 'from-orange-500 to-orange-600',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600'
    },
    {
      icon: Heart,
      title: 'Community',
      description: 'Building a community of satisfied customers and trusted service providers.',
      color: 'from-pink-500 to-pink-600',
      iconBg: 'bg-pink-100',
      iconColor: 'text-pink-600'
    },
    {
      icon: Zap,
      title: 'Speed',
      description: 'Quick, efficient service delivery that respects your valuable time.',
      color: 'from-yellow-500 to-yellow-600',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white opacity-10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-300 opacity-10 rounded-full blur-3xl animate-pulse"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-white hover:text-yellow-200 mb-8 transition-all duration-300 group hover:scale-110 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold">Back to Home</span>
          </Link>
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Sparkles className="w-16 h-16 text-yellow-300 animate-pulse" />
            </div>
            <h1 className="text-6xl md:text-7xl font-extrabold mb-6 leading-tight">
              About <span className="text-yellow-300">uniServe</span>
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto leading-relaxed">
              Revolutionizing how you access daily services - one platform, endless possibilities
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Our Mission
            </h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              At uniServe, we believe life should be simple. Our mission is to bring all your essential daily services under one unified platform, saving you time, effort, and money.
            </p>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              From transportation to food delivery, entertainment to healthcare, we're building the future of service booking - one that's seamless, reliable, and designed around you.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Founded in 2025, we've already helped millions of users simplify their lives, and we're just getting started.
            </p>
          </div>
          <div className="order-1 md:order-2">
            <div className="bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-3xl p-12 shadow-2xl border-2 border-indigo-200 transform hover:scale-105 transition-transform duration-300">
              <div className="space-y-8">
                <div className="flex items-center gap-6 bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-5 rounded-2xl shadow-lg">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <div className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">5M+</div>
                    <div className="text-gray-600 font-semibold">Happy Users</div>
                  </div>
                </div>
                <div className="flex items-center gap-6 bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-5 rounded-2xl shadow-lg">
                    <Award className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <div className="text-4xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">10K+</div>
                    <div className="text-gray-600 font-semibold">Service Providers</div>
                  </div>
                </div>
                <div className="flex items-center gap-6 bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-5 rounded-2xl shadow-lg">
                    <Target className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <div className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">50+</div>
                    <div className="text-gray-600 font-semibold">Cities Covered</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Our Core Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do at uniServe
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, idx) => (
              <div 
                key={idx} 
                className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-indigo-200"
              >
                <div className={`${value.iconBg} w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-md`}>
                  <value.icon className={`w-10 h-10 ${value.iconColor}`} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-indigo-600 transition-colors">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-3xl p-16 text-center overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-300 opacity-20 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <h3 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Join Us on This Journey</h3>
            <p className="text-xl text-purple-100 mb-10 max-w-2xl mx-auto leading-relaxed">
              Whether you're a user looking for convenience or a service provider seeking growth, 
              uniServe is the platform for you.
            </p>
            <Link 
              to="/register"
              className="inline-block bg-white text-indigo-600 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-yellow-100 transition-all shadow-2xl transform hover:scale-110 hover:-translate-y-1"
            >
              Get Started Today
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;