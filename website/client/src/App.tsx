import { Route, Switch } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Features from "@/pages/Features";
import CreatureTribes from "@/pages/CreatureTribes";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import Merch from "@/pages/Merch";

import Download from "@/pages/Download";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/not-found";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import LaunchCampaign from "@/pages/LaunchCampaign";
import Blog from "@/pages/Blog";
import StrugglesOfRemoteWork from "@/pages/blog/StrugglesOfRemoteWork";
import AvoidCabinFever from "@/pages/blog/AvoidCabinFever";
import TheScienceOfCoffee from "@/pages/blog/TheScienceOfCoffee";
import BeyondTheBean from "@/pages/blog/BeyondTheBean";
import TheArtOfThePowerNap from "@/pages/blog/TheArtOfThePowerNap";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/features" component={Features} />
          <Route path="/tribes" component={CreatureTribes} />
          <Route path="/merch" component={Merch} />
          <Route path="/launch-campaign" component={LaunchCampaign} />
          <Route path="/blog" component={Blog} />
          <Route path="/blog/struggles-of-remote-work" component={StrugglesOfRemoteWork} />
          <Route path="/blog/avoid-cabin-fever" component={AvoidCabinFever} />
          <Route path="/blog/science-of-coffee" component={TheScienceOfCoffee} />
          <Route path="/blog/beyond-the-bean" component={BeyondTheBean} />
          <Route path="/blog/art-of-the-power-nap" component={TheArtOfThePowerNap} />
          <Route path="/download" component={Download} />
          <Route path="/contact" component={Contact} />
          <Route path="/privacy-policy" component={PrivacyPolicy} />
          <Route path="/terms-of-service" component={TermsOfService} />
          <Route path="/admin/login" component={AdminLogin} />
          <Route path="/admin/dashboard" component={AdminDashboard} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

export default App;
