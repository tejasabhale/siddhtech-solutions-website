import React, { useState } from "react";
import "../../components/home/home.css";

import Hero from "../../components/home/Hero.jsx";
import Services from "../../components/home/Services.jsx";
import Work from "../../components/home/Work.jsx";
import Process from "../../components/home/Process.jsx";
import Approach from "../../components/home/Approach.jsx";
import Pricing from "../../components/home/Pricing.jsx";
import Contact from "../../components/home/Contact.jsx";

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "Web & App Development",
    budget: "₹39,999 (Growth Tier)",
    details: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const chooseTier = (tier) => {
    setFormData((previous) => ({
      ...previous,
      budget: `${tier.startingPrice} (${tier.name} Tier)`,
    }));
  };

  return (
    <div className="ns-home min-h-screen bg-[#F5F1E8] text-[#191919] selection:bg-[#D94F35] selection:text-white">
      <Hero />
      <Services />
      <Work />
      <Process />
      <Approach />
      {/* <Pricing onChoose={chooseTier} /> */}

      <Contact
        formData={formData}
        setFormData={setFormData}
        submitted={submitted}
        setSubmitted={setSubmitted}
      />
    </div>
  );
}