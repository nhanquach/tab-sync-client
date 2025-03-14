import FloatingBubblesBackground from "components/FloatingBubble";
import Logo from "components/Logo";
import SignUpForm from "components/sign-up/SignUpForm";

interface ISignUpProps {}

const SignUp: React.FC<ISignUpProps> = () => {
  return (
    <div className="flex flex-wrap items-center justify-center min-h-screen">
      <div className="w-full blur-2xl md:block md:w-1/2 md:blur-none">
        <FloatingBubblesBackground />
      </div>
      <div className="w-full p-12 absolute md:w-1/2 md:relative">
        <h2 className="text-3xl font-bold mb-8 tracking-tighter">
          <Logo />
          Welcome onboard
        </h2>

        <SignUpForm />
      </div>
    </div>
  );
};

export default SignUp;
