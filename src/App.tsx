import React, { Suspense, lazy } from "react";
import { Switch, Route } from "wouter";
import { CMSProvider } from "./components/CMSContext";
import { Home } from "./pages/Home";
import { ScrollToTop } from "./components/ScrollToTop";

// Dynamic code splitting for non-home routes to maximize mobile PageSpeed performance
const About = lazy(() => import("./pages/About").then((m) => ({ default: m.About })));
const ServicesList = lazy(() => import("./pages/ServicesList").then((m) => ({ default: m.ServicesList })));
const ServiceDetails = lazy(() => import("./pages/ServiceDetails").then((m) => ({ default: m.ServiceDetails })));
const Portfolio = lazy(() => import("./pages/Portfolio").then((m) => ({ default: m.Portfolio })));
const Pricing = lazy(() => import("./pages/Pricing").then((m) => ({ default: m.Pricing })));
const Blog = lazy(() => import("./pages/Blog").then((m) => ({ default: m.Blog })));
const BlogPost = lazy(() => import("./pages/BlogPost").then((m) => ({ default: m.BlogPost })));
const Contact = lazy(() => import("./pages/Contact").then((m) => ({ default: m.Contact })));
const Testimonials = lazy(() => import("./pages/Testimonials").then((m) => ({ default: m.Testimonials })));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard").then((m) => ({ default: m.AdminDashboard })));
const Policy = lazy(() => import("./pages/Policy").then((m) => ({ default: m.Policy })));
const CustomPage = lazy(() => import("./pages/CustomPage").then((m) => ({ default: m.CustomPage })));
const NotFound = lazy(() => import("./pages/NotFound").then((m) => ({ default: m.NotFound })));

export default function App() {
  return (
    <CMSProvider>
      <ScrollToTop />
      <Suspense fallback={<div className="min-h-screen bg-white" />}>
        <Switch>
          <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/about/our-story" component={About} />
        <Route path="/about/our-team" component={About} />
        <Route path="/about/why-choose-us" component={About} />
        <Route path="/about/awards" component={About} />
        <Route path="/services" component={ServicesList} />
        <Route path="/services/:slug" component={ServiceDetails} />
        <Route path="/portfolio" component={Portfolio} />
        <Route path="/pricing" component={Pricing} />
        <Route path="/pricing/:category" component={Pricing} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/:slug" component={BlogPost} />
        <Route path="/contact" component={Contact} />
        <Route path="/testimonials" component={Testimonials} />
        <Route path="/privacy-policy" component={Policy} />
        <Route path="/terms-of-service" component={Policy} />
        <Route path="/privacy" component={Policy} />
        <Route path="/terms" component={Policy} />
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/page/:slug" component={CustomPage} />
        <Route path="/:slug" component={CustomPage} />
        <Route component={NotFound} />
        </Switch>
      </Suspense>
    </CMSProvider>
  );
}
