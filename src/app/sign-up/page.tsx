import FloatingBubblesBackground from "components/FloatingBubble";
import Logo from "components/Logo";
import SignUpForm from "components/sign-up/SignUpForm";

interface ISignUpProps {}

const SignUp: React.FC<ISignUpProps> = () => {
  return (
    <div className="flex flex-wrap items-stretch justify-center min-h-[calc(100vh-320px)] p-6">
      <div className="w-full blur-2xl md:block md:w-1/2 md:blur-none">
        <FloatingBubblesBackground />
      </div>
      <div className="flex w-full absolute md:w-1/2 md:relative min-h-[calc(100vh-320px)] rounded-r-2xl md:shadow-2xl">
        <div className="w-full m-auto max-w-xl p-8">
          <h2 className="text-3xl font-bold mb-8 tracking-tighter">
            <Logo />
            Welcome onboard
          </h2>

          <SignUpForm />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
