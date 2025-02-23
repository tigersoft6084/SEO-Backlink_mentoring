import Link from "next/link";
import Image from "next/image";

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

      {/* Features Section */}
      <section className="container mx-auto px-8 py-24">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 dark:text-white">✨ Core Features</h2>
        <p className="text-lg text-gray-600 dark:text-gray-500 text-center mt-2">
          Everything you need to power up your SEO strategy
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 mt-12">
          <FeatureCard
            title="🔍 Competitive Analysis"
            description="Easily compare backlinks from different domains and get valuable insights."
          />
          <FeatureCard
            title="📊 Data Insights"
            description="Find hidden backlinks, missed opportunities, and analyze competitor strategies."
          />
          <FeatureCard
            title="💰 Smarter Budgeting"
            description="Discover the best backlink opportunities with minimal effort."
          />
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
