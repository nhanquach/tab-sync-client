import FloatingBubblesBackground from "@components/FloatingBubble";
import Logo from "@components/Logo";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full blur-2xl md:block md:w-1/2 md:blur-none">
        <FloatingBubblesBackground />
      </div>
      <div className="w-full p-12 absolute md:w-1/2 md:relative">
        <h2 className="text-3xl font-bold mb-8 tracking-tighter">
          <Logo />
          TabSync
        </h2>
      </div>
    </div>
  );
};

export default Home;
