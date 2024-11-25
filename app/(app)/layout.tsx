"use client"
import { assistantatom, userthreadatom } from "@/atoms";
import Navbar from "@/components/Navbar";
import NotificationModel from "@/components/NotificationModel";
import useServiceWorker from "@/hooks/useServiceWorker";
import axios from "axios";
import { useAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>

) {
  //atom state
  const [, setUserthread] = useAtom(userthreadatom)
  const [Assistant, setAssistant] = useAtom(assistantatom);

  //regular state
  const [NotificationModalvisible, setNotificationModalvisible] = useState(false);

  //hooks
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
      setNotificationModalvisible(Notification.permission === "default")
    }
  }, [])
  const Notificationclose = (didcontent: boolean) => {
    setNotificationModalvisible(false);
    if (didcontent) {
      toast.success("You will now recieve notifications");
    }
  }
  const savesubscription = useCallback(async () => {
    const serviceworkerregistration = await navigator.serviceWorker.ready;
    const subscription = await serviceworkerregistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
    })
    try {
      const response = await axios.post("/api/subscriptions", subscription)
      if (!response.data.success) {
        console.error(response.data.message ?? "Unknown error");
        toast.error("Failed to save subscription");
        return;
      }

    } catch (error) {
      console.error(error);
      toast.error("Failed to save subscription");

    }
  }, [])
  useEffect(() => {
    if ("Notification" in window && "serviceWorker" in navigator) {
      if (Notification.permission === "granted") {
        savesubscription();
      }
    }
  }, [savesubscription]);
  return (
    <div className="flex flex-col w-full h-full">
      <Navbar />
      {children}
      {NotificationModalvisible && (
        <NotificationModel
          onrequestclose={Notificationclose}
          savesubscription={savesubscription}
        />
      )}
      <Toaster />
    </div>
  );
}