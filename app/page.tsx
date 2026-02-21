import { currentUser } from "@clerk/nextjs/server";
import { Calendar, Users, Bell, CheckCircle, Sparkles, Zap, TrendingUp, ArrowRight } from 'lucide-react';
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  // const user = await currentUser();
  // if (!user)
  //   return (<div>
  //     <h1 className="text-3xl font-bold text-center underline">
  //       Please Sign In
  //     </h1>
  //   </div>)
    return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-8 h-8 text-purple-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                CampusHub
              </span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-700 hover:text-purple-600 transition">Features</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-purple-600 transition">How It Works</a>
              <a href="#roles" className="text-gray-700 hover:text-purple-600 transition">For You</a>
            </div>
            <button  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:shadow-lg hover:scale-105 transition transform">
              <Link href="/sign-in">
              Sign In
              </Link>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-block">
                <span className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-sm font-semibold">
                  Built for Students, By Students
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Manage Campus Events.{' '}
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-teal-600 bg-clip-text text-transparent">
                  Simplified.
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                One platform for student clubs to create events, manage registrations, and communicate with participants effortlessly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:shadow-xl hover:scale-105 transition transform flex items-center justify-center space-x-2">
                  <span>Explore Events</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button className="px-8 py-4 bg-white text-purple-600 rounded-full font-semibold border-2 border-purple-200 hover:border-purple-600 hover:shadow-lg transition">
                  Organize an Event
                </button>
              </div>
              <div className="flex items-center space-x-8 pt-4">
                <div>
                  <div className="text-3xl font-bold text-purple-600">500+</div>
                  <div className="text-sm text-gray-600">Active Events</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-pink-600">10K+</div>
                  <div className="text-sm text-gray-600">Students</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-teal-600">50+</div>
                  <div className="text-sm text-gray-600">Clubs</div>
                </div>
              </div>
            </div>

            {/* Floating Cards Illustration */}
            <div className="relative hidden lg:block">
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition transform hover:-translate-y-2 animate-float">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">Hackathon 2024</div>
                      <div className="text-sm text-gray-600">March 15 • 200 registered</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition transform hover:-translate-y-2 ml-8 animate-float-delayed">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-blue-400 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">Tech Talk Series</div>
                      <div className="text-sm text-gray-600">Weekly • 150 members</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition transform hover:-translate-y-2 animate-float">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-400 rounded-xl flex items-center justify-center">
                      <Bell className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">New Event Alert</div>
                      <div className="text-sm text-gray-600">Campus Festival • Tomorrow</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Everything You Need to{' '}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Succeed
              </span>
            </h2>
            <p className="text-xl text-gray-600">Powerful features designed for the modern campus</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl hover:shadow-xl transition transform hover:-translate-y-2 cursor-pointer">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition transform">
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Create & Manage Events</h3>
              <p className="text-gray-600">
                Design beautiful event pages with custom forms, schedules, and capacity limits in minutes.
              </p>
            </div>

            <div className="group p-8 bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl hover:shadow-xl transition transform hover:-translate-y-2 cursor-pointer">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition transform">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Easy Event Registration</h3>
              <p className="text-gray-600">
                One-click registration process with instant confirmation and calendar sync support.
              </p>
            </div>

            <div className="group p-8 bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl hover:shadow-xl transition transform hover:-translate-y-2 cursor-pointer">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-blue-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition transform">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Participant Tracking</h3>
              <p className="text-gray-600">
                Real-time attendance tracking, check-ins, and comprehensive participant analytics.
              </p>
            </div>

            <div className="group p-8 bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl hover:shadow-xl transition transform hover:-translate-y-2 cursor-pointer">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition transform">
                <Bell className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Announcements & Updates</h3>
              <p className="text-gray-600">
                Keep everyone informed with instant notifications, reminders, and live updates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Simple Process,{' '}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Powerful Results
              </span>
            </h2>
            <p className="text-xl text-gray-600">Get started in three easy steps</p>
          </div>

          <div className="relative">
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-purple-300 via-pink-300 to-teal-300 transform -translate-y-1/2"></div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full text-2xl font-bold mb-6 shadow-lg hover:scale-110 transition transform">
                  1
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
                  <Zap className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-3 text-gray-800">Student Registers</h3>
                  <p className="text-gray-600">
                    Browse exciting events, read details, and register with a single click. Instant confirmation delivered.
                  </p>
                </div>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-500 to-teal-500 text-white rounded-full text-2xl font-bold mb-6 shadow-lg hover:scale-110 transition transform">
                  2
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
                  <TrendingUp className="w-12 h-12 text-pink-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-3 text-gray-800">Admin Reviews</h3>
                  <p className="text-gray-600">
                    Organizers manage capacity, update event details, and track registrations in real-time.
                  </p>
                </div>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-teal-500 to-blue-500 text-white rounded-full text-2xl font-bold mb-6 shadow-lg hover:scale-110 transition transform">
                  3
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
                  <Bell className="w-12 h-12 text-teal-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-3 text-gray-800">Confirmations Sent</h3>
                  <p className="text-gray-600">
                    Participants receive instant updates, reminders, and announcements directly to their inbox.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Role-Based Views Section */}
      <section id="roles" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Built For{' '}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Everyone
              </span>
            </h2>
            <p className="text-xl text-gray-600">Tailored experiences for every user</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="group bg-gradient-to-br from-purple-500 to-pink-500 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition transform hover:scale-105">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-white">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Participant Dashboard</h3>
                    <p className="text-purple-100">For Students</p>
                  </div>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 flex-shrink-0" />
                    <span>Browse and register for upcoming events</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 flex-shrink-0" />
                    <span>View registration status and event details</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 flex-shrink-0" />
                    <span>Get instant announcements and updates</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 flex-shrink-0" />
                    <span>Track your event history and certificates</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-teal-500 to-blue-500 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition transform hover:scale-105">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-white">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Organizer Dashboard</h3>
                    <p className="text-teal-100">For Club Leaders</p>
                  </div>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 flex-shrink-0" />
                    <span>Create and customize event pages</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 flex-shrink-0" />
                    <span>Manage participant lists and check-ins</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 flex-shrink-0" />
                    <span>Send targeted announcements and reminders</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 flex-shrink-0" />
                    <span>Access analytics and attendance reports</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 via-pink-600 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to manage your next campus event?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Join thousands of students and clubs already using CampusHub
          </p>
          <button className="px-10 py-4 bg-white text-purple-600 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition transform inline-flex items-center space-x-2">
            <span>Get Started</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="mt-6 text-purple-100 text-sm">No credit card required • Free for students</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="w-8 h-8 text-purple-400" />
                <span className="text-2xl font-bold text-white">CampusHub</span>
              </div>
              <p className="text-gray-400 mb-4">
                The ultimate platform for managing student events and club activities. Built for the modern campus.
              </p>
              <div className="inline-block px-4 py-2 bg-purple-900/50 text-purple-300 rounded-lg text-sm">
                Hackathon Demo Project
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="hover:text-purple-400 transition">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-purple-400 transition">How It Works</a></li>
                <li><a href="#roles" className="hover:text-purple-400 transition">For You</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition">
                  <span className="text-xl">𝕏</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition">
                  <span className="text-xl">in</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition">
                  <span className="text-xl">gh</span>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
            <p>&copy; 2024 CampusHub. Built with love for students everywhere.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
