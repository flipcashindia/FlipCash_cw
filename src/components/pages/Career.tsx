// src/pages/Career.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Users, TrendingUp, Heart, Gift, Coffee, MapPin, Clock, DollarSign, ChevronRight, Send, Mail, Phone } from 'lucide-react';
import flipcashLogo from '../../../public/flipcash_header_logo.png';

interface Job {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  description: string;
}

const jobListings: Job[] = [
  {
    id: 1,
    title: "Full Stack Developer",
    department: "Engineering",
    location: "Gurugram, Haryana",
    type: "Full-time",
    experience: "2-4 years",
    description: "Work on our Django + React Native stack to build innovative features for our re-commerce platform."
  },
  {
    id: 2,
    title: "Mobile App Developer (React Native)",
    department: "Engineering",
    location: "Gurugram, Haryana",
    type: "Full-time",
    experience: "3-5 years",
    description: "Lead mobile app development for our customer and partner applications using React Native and Expo."
  },
  {
    id: 3,
    title: "Backend Engineer (Django)",
    department: "Engineering",
    location: "Gurugram, Haryana",
    type: "Full-time",
    experience: "2-5 years",
    description: "Build scalable APIs and microservices to power our marketplace platform."
  },
  {
    id: 4,
    title: "Product Manager",
    department: "Product",
    location: "Gurugram, Haryana",
    type: "Full-time",
    experience: "4-6 years",
    description: "Drive product strategy and roadmap for our re-commerce ecosystem."
  },
  {
    id: 5,
    title: "UI/UX Designer",
    department: "Design",
    location: "Gurugram, Haryana",
    type: "Full-time",
    experience: "2-4 years",
    description: "Create delightful user experiences across web and mobile platforms."
  },
  {
    id: 6,
    title: "Digital Marketing Manager",
    department: "Marketing",
    location: "Gurugram, Haryana",
    type: "Full-time",
    experience: "3-5 years",
    description: "Lead digital marketing campaigns and grow our customer base across India."
  },
  {
    id: 7,
    title: "Business Development Executive",
    department: "Sales",
    location: "Multiple Cities",
    type: "Full-time",
    experience: "1-3 years",
    description: "Onboard and manage partner relationships across India."
  },
  {
    id: 8,
    title: "Customer Support Specialist",
    department: "Operations",
    location: "Gurugram, Haryana",
    type: "Full-time",
    experience: "0-2 years",
    description: "Provide excellent support to our customers and partners."
  },
  {
    id: 9,
    title: "Data Analyst",
    department: "Analytics",
    location: "Gurugram, Haryana",
    type: "Full-time",
    experience: "2-4 years",
    description: "Analyze data to drive business insights and decision-making."
  },
  {
    id: 10,
    title: "DevOps Engineer",
    department: "Engineering",
    location: "Gurugram, Haryana",
    type: "Full-time",
    experience: "3-5 years",
    description: "Manage cloud infrastructure, CI/CD pipelines, and ensure platform reliability."
  }
];

const JobCard: React.FC<{ job: Job; onClick: () => void }> = ({ job, onClick }) => {
  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 p-6 hover:border-[#FEC925] hover:shadow-lg transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
          <span className="inline-block bg-[#FEC925] text-black px-3 py-1 rounded-full text-sm font-semibold">
            {job.department}
          </span>
        </div>
      </div>
      <p className="text-gray-700 mb-4">{job.description}</p>
      <div className="flex flex-wrap gap-3 mb-4 text-sm text-gray-600">
        <div className="flex items-center">
          <MapPin className="w-4 h-4 mr-1" />
          {job.location}
        </div>
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-1" />
          {job.type}
        </div>
        <div className="flex items-center">
          <Briefcase className="w-4 h-4 mr-1" />
          {job.experience}
        </div>
      </div>
      <button
        onClick={onClick}
        className="w-full bg-black text-[#FEC925] py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors duration-300 flex items-center justify-center"
      >
        Apply Now <ChevronRight className="w-5 h-5 ml-2" />
      </button>
    </div>
  );
};

const Career: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const departments = ['All', ...Array.from(new Set(jobListings.map(job => job.department)))];

  const filteredJobs = selectedDepartment === 'All' 
    ? jobListings 
    : jobListings.filter(job => job.department === selectedDepartment);

  const handleApply = (job: Job) => {
    setSelectedJob(job);
    setShowApplicationForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#FEC925] to-yellow-400 py-20">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <img 
            src={flipcashLogo} 
            alt="Flipcash Logo" 
            className="w-48 h-24 mx-auto mb-8 rounded-lg" 
          />
          <h1 className="text-4xl md:text-6xl font-extrabold text-black mb-6">
            Join Our Team
          </h1>
          <p className="text-xl md:text-2xl text-black/80 max-w-3xl mx-auto font-medium mb-8">
            Help us revolutionize the re-commerce industry and build a sustainable future
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => document.getElementById('open-positions')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-black text-[#FEC925] px-8 py-4 rounded-lg text-lg font-bold hover:bg-gray-900 transition-colors duration-300 shadow-lg"
            >
              View Open Positions
            </button>
            <button
              onClick={() => document.getElementById('culture')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white text-black px-8 py-4 rounded-lg text-lg font-bold hover:bg-gray-100 transition-colors duration-300 shadow-lg"
            >
              Learn About Our Culture
            </button>
          </div>
        </div>
      </section>

      {/* Why Join Flipcash */}
      <section className="py-16 bg-white" id="culture">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Join Flipcash?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Be part of a mission-driven team building India's most trusted re-commerce platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Fast Growth</h3>
              <p className="text-gray-600">
                Rapid career progression in a high-growth startup environment
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Sustainability</h3>
              <p className="text-gray-600">
                Contribute to reducing e-waste and building a circular economy
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Great Team</h3>
              <p className="text-gray-600">
                Work with talented, passionate people who care about impact
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-[#FEC925] to-yellow-500 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-10 h-10 text-black" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Innovation</h3>
              <p className="text-gray-600">
                Build cutting-edge solutions using modern tech stack
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits & Perks */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Benefits & Perks</h2>
            <p className="text-xl text-gray-600">
              We take care of our team members
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow">
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full p-3 mr-4">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Competitive Salary</h3>
                  <p className="text-gray-600 text-sm">Industry-leading compensation and ESOP opportunities</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow">
              <div className="flex items-start">
                <div className="bg-green-100 rounded-full p-3 mr-4">
                  <Heart className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Health Insurance</h3>
                  <p className="text-gray-600 text-sm">Comprehensive medical coverage for you and your family</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow">
              <div className="flex items-start">
                <div className="bg-purple-100 rounded-full p-3 mr-4">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Flexible Hours</h3>
                  <p className="text-gray-600 text-sm">Work-life balance with flexible working arrangements</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow">
              <div className="flex items-start">
                <div className="bg-yellow-100 rounded-full p-3 mr-4">
                  <TrendingUp className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Learning & Development</h3>
                  <p className="text-gray-600 text-sm">Continuous learning with courses, workshops, and conferences</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow">
              <div className="flex items-start">
                <div className="bg-red-100 rounded-full p-3 mr-4">
                  <Gift className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Team Events</h3>
                  <p className="text-gray-600 text-sm">Regular team outings, celebrations, and fun activities</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow">
              <div className="flex items-start">
                <div className="bg-indigo-100 rounded-full p-3 mr-4">
                  <Coffee className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Great Workspace</h3>
                  <p className="text-gray-600 text-sm">Modern office with snacks, beverages, and recreation areas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form Modal */}
      {showApplicationForm && selectedJob && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Apply for Position</h2>
                  <p className="text-xl text-gray-600">{selectedJob.title}</p>
                </div>
                <button
                  onClick={() => setShowApplicationForm(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FEC925] focus:outline-none"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FEC925] focus:outline-none"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FEC925] focus:outline-none"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Current Location *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FEC925] focus:outline-none"
                      placeholder="Mumbai, Maharashtra"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Total Experience (in years) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    max="50"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FEC925] focus:outline-none"
                    placeholder="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Resume / CV *
                  </label>
                  <input
                    type="file"
                    required
                    accept=".pdf,.doc,.docx"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FEC925] focus:outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-2">Accepted formats: PDF, DOC, DOCX (Max 5MB)</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    LinkedIn Profile URL
                  </label>
                  <input
                    type="url"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FEC925] focus:outline-none"
                    placeholder="https://linkedin.com/in/johndoe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Why do you want to join Flipcash? *
                  </label>
                  <textarea
                    required
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FEC925] focus:outline-none"
                    placeholder="Tell us about your interest in this role and Flipcash..."
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-[#FEC925] text-black py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 transition-colors duration-300 flex items-center justify-center"
                  >
                    Submit Application <Send className="w-5 h-5 ml-2" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowApplicationForm(false)}
                    className="px-8 bg-gray-200 text-gray-900 py-4 rounded-lg font-bold text-lg hover:bg-gray-300 transition-colors duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Open Positions */}
      <section className="py-16 bg-white" id="open-positions">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Open Positions</h2>
            <p className="text-xl text-gray-600 mb-8">
              Find your perfect role and join our growing team
            </p>

            {/* Department Filter */}
            <div className="flex flex-wrap gap-3 justify-center">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDepartment(dept)}
                  className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                    selectedDepartment === dept
                      ? 'bg-[#FEC925] text-black shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          {/* Job Listings */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} onClick={() => handleApply(job)} />
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No positions available in this department at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Life at Flipcash */}
      <section className="py-16 bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Life at Flipcash</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience a vibrant workplace culture focused on innovation, collaboration, and growth
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="bg-[#FEC925] text-black rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                50+
              </div>
              <h3 className="text-xl font-bold mb-2">Team Members</h3>
              <p className="text-gray-300">Passionate professionals driving our mission</p>
            </div>
            <div className="text-center">
              <div className="bg-[#FEC925] text-black rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                10+
              </div>
              <h3 className="text-xl font-bold mb-2">Cities</h3>
              <p className="text-gray-300">Growing presence across India</p>
            </div>
            <div className="text-center">
              <div className="bg-[#FEC925] text-black rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                100K+
              </div>
              <h3 className="text-xl font-bold mb-2">Devices Traded</h3>
              <p className="text-gray-300">Making a real environmental impact</p>
            </div>
          </div>
        </div>
      </section>

      {/* Didn't Find What You're Looking For */}
      <section className="py-16 bg-[#FEC925]">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
            Didn't Find What You're Looking For?
          </h2>
          <p className="text-xl text-black/80 mb-8 max-w-2xl mx-auto">
            We're always looking for talented individuals. Send us your resume and we'll keep you in mind for future opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:careers@flipcash.in"
              className="bg-black text-[#FEC925] px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-900 transition-colors duration-300 inline-flex items-center justify-center"
            >
              <Mail className="w-5 h-5 mr-2" />
              careers@flipcash.in
            </a>
            <a
              href="tel:+919654786218"
              className="bg-white text-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors duration-300 inline-flex items-center justify-center"
            >
              <Phone className="w-5 h-5 mr-2" />
              +91 96547 86218
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Ready to Make an Impact?</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => document.getElementById('open-positions')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-[#FEC925] text-black px-8 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors duration-300"
            >
              View All Openings
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors duration-300 border-2 border-gray-200"
            >
              Back to Home
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Career;