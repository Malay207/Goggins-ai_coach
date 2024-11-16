// This will be replaced by Workbox with the list of assets to precache
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
self.__WB_MANIFEST;

self.addEventListener("push", function (event) {
  const data = event.data.text();
  const title = data || "A new message!";
  const options = {
    body: data.body || "You have a new notification.",
    icon: "/images/icon-192x192.png",
    badge: "/images/icon-72x72.png",
  };

  event.waitUntil(self.registration.showNotification(title, options));
});