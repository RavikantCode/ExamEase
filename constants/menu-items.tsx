// import { 
//     Calendar, 
//     DollarSign, 
//     Users, 
//     Home, 
//     Settings, 
//     Bell
//   } from "lucide-react";
  
//   export interface MenuItem {
//     title: string;
//     href: string;
//     icon: React.ReactNode;
//   }
  
//   // You can later make this a function if you need workspaceId or role-based menus
//   export const MENU_ITEMS: MenuItem[] = [
//     {
//       title: "Home",
//       href: "/dashboard",
//       icon: <Home size={18} />
//     },
//     {
//       title: "Time Table Generation",
//       href: "/dashboard/timetable",
//       icon: <Calendar size={18} />
//     },
//     {
//       title: "Remuneration",
//       href: "/dashboard/remuneration",
//       icon: <DollarSign size={18} />
//     },
//     {
//       title: "Seating Arrangement",
//       href: "/dashboard/seating",
//       icon: <Users size={18} />
//     },
//     {
//       title:"Notification",
//       href:'/dashboard/notification',
//       icon:<Bell size={18}/>
//     },
//     {
//       title: "Settings",
//       href: "/dashboard/settings",
//       icon: <Settings size={18} />
//     }
//   ];
  

// constants/menu-items.tsx
import { 
  Calendar, 
  DollarSign, 
  Users, 
  Home, 
  Settings, 
  Bell
} from "lucide-react";
import FacultyRemunerationIcon from "@/components/ui/FacultyRenumerationIcon";
import AcademicTimeTableIcon from "@/components/ui/AcademicTimetable";

export interface MenuItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  roles: ('ADMIN' | 'FACULTY')[]; // Add roles field
}

export const MENU_ITEMS: MenuItem[] = [
  {
    title: "Home",
    href: "/dashboard",
    icon: <Home size={18} />,
    roles: ['ADMIN', 'FACULTY'] // Both can access
  },
  {
    title: "Time Table Generation",
    href: "/dashboard/timetable",
    icon: <Calendar size={18} />,
    roles: ['ADMIN'] // Only admin
  },
  {
    title: "Remuneration",
    href: "/dashboard/remuneration",
    icon: <DollarSign size={18} />,
    roles: ['FACULTY'] // Both can access
  },
  {
    title: "Faculty Remuneration",
    href: "/dashboard/faculty-renumeration",
    // icon: <DollarSign size={18} />,
    icon:<FacultyRemunerationIcon></FacultyRemunerationIcon>,
    roles: ['ADMIN'] // Both can access
  },
  {
    title: "Seating Arrangement",
    href: "/dashboard/seating",
    icon: <Users size={18} />,
    roles: ['ADMIN'] // Only admin
  },
  {
    title: "Academic Timetable",
    href: "/dashboard/academic-timetable",
    icon: <AcademicTimeTableIcon></AcademicTimeTableIcon>,
    roles: ['ADMIN'] // Only admin
  },
  {
    title: "Notification",
    href: '/dashboard/notification',
    icon: <Bell size={18} />,
    roles: ['ADMIN', 'FACULTY'] // Both can access
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: <Settings size={18} />,
    roles: ['ADMIN', 'FACULTY'] // Both can access
  }
];