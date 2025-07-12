import React, { useState } from 'react';

const Helpcenter = () => {
  const faqs = [
    {
      question: "How do I reset my password?",
      answer: "Go to Settings > Account > Change Password. Follow the instructions to reset."
    },
    {
      question: "How to contact hostel owners?",
      answer: "Use the 'Chat' button on any hostel listing to message the owner directly."
    },
    {
      question: "What if I face issues with booking?",
      answer: "Contact our support team via chat or email at support@example.com."
    },
    {
      question: "Can I save my favorite hostels?",
      answer: "Yes! Just click the heart icon on any hostel to add it to your Saved list."
    }
  ];

  const [search, setSearch] = useState('');
  const [openIndex, setOpenIndex] = useState(null);

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(search.toLowerCase())
  );

  const toggleAnswer = (index) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Help Center</h2>

      {/* Search Bar */}
      <div className="mb-8">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search help topics..."
          className="w-full p-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* FAQs Accordion */}
      <div className="mb-12">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Frequently Asked Questions</h3>
        <div className="space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <div
                key={index}
                className="border p-4 rounded-lg bg-white shadow transition-all"
              >
                <button
                  onClick={() => toggleAnswer(index)}
                  className="w-full text-left flex justify-between items-center"
                >
                  <span className="font-semibold text-gray-800">{faq.question}</span>
                  <span className="text-blue-600 text-xl">{openIndex === index ? '-' : '+'}</span>
                </button>
                {openIndex === index && (
                  <p className="text-gray-700 mt-3">{faq.answer}</p>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No matching FAQs found.</p>
          )}
        </div>
      </div>

      {/* Contact Support */}
      <div className="text-center">
        <p className="mb-4 text-gray-600">Still need help?</p>
        <button
          onClick={() => alert("Support chat or contact form coming soon!")}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
        >
          Contact Support
        </button>
      </div>
    </div>
  );
};

export default Helpcenter;
