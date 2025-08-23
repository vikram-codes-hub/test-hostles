import React, { useState } from 'react';

const Helpcenter = () => {
  const faqs = [
    {
      question: "How do I reset my password?",
      answer: "Go to Settings > Account > Change Password. Follow the instructions to reset your password. You'll receive an email confirmation once the password is successfully changed.",
      category: "Account",
      icon: "🔑"
    },
    {
      question: "How to contact hostel owners?",
      answer: "Use the 'Chat' button on any hostel listing to message the owner directly. You can also find their contact details in the hostel information section.",
      category: "Communication",
      icon: "💬"
    },
    {
      question: "What if I face issues with booking?",
      answer: "Contact our support team via the chat widget below, email us at support@example.com, or call our 24/7 helpline. We're here to help resolve any booking issues quickly.",
      category: "Booking",
      icon: "🏠"
    },
    {
      question: "Can I save my favorite hostels?",
      answer: "Yes! Just click the heart icon on any hostel to add it to your Saved list. You can access your saved hostels anytime from the navigation menu.",
      category: "Features",
      icon: "❤️"
    },
    {
      question: "How do I cancel a booking?",
      answer: "Go to 'My Bookings' in your profile, find the booking you want to cancel, and click 'Cancel Booking'. Please check the cancellation policy for any applicable fees.",
      category: "Booking",
      icon: "❌"
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, debit cards, PayPal, and digital wallets. All transactions are secured with 256-bit SSL encryption.",
      category: "Payment",
      icon: "💳"
    }
  ];

  const categories = ["All", "Account", "Booking", "Communication", "Features", "Payment"];

  const [search, setSearch] = useState('');
  const [openIndex, setOpenIndex] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(search.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleAnswer = (index) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  const supportOptions = [
    {
      title: "Live Chat",
      description: "Chat with our support team",
      icon: "💬",
      action: () => alert("Live chat opening soon!"),
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      title: "Email Support",
      description: "support@example.com",
      icon: "📧",
      action: () => window.location.href = "mailto:support@example.com",
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      title: "Phone Support",
      description: "Call us 24/7",
      icon: "📞",
      action: () => alert("Phone: +1-800-123-4567"),
      color: "bg-purple-500 hover:bg-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-6">
            <span className="text-3xl">🆘</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">How can we help you?</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions or get in touch with our support team
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-gray-400 text-xl">🔍</span>
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search help topics, keywords, or questions..."
              className="w-full pl-12 pr-4 py-4 text-lg border-0 rounded-2xl shadow-lg bg-white focus:ring-4 focus:ring-blue-200 focus:outline-none transition-all duration-300"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-100 hover:shadow-md'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* FAQs Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="mr-3 text-2xl">❓</span>
                Frequently Asked Questions
              </h2>
              
              <div className="space-y-4">
                {filteredFaqs.length > 0 ? (
                  filteredFaqs.map((faq, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-2xl bg-gray-50 hover:bg-white transition-all duration-300 hover:shadow-md"
                    >
                      <button
                        onClick={() => toggleAnswer(index)}
                        className="w-full p-6 text-left flex justify-between items-center"
                      >
                        <div className="flex items-start space-x-4">
                          <span className="text-2xl flex-shrink-0 mt-1">{faq.icon}</span>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">{faq.question}</h3>
                            <span className="text-sm text-blue-600 font-medium mt-1 inline-block">
                              {faq.category}
                            </span>
                          </div>
                        </div>
                        <div className={`ml-4 transform transition-transform duration-300 ${
                          openIndex === index ? 'rotate-45' : ''
                        }`}>
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-bold text-lg">+</span>
                          </div>
                        </div>
                      </button>
                      
                      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                        openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}>
                        <div className="px-6 pb-6">
                          <div className="ml-12 bg-blue-50 p-4 rounded-xl border-l-4 border-blue-400">
                            <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
                    <p className="text-gray-600">Try adjusting your search or browse different categories</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Support Options Sidebar */}
          <div className="space-y-6">
            
            {/* Quick Stats */}
            <div className="bg-white rounded-3xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">📊</span>
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg. Response Time</span>
                  <span className="font-semibold text-green-600">2 mins</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Satisfaction Rate</span>
                  <span className="font-semibold text-blue-600">98%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Support Hours</span>
                  <span className="font-semibold text-purple-600">24/7</span>
                </div>
              </div>
            </div>

            {/* Contact Support Options */}
            <div className="bg-white rounded-3xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <span className="mr-2">🚀</span>
                Need More Help?
              </h3>
              
              <div className="space-y-4">
                {supportOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={option.action}
                    className={`w-full p-4 rounded-xl text-white text-left transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${option.color}`}
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-4">{option.icon}</span>
                      <div>
                        <h4 className="font-semibold">{option.title}</h4>
                        <p className="text-sm opacity-90">{option.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Articles */}
            <div className="bg-white rounded-3xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">🔥</span>
                Popular Articles
              </h3>
              <div className="space-y-3">
                {[
                  "Getting Started Guide",
                  "Booking Your First Hostel",
                  "Safety Tips for Travelers",
                  "Managing Your Account"
                ].map((article, index) => (
                  <a
                    key={index}
                    href="#"
                    className="block p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-gray-700 hover:text-blue-600"
                  >
                    <span className="text-sm">📖</span> {article}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-2">Still couldn't find what you're looking for?</h3>
            <p className="text-blue-100 mb-6">Our support team is always ready to help you out</p>
            <button
              onClick={() => alert("Redirecting to contact form...")}
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Contact Support Team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Helpcenter;