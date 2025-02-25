import FloatingBubblesBackground from "@components/FloatingBubble";
import Logo from "@components/Logo";
import LogInForm from "@components/login/LogInForm";

interface IHomeProps {}

const Home: React.FC<IHomeProps> = () => {
  return (
    <div className="flex flex-wrap items-center justify-center min-h-screen">
      <div className="w-full blur-2xl md:block md:w-1/2 md:blur-none">
        <FloatingBubblesBackground />
      </div>
      <div className="w-full p-12 absolute md:w-1/2 md:relative max-w-xl m-auto">
        <h2 className="text-3xl font-bold mb-8 tracking-tighter flex gap-2 items-center">
          <Logo className="bg-primary" />
          TabSync
        </h2>

        <LogInForm />
      </div>
    </div>
  );
};

export default Home;
