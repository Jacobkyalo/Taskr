"use client";

import { createContext, useState } from "react";
import { useRouter } from "next/navigation";
import { ID } from "appwrite";
import { account } from "@/lib/appwrite.config";
import { toast } from "@/components/ui/use-toast";

export const AuthContext = createContext(null);

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  // const toast = useToast();
  const router = useRouter();

  const signupUser = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      await account.create(ID.unique(), email, password, name);
      setLoading(false);
      await account.createEmailSession(email, password);

      let accountDetails = await account.get();
      setUser(accountDetails);

      toast({
        title: "Success!",
        description: "Account created successfully",
      });
      router.push("/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // const loginUser = async (email, password) => {
  //   try {
  //     setLoading(true);
  //     await account.createEmailSession(email, password);
  //     setLoading(false);

  //     let accountDetails = await account.get();
  //     setUser(accountDetails);

  //     toast.success("Login successful");
  //     navigate("/");
  //   } catch (error) {
  //     toast.error(error.message);
  //     setLoading(false);
  //   }
  // };

  // const logoutUser = async () => {
  //   try {
  //     setLoading(true);
  //     await account.deleteSession("current");
  //     setLoading(false);
  //     setUser(null);
  //     localStorage.removeItem("cookieFallback");

  //     toast.success("Logout successful");
  //     navigate("/auth/login");
  //   } catch (error) {
  //     toast.error(error.message);
  //     setLoading(false);
  //   }
  // };

  // const persistUser = async () => {
  //   try {
  //     let accountDetails = await account.get();
  //     setUser(accountDetails);
  //   } catch (error) {
  //     toast.error(error.message);
  //   }
  // };

  // const createPasswordRecovery = async (email) => {
  //   try {
  //     setLoading(true);
  //     await account.createRecovery(
  //       email,
  //       "https://ic-chatroom.vercel.app/account/reset-password",
  //     );
  //     setLoading(false);

  //     toast.success("Password recovery email sent to your email inbox or spam");
  //     navigate("/auth/login");
  //   } catch (error) {
  //     toast.error(error.message);
  //     setLoading(false);
  //   }
  // };

  // const updatePasswordRecovery = async (
  //   userId,
  //   secret,
  //   password,
  //   passwordAgain,
  // ) => {
  //   try {
  //     setLoading(true);
  //     await account.updateRecovery(userId, secret, password, passwordAgain);
  //     setLoading(false);

  //     toast.success("Password reset successfully");
  //     navigate("/auth/login");
  //   } catch (error) {
  //     toast.error(error.message);
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   persistUser();
  // }, []);

  const values: any = {
    user,
    signupUser,
    // loginUser,
    // logoutUser,
    // createPasswordRecovery,
    // updatePasswordRecovery,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}
