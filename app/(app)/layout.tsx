"use client"
import { assistantatom, userthreadatom } from "@/atoms";
import Navbar from "@/components/Navbar";
import useServiceWorker from "@/hooks/useServiceWorker";
import axios from "axios";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>

) {
  const [, setUserthread] = useAtom(userthreadatom)
  const [Assistant, setAssistant] = useAtom(assistantatom);

  useServiceWorker();

  useEffect(() => {
    if (Assistant) return;
    setAssistant(process.env.NEXT_PUBLIC_GOGGINS_ASSISTANT_ID)
  }, [setAssistant, Assistant]);
  interface UserThreadType {
    ThreadId: string,
    UserId: string,
    date: string
    // Add other properties if they exist
  }

  useEffect(() => {

    async function getuserthread(retries = 3) {
      while (retries > 0) {
        try {

          const response = await axios.get<{
            success: boolean,
            message?: string,
            userThread?: UserThreadType

          }>('/api/user-thread');
          if (!response.data.success || !response.data.userThread) {
            console.error(response.data.message ?? "Unknown error");
            setUserthread(null);
            return
          }
          setUserthread(response.data.userThread);
          return;

        } catch (error) {
          console.log(error);
          setUserthread(null);
          retries--;
          if (retries === 0) throw error;
        }

      }



    }
    getuserthread();
    //..............................
  }, [setUserthread])
  //save subscription
  useEffect(() => {
    if ("Notification" in window) {
      // setNotificationModalvisible(Notification.permission === "default")
    }
  }, [])
  return (
    <div className="flex flex-col w-full h-full">
      <Navbar />
      {children}
      <Toaster />
    </div>
  );
}