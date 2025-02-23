import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center bg-gray-100 dark:bg-slate-900 mt-36">

      {/* Hero Section */}
      <section className="text-center py-20 bg-gray-50 dark:bg-gray-900">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Boost Your Rankings <br /> with Backlink Insights
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mt-4">
          Analyze backlinks, uncover missed links, and optimize your strategy to outperform competitors.
        </p>
        <button className="mt-6 px-6 py-3 bg-primary text-white rounded-lg hover:bg-indigo-600">
          Start Free Analysis Now
        </button>
      </section>

            {/* Features Section */}
            <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-semibold text-center text-gray-800 dark:text-white">Core Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <FeatureCard
            title="Competitive Analysis Made Easy"
            description="Easily compare backlinks from different domains and get valuable insights."
          />
          <FeatureCard
            title="Detailed Insights at a Glance"
            description="Find hidden backlinks, missed opportunities, and analyze competitor strategies."
          />
          <FeatureCard
            title="Smarter Budgeting"
            description="Discover the best backlink opportunities with minimal effort."
          />
        </div>
      </section>

            {/* Pricing Section */}
            <section className="bg-gray-100 dark:bg-gray-800 py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">Pricing</h2>
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <PricingCard plan="Standard" price="€15/month" features={["50 keyword searches", "20 competitor analyses"]} />
            <PricingCard plan="Booster" price="€49/month" features={["1000 keyword searches", "100 competitor analyses"]} />
            <PricingCard plan="Elite" price="€99/month" features={["Unlimited searches", "500 competitor analyses"]} />
          </div>
        </div>
      </section>


    </main>

  );
}


// Feature Card Component
const FeatureCard = ({ title, description }: { title: string; description: string }) => (
  <div className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg text-center">
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
    <p className="mt-2 text-gray-600 dark:text-gray-300">{description}</p>
  </div>
);

// Pricing Card Component
const PricingCard = ({ plan, price, features }: { plan: string; price: string; features: string[] }) => (
  <div className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg w-72">
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{plan}</h3>
    <p className="mt-2 text-gray-600 dark:text-gray-300">{price}</p>
    <ul className="mt-4 text-gray-600 dark:text-gray-300">
      {features.map((feature, index) => (
        <li key={index}>✅ {feature}</li>
      ))}
    </ul>
    <button className="mt-6 px-4 py-2 bg-primary text-white rounded-lg">Get Started</button>
  </div>
);
