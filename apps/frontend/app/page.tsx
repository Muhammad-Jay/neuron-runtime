import {HeroSection} from "@/components/layout/hero/HeroSection";
import {WhatIsNeuron} from "@/components/layout/neuron/WhatIsNeuron";
import {Navbar} from "@/components/layout/hero/Navbar";
import {Footer} from "@/components/layout/footer/Footer";
import NeuronPipelineSection from "@/components/layout/neuron/NeuronPipelineSection";

export default function Home() {
  return <>
      <Navbar/>
      <HeroSection/>
      <NeuronPipelineSection/>
      <Footer/>
  </>;
}
