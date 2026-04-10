'use client';

import * as React from 'react';
import {
    AudioWaveform,
    BookOpen,
    Bot,
    Command,
    Frame,
    GalleryVerticalEnd,
    Map,
    PieChart,
    Settings2,
    SquareTerminal,
    Workflow,
    LayoutDashboard,
    Activity,
    CalendarClock, Zap, SaveIcon,
} from 'lucide-react';

import { NavMain } from '@/components/navigation/nav-main';
import { NavProjects } from '@/components/navigation/nav-projects';
import { NavUser } from '@/components/navigation/nav-user';
import { TeamSwitcher } from '@/components/navigation/team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { NavRoutes } from '@/components/navigation/nav-routes';
import { useAuth } from '@/hooks/useAuth';

const data = {
  routes: [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Workflows',
      href: '/dashboard/workflows',
      icon: Workflow,
    },
    {
      name: 'Executions',
      href: '/dashboard/executions',
      icon: Activity,
    },
    {
      name: 'Schedules',
      href: '/dashboard/schedules',
      icon: CalendarClock,
    },
  ],
  teams: [
    {
      name: 'Neuron',
      logo: Zap,
      plan: 'Orchestrator',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: Command,
      plan: 'Free',
    },
  ],
  navMain: [
    {
      title: 'Playground',
      url: '#',
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: 'History',
          url: '#',
        },
        {
          title: 'Starred',
          url: '#',
        },
        {
          title: 'Settings',
          url: '#',
        },
      ],
    },
    {
      title: 'Models',
      url: '#',
      icon: Bot,
      items: [
        {
          title: 'Genesis',
          url: '#',
        },
        {
          title: 'Explorer',
          url: '#',
        },
        {
          title: 'Quantum',
          url: '#',
        },
      ],
    },
    {
      title: 'Documentation',
      url: '#',
      icon: BookOpen,
      items: [
        {
          title: 'Introduction',
          url: '#',
        },
        {
          title: 'Get Started',
          url: '#',
        },
        {
          title: 'Tutorials',
          url: '#',
        },
        {
          title: 'Changelog',
          url: '#',
        },
      ],
    },
    {
      title: 'Settings',
      url: '/dashboard/settings',
      icon: Settings2,
      items: [
        {
          title: 'General',
          url: '/settings',
            icon: Workflow,
        },
          {
              title: 'Integrations',
              url: '/dashboard/settings/integrations',
              icon: Zap,
          },
          {
              title: 'Vault',
              url: '/dashboard/settings/vault',
              icon: SaveIcon,
          },
      ],
    },
  ],
  projects: [
    {
      name: 'Design Engineering',
      url: '/dashboard/settings',
      icon: Frame,
    },
    {
      name: 'Sales & Marketing',
      url: '#',
      icon: PieChart,
    },
    {
      name: 'Travel',
      url: '#',
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, signOut } = useAuth();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavRoutes routes={data.routes} />
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} logout={signOut} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
