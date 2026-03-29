import {HeroSection} from "@/components/layout/hero/HeroSection";
import {WhatIsNeuron} from "@/components/layout/neuron/WhatIsNeuron";
import {Navbar} from "@/components/layout/hero/Navbar";

export default function Home() {
  return <>
      <Navbar/>
      <HeroSection/>
      <WhatIsNeuron/>
  </>;
}
