import { signIn, signUp, googleAuth } from "@/app/auth/actions";
import AuthCard from "@/components/auth-card";

export default function Page() {
  return (
    <div className="relative flex min-h-dvh w-full items-center justify-center overflow-x-hidden bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="absolute top-[-10%] -left-[-10%] w-48 h-48 sm:w-72 sm:h-72 lg:w-125 lg:h-125 bg-purple-500/10 rounded-full blur-[80px] sm:blur-[128px] -z-10 animate-pulse" />
      <div className="absolute bottom-[-10%] -right-[-10%] w-48 h-48 sm:w-72 sm:h-72 lg:w-125 lg:h-125 bg-blue-500/10 rounded-full blur-[80px] sm:blur-[128px] -z-10" />
      <div className="z-10 w-full flex justify-center">
        <AuthCard onSignIn={signIn} onSignUp={signUp} onGoogleSignIn={googleAuth} />
      </div>
    </div>
  );
}