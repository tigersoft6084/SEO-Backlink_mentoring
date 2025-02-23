import Link from "next/link";
import Image from "next/image";
import { ThumbsUp, Moon, Smartphone, ArrowRightCircle } from "lucide-react";

export default function Home() {
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
      <section className="bg-gray-100 py-16">
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
      <section className="py-20 w-full">
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

      <section>
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

      {/* Pricing Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-24">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white">💰 Pricing</h2>
          <p className="text-lg text-gray-600 dark:text-gray-500 mt-2">
            Choose the plan that works best for you
          </p>

          <div className="flex flex-wrap justify-center gap-10 mt-12">
            <PricingCard
              plan="Starter"
              price="€15/month"
              features={["50 keyword searches", "20 competitor analyses"]}
            />
            <PricingCard
              plan="Pro"
              price="€49/month"
              features={["1000 keyword searches", "100 competitor analyses"]}
            />
            <PricingCard
              plan="Enterprise"
              price="€99/month"
              features={["Unlimited searches", "500 competitor analyses"]}
            />
          </div>
        </div>
      </section>

    </main>
  );
}

/* Feature Card Component */
const FeatureCard = ({ title, description }: { title: string; description: string }) => (
  <div className="p-8 bg-white dark:bg-gray-800 shadow-xl rounded-xl text-center border border-gray-200 dark:border-gray-700">
    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">{title}</h3>
    <p className="mt-3 text-gray-600 dark:text-gray-300">{description}</p>
  </div>
);

/* Pricing Card Component */
const PricingCard = ({ plan, price, features }: { plan: string; price: string; features: string[] }) => (
  <div className="p-8 bg-white dark:bg-gray-800 shadow-lg rounded-2xl w-80 border border-gray-200 dark:border-gray-700">
    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">{plan}</h3>
    <p className="mt-2 text-xl font-bold text-indigo-500">{price}</p>
    <ul className="mt-5 text-gray-600 dark:text-gray-300 space-y-2">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center justify-center space-x-2">
          ✅ <span>{feature}</span>
        </li>
      ))}
    </ul>
    <button className="mt-6 px-5 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full shadow-md text-lg transition-all duration-300 ease-in-out hover:scale-105">
      Get Started
    </button>
  </div>
);
