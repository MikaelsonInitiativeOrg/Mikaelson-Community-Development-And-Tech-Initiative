import { SiteFooter } from "@/components/site/site-footer";
import Header from "@/features/website/components/header";
import React, { PropsWithChildren } from "react";

const WebsiteRootLayout = ({ children }: PropsWithChildren) => {
  return (
    <main className="dark:bg-brand-dark-bg-nav">
      <Header />
      {children}
      <SiteFooter />
    </main>
  );
};

export default WebsiteRootLayout;
