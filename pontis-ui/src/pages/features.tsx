import React from "react";
import { CodeIcon, ChatIcon } from "@heroicons/react/outline";
import SectionContainer from "../components/common/SectionContainer";
import Header from "../components/Header";
import CTASection from "../components/CTASection";
import FAQ from "../components/FAQ";
import FeaturesDisplay from "../components/Features/FeaturesDisplay";
import TimelineExplanation from "../components/TimelineExplanation";

const FeaturesPage = () => {
  return (
    <div className="w-screen">
      <SectionContainer className="bg-slate-50">
        <Header
          title="Reimagining oracles"
          subtitle="Meet our compute engine"
          text="Sit laboris adipisicing id culpa veniam magna Lorem occaecat laboris."
          href="#"
          hrefText="Integrate verifyable data into your project"
        />
        <FeaturesDisplay />
      </SectionContainer>
      <SectionContainer>
        <Header
          title="A closer look"
          subtitle="How it works"
          text="Sit laboris adipisicing id culpa veniam magna Lorem occaecat laboris."
        />
        <TimelineExplanation />
      </SectionContainer>
      <SectionContainer>
        <FAQ />
      </SectionContainer>
      <SectionContainer className="sm:!px-0">
        <CTASection
          title="Ready to get the data you need?"
          description="Leverage recent breakthroughs in zero knowledge computation by using verifyable and composable data in your application."
          mainAction={{
            href: "/",
            actionText: "Read the docs",
            icon: CodeIcon,
          }}
          secondaryAction={{
            href: "mailto:oskar@42labs.xyz?body=Hi%20Oskar,",
            actionText: "Request asset",
            icon: ChatIcon,
          }}
        />
      </SectionContainer>
    </div>
  );
};

export default FeaturesPage;
