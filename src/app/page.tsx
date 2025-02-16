"use client";

import FloatingBubblesBackground from "./components/FloatingBubble";
import Logo from "./components/Logo";
import LogoWithTabSync from "./components/LogoWithTabSync";
import SignInForm from "./components/SignInForm";

interface IHomeProps {}

const Home: React.FC<IHomeProps> = () => {
  return (
    <div className="flex flex-wrap items-center justify-center min-h-screen">
      <div className="hidden md:block w-1/2">
        <FloatingBubblesBackground />
      </div>
      <div className="w-full md:w-1/2 p-12">
        <h2 className="text-3xl font-bold mb-8 tracking-tighter">
          <Logo />
          TabSync
        </h2>

        <SignInForm />
      </div>
    </div>
  );
};

export default Home;
