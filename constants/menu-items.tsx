import { 
    Calendar, 
    DollarSign, 
    Users, 
    Home, 
    Settings, 
    Bell
  } from "lucide-react";
  
  export interface MenuItem {
    title: string;
    href: string;
    icon: React.ReactNode;
  }
  
  // You can later make this a function if you need workspaceId or role-based menus
  export const MENU_ITEMS: MenuItem[] = [
    {
      title: "Home",
      href: "/dashboard",
      icon: <Home size={18} />
    },
    {
      title: "Time Table Generation",
      href: "/dashboard/timetable",
      icon: <Calendar size={18} />
    },
    {
      title: "Remuneration",
      href: "/dashboard/remuneration",
      icon: <DollarSign size={18} />
    },
    {
      title: "Seating Arrangement",
      href: "/dashboard/seating",
      icon: <Users size={18} />
    },
    {
      title:"Notification",
      href:'/dashboard/notification',
      icon:<Bell size={18}/>
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: <Settings size={18} />
    }
  ];
  