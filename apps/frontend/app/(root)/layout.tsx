import React from 'react';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { AppSidebar } from '@/components/navigation/app-sidebar';
import { Separator } from '@/components/ui/separator';
import { Provider } from '@/app/(root)/Provider';
import {ShellHeader} from "@/components/navigation/shell-header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider>
      <AppSidebar />
      <SidebarInset>
          <ShellHeader />
        {children}
      </SidebarInset>
    </Provider>
  );
}
