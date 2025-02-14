import { FcGoogle } from "react-icons/fc";
// import { handleGoogleAuth } from "../../utils/googleAuth";
// import { useSession } from "next-auth/react";

interface GoogleAuthButtonProps {
  action: 'signin' | 'signup'; // Action can either be 'signin' or 'signup'
}

const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({ action }) => {

  // const { data: session } = useSession()

  const buttonText = action === 'signin' ? 'Sign In with Google' : 'Sign Up with Google';

  // Async function for handling the Google authentication process
  const handleClick = async () => {
    try {
      // Trigger Google Auth
      // await handleGoogleAuth(action);
    } catch (error) {
      console.error(`Error during ${action} process:`, error);
    }
  };

  // if(session){
  //   return (
  //     <>
  //       Signed in as {session?.user?.email} <br />
  //       <button onClick={() => signOut()}>Sign out</button>
  //     </>
  //   )
  // }
  return (
    <button
      onClick={handleClick} // Using the async handleClick function
      className={`flex items-center justify-center gap-x-2 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:text-gray-200 dark:hover:bg-gray-600 ${
        action === 'signup' ? 'w-auto' : 'w-full' // Adjust width based on action
      }`}
      aria-label={buttonText} // Added accessibility label for better screen reader support
    >
      <FcGoogle />
      <span>{buttonText}</span>
    </button>
  );
};

export default GoogleAuthButton;