import React from "react";
import { Link } from "wouter";
import { Layout } from "../components/Layout";
import { WavingFlag } from "../components/WavingFlag";

export const NotFound: React.FC = () => {
  return (
    <Layout title="404 Page Not Found">
      <section className="py-24 text-center bg-cream flex flex-col justify-center items-center min-h-[60vh]">
        <div className="container mx-auto px-4 max-w-md space-y-6">
          <div className="flex justify-center rotate-3 scale-110 mb-4">
            <WavingFlag className="w-24 h-16 shadow-2xl rounded" />
          </div>
          <h1 className="text-6xl font-serif font-black text-navy leading-none">404</h1>
          <h2 className="text-xl font-bold text-gray-800">Page Not Found</h2>
          <p className="text-gray-550 text-sm leading-relaxed">
            The publishing coordinates you requested do not exist or were updated recently. Let's return to the safety of our homepage drafts.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="bg-navy hover:bg-gold hover:text-navy text-white font-extrabold px-6 py-3 rounded-lg text-xs md:text-sm uppercase tracking-wider transition-colors inline-block"
            >
              Return Home
            </Link>
            <Link
              href="/services"
              className="bg-white border border-gray-200 text-gray-700 hover:border-gold hover:text-gold font-extrabold px-6 py-3 rounded-lg text-xs md:text-sm uppercase tracking-wider transition-colors inline-block"
            >
              Our Services
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};
