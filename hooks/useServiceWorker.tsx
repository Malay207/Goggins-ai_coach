import { useEffect } from "react";
import toast from "react-hot-toast";

function useServiceWorker() {
    useEffect(() => {
        async function register_serviceworker() {
            if ("serviceWorker" in navigator) {
                try {
                    const registrations = await navigator.serviceWorker.getRegistrations();
                    //assume the first registration is that we want and unregister other them
                    if (registrations.length) {
                        for (let i = 1; i < registrations.length; i++) {
                            registrations[i].unregister();
                            console.log(`Unregistered service worker at ${registrations[i].scope}`);

                        }
                        //if service worker not present then register
                    } else {
                        const registrations = await navigator.serviceWorker.register("/sw.js");
                        console.log(`Service worker registered at ${registrations.scope}`);
                    }
                    //check service worker ready 
                    const registration = await navigator.serviceWorker.ready;
                    console.log(`Service worker is ready! ${registration}`);
                    //check service worker need any update
                    if (registration) {
                        registration.onupdatefound = () => {
                            const installing = registration?.installing;
                            if (installing) {
                                installing.onstatechange = () => {
                                    if (installing.state == "installed") {
                                        toast.success("New or updated Service Worker is installed")
                                    }
                                }
                            }
                        }
                    }

                } catch (error) {
                    console.error('Error registering service worker:', error);
                }
            }

        }
        register_serviceworker(); //
    }, [])


}
export default useServiceWorker;