"use client";

import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ID } from "appwrite";
import { account } from "@/lib/appwrite.config";
import { toast } from "@/components/ui/use-toast";
export interface UserProps {
  $id?: string;
  $createdAt?: string;
  $updatedAt?: string;
  name?: string;
  password?: string;
  hash?: string;
  hashOptions?: {
    type?: string;
    memoryCost?: number;
    timeCost?: number;
    threads?: number;
  };
  labels?: string[];
  passwordUpdate?: string;
  phone?: string;
  emailVerification?: boolean;
  phoneVerification?: boolean;
  prefs?: {};
  accessedAt?: string;
  email?: string;
  registration?: string;
  status?: boolean;
}

export interface AuthContextProps {
  user: UserProps;
  loading: false;
  signupUser: (email: string, password: string, name: string) => {};
  loginUser: (email: string, password: string) => {};
  logoutUser: () => void;
  createPasswordRecovery: (email: string) => {};
  updatePasswordRecovery: (
    userId: string,
    secret: string,
    password: string,
    passwordAgain: string
  ) => {};
}

export const AuthContext = createContext<AuthContextProps>(
  {} as AuthContextProps
);

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<UserProps | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const signupUser = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      await account.create(ID.unique(), email, password, name);
      setLoading(false);
      await account.createEmailSession(email, password);

      let accountDetails: UserProps = await account.get();
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

  const loginUser = async (email: string, password: string) => {
    try {
      setLoading(true);
      await account.createEmailSession(email, password);
      setLoading(false);

      let accountDetails = await account.get();
      setUser(accountDetails);

      toast({
        title: "Success!",
        description: "Login successful",
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

  const logoutUser = async () => {
    try {
      setLoading(true);
      await account.deleteSession("current");
      setLoading(false);
      localStorage.removeItem("cookieFallback");
      setUser(undefined); // Pass an empty value as an argument to setUser

      toast({
        title: "Success!",
        description: "Logout successful",
      });
      router.push("/login");
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

  const persistUser = async () => {
    try {
      let accountDetails = await account.get();
      setUser(accountDetails);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message,
      });
    }
  };

  const createPasswordRecovery = async (email: string) => {
    try {
      setLoading(true);
      await account.createRecovery(
        email,
        process.env.NEXT_PUBLIC_NODE_ENV === "production"
          ? process.env.NEXT_PUBLIC_URI_PARAM_PRODUCTION || ""
          : process.env.NEXT_PUBLIC_URI_PARAM_DEV || ""
      );
      setLoading(false);

      toast({
        title: "Success!",
        description:
          "Password recovery email sent to your email inbox or spam folder",
      });
      router.push("/login");
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

  const updatePasswordRecovery = async (
    userId: string,
    secret: string,
    password: string,
    passwordAgain: string
  ) => {
    try {
      setLoading(true);
      await account.updateRecovery(userId, secret, password, passwordAgain);
      setLoading(false);

      toast({
        title: "Success!",
        description: "Password reset successfully",
      });
      router.push("/login");
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

  useEffect(() => {
    if (localStorage.getItem("cookieFallback")) {
      persistUser();
    }
  }, []);

  const values: any = {
    user,
    loading,
    signupUser,
    loginUser,
    logoutUser,
    createPasswordRecovery,
    updatePasswordRecovery,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}
