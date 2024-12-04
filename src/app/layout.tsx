"use client";
import "~/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { TRPCReactProvider } from "~/trpc/react";
import NavBar from "../_components/navBar";
import { usePathname } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import Notification from "~/_components/Notifications";
import "react-toastify/dist/ReactToastify.css";
import WithAuth from "~/_components/Auth/WithAuth";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const [queryClient] = useState(() => new QueryClient());
  const isLoginPage =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/new-password" ||
    pathname === "/forget-password" ||
    pathname === "/otp" ||
    pathname === "/confirm-account" ||
    pathname === "/choose-account";
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <head>
        <title>EduAI Parent</title>
        <meta name="description" content="Edu AI-Parent" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </head>
      <body className="bg-bgSecondary">
      <WithAuth excludePaths={['/login', '/signup']}>
      <QueryClientProvider client={queryClient}>
        {!isLoginPage && <NavBar />}
        <Notification />
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </QueryClientProvider>
      </WithAuth>
      </body>
    </html>
  );
}
