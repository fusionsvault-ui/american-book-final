import React from "react";
import { Switch, Route } from "wouter";
import { CMSProvider } from "./components/CMSContext";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { ServicesList } from "./pages/ServicesList";
import { ServiceDetails } from "./pages/ServiceDetails";
import { Portfolio } from "./pages/Portfolio";
import { Pricing } from "./pages/Pricing";
import { Blog } from "./pages/Blog";
import { Contact } from "./pages/Contact";
import { Testimonials } from "./pages/Testimonials";
import { AdminDashboard } from "./pages/AdminDashboard";
import { NotFound } from "./pages/NotFound";

export default function App() {
  return (
    <CMSProvider>
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
        <Route path="/contact" component={Contact} />
        <Route path="/testimonials" component={Testimonials} />
        <Route path="/admin" component={AdminDashboard} />
        <Route component={NotFound} />
      </Switch>
    </CMSProvider>
  );
}
