import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authProvider";
import { toast } from "react-toastify";
import { Icons } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { siteConfig } from "@/config/site";

function SignInModal({
  showSignInModal,
  setShowSignInModal,
}: {
  showSignInModal: boolean;
  setShowSignInModal: Dispatch<SetStateAction<boolean>>;
}) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [signInClicked, setSignInClicked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignInClicked(true);

    try {
      await login(email, password);
      toast.success("Successfully signed in!");
      setTimeout(() => {
        setShowSignInModal(false);
        navigate("/dashboard");
      }, 400);
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage = error?.message || "Sign in failed.";

      if (errorMessage.includes("Invalid login credentials")) {
        toast.error("Invalid credentials. Please check your email and password.");
      } else if (errorMessage.includes("Email not confirmed")) {
        toast.error("Email not confirmed. Please check your inbox.");
      } else {
        toast.error("Sign in failed. Please check your credentials.");
      }
      setSignInClicked(false);
    }
  };

  return (
    <Modal showModal={showSignInModal} setShowModal={setShowSignInModal}>
      <div className="w-full">
        <div className="flex flex-col items-center justify-center space-y-3 border-b bg-background px-4 py-6 pt-8 text-center md:px-16">
          <a href={siteConfig.url}>
            <Icons.logo className="size-10" />
          </a>
          <h3 className="text-2xl font-bold">Sign In</h3>
          <p className="text-sm text-muted-foreground">
            Sign in to access your courses and learning materials
          </p>
        </div>

        <div className="flex flex-col space-y-4 bg-secondary/50 px-4 py-8 md:px-16">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="modal-email"
                className="block text-sm font-medium mb-2"
              >
                Email
              </label>
              <input
                id="modal-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="modal-password"
                className="block text-sm font-medium mb-2"
              >
                Password
              </label>
              <input
                id="modal-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit"
              variant="default"
              disabled={signInClicked}
              className="w-full"
            >
              {signInClicked ? (
                <>
                  <Icons.spinner className="mr-2 size-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <button
              onClick={() => {
                setShowSignInModal(false);
                navigate("/auth/register");
              }}
              className="text-primary hover:underline font-medium"
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export function useSignInModal() {
  const [showSignInModal, setShowSignInModal] = useState(false);

  const SignInModalCallback = useCallback(() => {
    return (
      <SignInModal
        showSignInModal={showSignInModal}
        setShowSignInModal={setShowSignInModal}
      />
    );
  }, [showSignInModal, setShowSignInModal]);

  return useMemo(
    () => ({
      setShowSignInModal,
      SignInModal: SignInModalCallback,
    }),
    [setShowSignInModal, SignInModalCallback],
  );
}
