"use client"

import Link from "next/link";
import Image from "next/image";
import { ThumbsUp, Moon, Smartphone, ArrowRightCircle } from "lucide-react";
import { useState } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";

const faqs = [
  {
    question: "How often is your database updated?",
    answer: "The database will be updated once a month.",
  },
  {
    question: "Do you offer customer service?",
    answer: "Customer support is available on our Discord server. You’ll find access to the server directly on the tool. You can also contact us via our contact form. We’ll get back to you as soon as possible.",
  },
  {
    question: "How can I include my marketplace on your database?",
    answer: "We are open to working with any linkbuilding platform. We’ll need an API that lists your sites and rates. To start a collaboration, please contact us via Twitter or fill in the contact form.",
  },
  {
    question: "Do you offer a free trial?",
    answer: "We offer one free search to demonstrate the power of our tool. Our demo showcases all the functionalities available. Additionally, we provide a satisfaction guarantee with a refund policy.",
  },
  {
    question: "I don't want my site showing up on SurferLink. What can I do?",
    answer: "If you don’t want your site displayed in Surferlink, visit this page: Surferlink – Remove Me",
  },
];

export default function Home() {

  const [openIndex, setOpenIndex] = useState(0); // Default first item open

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <main className="relative flex flex-col items-center justify-center bg-gray-100 dark:bg-slate-900 mt-24">

      {/* Hero Section */}
      <section className="relative text-center py-10 bg-gradient-to-b from-gray-100 via-[#e3e8ff] to-[#e0d3ff] w-full">

        <h1 className="text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
          Boost Your Rankings <br /> with Backlink Insights
        </h1>
        <p className="mt-6 text-lg text-gray-700 dark:text-gray-300">
          Analyze backlinks, uncover missed links, and optimize your strategy <br /> to outperform competitors.
        </p>

        {/* CTA Button */}
        <button className="mt-8 px-10 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600
          text-white font-semibold text-lg rounded-3xl full shadow-lg transition-all duration-300 ease-in-out
          hover:scale-105 hover:shadow-2xl backdrop-blur-md">
          Start Free Analysis Now
        </button>

        <p className="mt-4 text-gray-500 text-sm">
          No credit card required - get instant insights!
        </p>

        {/* Centered & Responsive Image */}
        <div className="flex justify-center mt-3">
          <Image
            src="/images/hero.png"
            alt="Hero Image"
            width={800} // Bigger size for a premium look
            height={600}
            className="w-full h-auto rounded-xl mask-image-gradient"
          />
        </div>

        {/* Fading Gradient Transition */}
        <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-b from-transparent to-gray-100"></div>
      </section>

      <section className="bg-gray-100 py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">

            {/* Feature 1 */}
            <div className="flex flex-col items-center">
              <div className="h-14">
                <Image
                  src="/images/icons/hero_section/comprehensive_data.svg"
                  alt="Hero Image"
                  width={50}
                  height={50}
                  className="w-full h-auto"
                />
              </div>

              <h3 className="text-xl font-bold text-gray-900">Comprehensive Data</h3>

              <div className="max-w-96">
                <p className="text-gray-600 mt-2">
                  300,000+ sites and marketplace insights to outpace competitors
                </p>
              </div>

            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center">
              <div className="h-14">
                <Image
                  src="/images/icons/hero_section/real_time_analytics.svg"
                  alt="Hero Image"
                  width={50}
                  height={50}
                  className="w-full h-auto"
                />
              </div>

              <h3 className="text-xl font-bold text-gray-900">Real-Time Analytics</h3>

              <div className="max-w-96">
                <p className="text-gray-600 mt-2">
                  Instant, accurate backlink data to optimize your strategy on the go
                </p>
              </div>

            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center">
              <div className="h-14">
                <Image
                  src="/images/icons/hero_section/user_interface.svg"
                  alt="Hero Image"
                  width={50}
                  height={50}
                  className="w-full h-auto"
                />
              </div>

              <h3 className="text-xl font-bold text-gray-900">User-Friendly Interface</h3>

              <div className="max-w-96">
                <p className="text-gray-600 mt-2">
                  Simplify your workflow with an intuitive platform designed for efficiency
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section id="features" className="bg-gray-100 py-16">
        <div className="container mx-auto px-6">
          {/* Section Heading */}
          <h2 className="text-5xl font-extrabold text-center text-gray-600">Core Features</h2>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-10">

            {/* Feature 1 */}
            <div className="p-6 bg-gradient-to-b from-[#199DFB] to-[#9159FF] text-white rounded-2xl shadow-xl transition-transform duration-300 hover:scale-105">
              <ThumbsUp size={40} className="text-yellow-300" />
              <h3 className="text-2xl font-bold mt-6">Competitive Analysis Made Easy</h3>
              <p className="mt-4 text-white/90">
                Analyse competitor domains, compare backlink prices, and find the best deals to improve your SEO strategy. All in one, intuitive dashboard.
              </p>
            </div>

            {/* Feature 2 (Twice as wide) */}
            <div className="p-6 bg-gradient-to-b from-[#BE45DD] to-[#4859CA] text-white rounded-2xl shadow-xl md:col-span-2 transition-transform duration-300 hover:scale-105">
              <div className="mr-10 mt-3 h-[120] flex">
                <Image
                  src="/images/core_feature_section/detailedInsights.svg"
                  alt="Hero Image"
                  width={800} // Remove or adjust this if necessary
                  height={120} // Remove or adjust this if necessary
                  className="w-full h-auto"
                />
              </div>
              <h3 className="text-2xl font-bold mt-6">Detailed Insights at a Glance</h3>
              <p className="mt-4 text-white/90">
                View key metrics like domain authority, backlink relevance, and pricing in a clean, user-friendly interface. Filter and customise results to match your needs.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-gradient-to-b from-[#56BAE1] to-[#41BBD6] text-white rounded-2xl shadow-xl transition-transform duration-300 hover:scale-105">
              <div className="mr-10 mt-3 h-[120] flex ">
                <Image
                  src="/images/core_feature_section/smaterBudgeting.svg"
                  alt="Hero Image"
                  width={300} // Remove or adjust this if necessary
                  height={120} // Remove or adjust this if necessary
                  className="w-full h-auto"
                />
              </div>
              <h3 className="text-2xl font-bold mt-6">Smarter Budgeting</h3>
              <p className="mt-4 text-white/90">
                Identify cost-effective backlinks that provide maximum value for your investment.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 bg-black text-white rounded-2xl shadow-xl flex flex-col transition-transform duration-300 hover:scale-105">
              <Moon size={40} className="text-gray-400" />
              <h3 className="text-2xl font-bold mt-6">Dark Mode Support</h3>
              <p className="mt-4 text-white/90">
                Work comfortably, day or night. Switch to Dark Mode for a sleek, modern interface that’s easy on the eyes.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 bg-gradient-to-b from-[#B25CC8] to-[#DD5E5E] text-white rounded-2xl shadow-xl flex flex-col transition-transform duration-300 hover:scale-105">
              <Smartphone size={40} className="text-white" />
              <h3 className="text-2xl font-bold mt-6">Mobile-Friendly Design</h3>
              <p className="mt-4 text-white/90">
                Take your SEO analysis on the go. Our fully responsive platform works seamlessly on all devices, so you can stay productive anywhere.
              </p>
            </div>

            {/* Feature 6 (Twice as wide) */}
            <div className="p-6 bg-[#4A92F3] text-white rounded-2xl shadow-xl flex flex-col md:col-span-2 transition-transform duration-300 hover:scale-105">
              <ArrowRightCircle size={40} className="text-white" />
              <h3 className="text-2xl font-bold mt-6">Easy Sign-Up</h3>
              <p className="mt-4 text-white/90">
                Get started in seconds. No complicated forms or credit card required. Just sign up and dive into your backlink insights.
              </p>
              <Link href="/api/auth/signup">
                <button className="mt-6 px-6 py-3 bg-white text-blue-500 font-bold rounded-2xl shadow-md hover:bg-gray-200 transition-all w-52">
                  Sign Up Now
                </button>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* {Who's it for Section} */}
      <section id="whos-it-for" className="py-20 w-full">
        <div className="container mx-auto px-6 text-center">

          {/* Section Heading */}
          <h2 className="text-5xl font-extrabold text-gray-600 dark:text-white mb-12">
            Who’s It For?
          </h2>

          {/* 3 Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

            {/* SEO Specialists */}
            <div className="flex flex-col items-center">
              <Image
                src="/images/whos_it_for_section/person1.svg"
                alt="Hero Image"
                width={100} // Bigger size for a premium look
                height={100}

              />
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mt-6">
                SEO Specialists
              </h3>
              <p className="mt-3 text-gray-600 dark:text-gray-300 max-w-xs">
                Struggling to find accurate data for competitor analysis? <br />
                Our tool provides real-time analytics to keep you one step ahead.
              </p>
            </div>

            {/* Small Business Owners */}
            <div className="flex flex-col items-center">
            <Image
                src="/images/whos_it_for_section/person2.svg"
                alt="Hero Image"
                width={100} // Bigger size for a premium look
                height={100}
              />
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mt-6">
                Small Business Owners
              </h3>
              <p className="mt-3 text-gray-600 dark:text-gray-300 max-w-xs">
                Short on time and expertise to improve SEO? <br />
                Our platform’s simple interface makes analysis quick and easy.
              </p>
            </div>

            {/* Digital Marketers */}
            <div className="flex flex-col items-center">
            <Image
                src="/images/whos_it_for_section/person3.svg"
                alt="Hero Image"
                width={100} // Bigger size for a premium look
                height={100}
              />
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mt-6">
                Digital Marketers
              </h3>
              <p className="mt-3 text-gray-600 dark:text-gray-300 max-w-xs">
                Wasting budget on ineffective backlinks? <br />
                Use our service to discover links that deliver maximum value.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* All in One Seo toolkit section  */}
      <section id="seo-toolkit">
        <div className="container mx-auto px-6 text-center">
          {/* Section Heading */}
          <h2 className="text-5xl font-extrabold text-center text-gray-600">All-in-One SEO Toolkit</h2>
          <p className="mt-6 text-lg text-gray-700 dark:text-gray-300">
            Everything you need to opimize your SEO strategy in one place
          </p>
          <div className="flex flex-1 mt-10 items-center gap-12">
            <div className="mr-10 mt-3 flex ">
              <Image
                src="/images/all_in_one_section/menu.svg"
                alt="Hero Image"
                width={500} // Remove or adjust this if necessary
                height={600} // Remove or adjust this if necessary
                className="w-full h-auto"
              />
            </div>
            <div className="mr-10 mt-3 flex ">
              <Image
                src="/images/all_in_one_section/description.svg"
                alt="Hero Image"
                width={500} // Remove or adjust this if necessary
                height={300} // Remove or adjust this if necessary
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-6 text-center">

          {/* Section Heading */}
          <h2 className="text-5xl font-extrabold text-gray-600 dark:text-white">
            Testimonials
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-4">
            Over 10,000 marketers and SEO professionals trust SurferLink to <br/>
            take their strategies to the next level.
          </p>

          {/* 3 Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">

            {/* Testimonial 1 */}
            <div className="p-6 bg-white dark:bg-gray-800 shadow-xl rounded-2xl flex flex-col items-start space-y-4 transition-transform duration-300 hover:scale-105">
              <div className="flex items-center gap-4 mb-3">
                {/* Image */}
                <div className="h-18 w-18 flex items-center justify-center">
                  <Image
                    src="/images/testimonials_section/person1.svg"
                    alt="Hero Image"
                    width={70} // Adjust width
                    height={70} // Adjust height
                    className="rounded-full object-cover"
                  />
                </div>

                {/* Text (Vertically Centered) */}
                <div className="flex flex-col justify-center">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Sarah T.</h3>
                  <p className="text-gray-500 dark:text-gray-400">SEO Specialist</p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-left">
                This tool has transformed the way I approach backlink strategies.
                The real-time data is a game-changer for staying ahead of competitors.
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="p-6 bg-white dark:bg-gray-800 shadow-xl rounded-2xl flex flex-col items-start space-y-4 transition-transform duration-300 hover:scale-105">
              <div className="flex items-center gap-4 mb-3">
                {/* Image */}
                <div className="h-18 w-18 flex items-center justify-center">
                  <Image
                    src="/images/testimonials_section/person2.svg"
                    alt="Hero Image"
                    width={70} // Adjust width
                    height={70} // Adjust height
                    className="rounded-full object-cover"
                  />
                </div>

                {/* Text (Vertically Centered) */}
                <div className="flex flex-col justify-center">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">James L.</h3>
                  <p className="text-gray-500 dark:text-gray-400">Digital Marketer</p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-left">
                Managing campaigns has never been easier. The insights provided by this platform have helped me
                optimise my budgets and drive better results.
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="p-6 bg-white dark:bg-gray-800 shadow-xl rounded-2xl flex flex-col items-start space-y-4 transition-transform duration-300 hover:scale-105">
              <div className="flex items-center gap-4 mb-3">
                {/* Image */}
                <div className="h-18 w-18 flex items-center justify-center">
                  <Image
                    src="/images/testimonials_section/person3.svg"
                    alt="Hero Image"
                    width={70} // Adjust width
                    height={70} // Adjust height
                    className="rounded-full object-cover"
                  />
                </div>

                {/* Text (Vertically Centered) */}
                <div className="flex flex-col justify-center">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Emiliy R.</h3>
                  <p className="text-gray-500 dark:text-gray-400">Small Business Owner</p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-left">
                As someone new to SEO, I found the interface incredibly intuitive. It’s helped me boost my website rankings
                without any technical expertise.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 text-left">
        <h2 className="text-4xl font-bold text-gray-600 text-center">Pricing</h2>

        {/* Pricing Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 px-6 md:px-20">

          {/* Standard Plan */}
          <div className="p-8 mb-16 bg-gradient-to-b from-[#199DFB] to-[#9159FF] text-white rounded-3xl shadow-lg transition-transform duration-300 hover:scale-105">
            <h3 className="text-2xl font-bold mt-6">Standard</h3>
            <p className="text-sm opacity-90">For freelancers and niche site owners</p>
            <p className="text-5xl font-bold mt-4">€15 <span className="text-lg font-medium">/month</span></p>
            <ul className="mt-6 space-y-2 text-white/90 text-left">
              <li>Forums and expired domains</li>
              <li>300 results per search</li>
              <li>100 backlinks monitored</li>
              <li>200 Plugin clicks</li>
              <li>50 keyword searches</li>
              <li>20 competitive analyses</li>
              <li>Scan 3 competitors in bulk</li>
            </ul>
            <Link href="/api/auth/signin">
              <button className="mt-6 px-6 py-3 bg-white text-blue-600 font-bold rounded-lg shadow-md hover:bg-gray-200 transition-all w-full">
                Start Free Analysis Now
              </button>
            </Link>
          </div>

          {/* Booster Plan (Popular) */}
          <div className="relative p-8 bg-gradient-to-b from-[#BE45DD] to-[#4859CA] text-white rounded-3xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105">
            {/* Overlay the badge at the top-right corner */}
            <div className="absolute -top-4 -right-6 w-36 h-36">
              <Image
                src="/images/badge.svg" // Ensure the path is correct
                alt="Popular Badge"
                width={128}
                height={128}
                className="w-full h-full"
              />
            </div>

            <h3 className="text-2xl font-bold mt-6">Booster</h3>
            <p className="text-sm opacity-90">For small agencies and online businesses</p>
            <p className="text-5xl font-bold mt-4">€49 <span className="text-lg font-medium">/month</span></p>

            <ul className="mt-6 space-y-2 text-white/90 text-left">
              <li>Forums and expired domains</li>
              <li>1000 results per search</li>
              <li>500 backlinks monitored</li>
              <li>1000 Plugin clicks</li>
              <li>250 keyword searches</li>
              <li>100 competitive analyses</li>
              <li>Scan 15 competitors in bulk</li>
              <li>Scan 20 keywords in Bulk</li>
              <li>20 SERP Scanner</li>
            </ul>

            <Link href="/api/auth/signin">
              <button className="mt-6 px-6 py-3 bg-white text-purple-600 font-bold rounded-lg shadow-md hover:bg-gray-200 transition-all w-full">
                Start Free Analysis Now
              </button>
            </Link>
          </div>

          {/* Elite Plan */}
          <div className="p-8 bg-black text-white rounded-3xl shadow-lg transition-transform duration-300 hover:scale-105">
            <h3 className="text-2xl font-bold mt-6">Elite</h3>
            <p className="text-sm opacity-90">For an almost unlimited use of Surferlink</p>
            <p className="text-5xl font-bold mt-4">€99 <span className="text-lg font-medium">/month</span></p>
            <ul className="mt-6 space-y-2 text-white/90 text-left">
              <li>Forums and expired domains</li>
              <li>30,000 results per search</li>
              <li>2000 backlinks monitored</li>
              <li>5000 Plugin clicks</li>
              <li>2000 keyword searches</li>
              <li>500 competitive analyses</li>
              <li>Scan 40 competitors in bulk</li>
              <li>Scan 100 keywords in Bulk</li>
              <li>50 SERP Scanner</li>
            </ul>
            <Link href="/api/auth/signin">
              <button className="mt-6 px-6 py-3 bg-white text-black font-bold rounded-lg shadow-md hover:bg-gray-200 transition-all w-full">
                Start Free Analysis Now
              </button>
            </Link>
          </div>

        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 text-center w-full">
        <h2 className="text-4xl font-bold text-gray-600 dark:text-white mb-8">FAQ</h2>

        {/* FAQ Items */}
        <div className="max-w-5xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 transition-all"
            >
              <button
                className="w-full flex items-center text-left text-lg font-semibold text-gray-600 dark:text-white"
                onClick={() => toggleFAQ(index)}
              >
                {openIndex === index ? (
                  <FiMinus className="text-gray-500 dark:text-gray-300" />
                ) : (
                  <FiPlus className="text-gray-500 dark:text-gray-300" />
                )}
                <div className="ml-3">
                  {faq.question}
                </div>
              </button>
              <div className="ml-7">
                {openIndex === index && faq.answer && (
                  <p className="mt-2 text-gray-600 dark:text-gray-400 text-left">
                    {faq.answer}
                  </p>
                )}
              </div>

            </div>
          ))}
        </div>
      </section>

      <footer className="bg-[#18191C] text-gray-400 py-12 w-full">
        <div className="container mx-auto px-6 lg:px-16 mt-10">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start space-y-6 md:space-y-0">

            {/* Left Section - Logo and Copyright */}
            <div className="flex flex-col justify-between h-full min-h-[100px]">
              <Image
                src="/images/logotype_dark.svg" // ✅ Replace with actual logo path
                alt="SurferLink Logo"
                width={140}
                height={40}
                className="mb-3"
              />
              <div className="flex-grow"></div> {/* Pushes the text to the bottom */}
              <p className="text-sm opacity-75 self-start md:self-auto">
                © {new Date().getFullYear()} SurferLink
              </p>
            </div>

            {/* Center Section - Menu Links */}
            <div className="text-center md:text-left">
              <h3 className="text-lg font-semibold text-gray-300 mb-3">Menu</h3>
              <div className="grid grid-cols-2 gap-x-24 gap-y-2 text-sm">
                <Link href="#features" className="hover:text-white transition">Features</Link>
                <Link href="#testimonials" className="hover:text-white transition">Testimonials</Link>
                <Link href="#whos-it-for" className="hover:text-white transition">Who’s It For?</Link>
                <Link href="#pricing" className="hover:text-white transition">Pricing</Link>
                <Link href="#seo-toolkit" className="hover:text-white transition">SEO Toolkit</Link>
                <Link href="#faq" className="hover:text-white transition">FAQ</Link>
              </div>
            </div>

            {/* Right Section - Legal Links */}
            <div className="text-center md:text-left">
              <h3 className="text-lg font-semibold text-gray-300 mb-3">Legal</h3>
              <div className="grid grid-cols-1 gap-x-24 gap-y-2 text-sm">
                <Link href="#" className="hover:text-white transition">Privacy Policy</Link>
                <Link href="#" className="hover:text-white transition">Terms of Use</Link>
              </div>
            </div>

          </div>
        </div>
      </footer>

    </main>
  );
}
