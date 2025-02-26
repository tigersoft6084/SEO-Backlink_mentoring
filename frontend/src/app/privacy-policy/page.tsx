"use client";

export default function Privacy() {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 px-6 py-12 mt-14">
            <div className="max-w-3xl bg-white shadow-lg rounded-2xl p-8 space-y-6">
                <h1 className="text-3xl font-bold text-gray-800 text-center">Privacy Policy</h1>
                <p className="text-gray-600">
                    Surferlink is committed to protecting the privacy of its users. This Privacy Policy describes the types of
                    personal data we collect, how we use and share them, and the rights you have as a user.
                </p>

                <section>
                    <h2 className="text-xl font-semibold text-gray-700">Collection of Personal Data</h2>
                    <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                        <li>Full name</li>
                        <li>Email address</li>
                        <li>IP address</li>
                    </ul>
                    <p className="text-gray-600 mt-2">
                        We also use cookies to keep your session active and rely on Google Analytics to analyze the usage of our site.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-700">Use of Data</h2>
                    <p className="text-gray-600">
                        Your data is used to:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                        <li>Improve our service</li>
                        <li>Contact you by email to introduce new offers or features</li>
                    </ul>
                    <p className="text-gray-600 mt-2">
                        You can unsubscribe from these communications at any time.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-700">Data Sharing</h2>
                    <p className="text-gray-600">
                        We do not share your personal information with third parties. The collected data is exclusively used for the 
                        purposes mentioned above.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-700">Data Storage and Security</h2>
                    <p className="text-gray-600">
                        Your data is stored on our secure servers and treated confidentially. We take all necessary measures to protect 
                        your data from unauthorized access, disclosure, modification, or destruction.
                    </p>
                    <p className="text-gray-600 mt-2">
                        We retain your data as long as necessary to provide our services and for internal record-keeping.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-700">User Rights</h2>
                    <p className="text-gray-600">
                        You have the right to:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                        <li>Access your personal data</li>
                        <li>Request correction or deletion of your data</li>
                    </ul>
                    <p className="text-gray-600 mt-2">
                        To exercise these rights, please contact us via our support or by email.
                    </p>
                    <p className="text-gray-600 mt-2">
                        Users who wish to have their site removed from our platform can fill out a removal form.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-700">International Transfers</h2>
                    <p className="text-gray-600">
                        We do not transfer your data outside the European Economic Area or to other territories offering a comparable
                        level of data protection.
                    </p>
                    </section>

                    <section>
                    <h2 className="text-xl font-semibold text-gray-700">Payments</h2>
                    <p className="text-gray-600">
                        For payments, we use Paypal, which may process your payment information according to its own privacy policy.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-700">Data Controller</h2>
                    <p className="text-gray-600">
                        The data controller is <span className="font-medium">APEXX LLC</span>. For any questions or concerns about this
                        privacy policy, please contact us.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-700">Changes to the Privacy Policy</h2>
                    <p className="text-gray-600">
                        We reserve the right to modify this privacy policy at any time. Changes will take effect upon their publication
                        on our site. We encourage you to review this page regularly.
                    </p>
                </section>
            </div>
        </div>
    );
}
