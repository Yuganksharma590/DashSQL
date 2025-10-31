import { Home, Leaf, Activity, MessageCircle, Trophy, BarChart, Map } from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
    testId: "nav-dashboard",
  },
  {
    title: "Carbon Tracker",
    url: "/tracker",
    icon: Leaf,
    testId: "nav-tracker",
  },
  {
    title: "Activities",
    url: "/activities",
    icon: Activity,
    testId: "nav-activities",
  },
  {
    title: "Eco Coach",
    url: "/coach",
    icon: MessageCircle,
    testId: "nav-coach",
  },
  {
    title: "Rewards",
    url: "/rewards",
    icon: Trophy,
    testId: "nav-rewards",
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart,
    testId: "nav-analytics",
  },
  {
    title: "Map",
    url: "/map",
    icon: Map,
    testId: "nav-map",
  },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary">
            <Leaf className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">GreenMove</h2>
            <p className="text-xs text-muted-foreground">Sustainability Hub</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url} data-testid={item.testId}>
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
