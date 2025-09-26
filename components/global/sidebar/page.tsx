'use client';
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, Menu, Clock } from "lucide-react";
import SidebarItem from "./Sidebar-item";
import { MENU_ITEMS } from "@/constants/menu-items";
import Image from "next/image";

type Props={
  session:any
}

const Sidebar = ({session}:Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    console.log("Logging out...");
    router.push("/auth/signin");
  };

  const SidebarSection = (
    <div className="bg-[#000000] fixed top-0 left-0 h-screen w-[280px] flex flex-col gap-4 p-4 overflow-hidden">
      
      <div className="flex flex-col items-center justify-center gap-1 p-4 w-full mb-4">
  <div className="relative overflow-hidden h-36 w-36 rounded-xl flex items-center justify-center mb-2">
    <Image
      src="/5-real.png"
      alt="opal-image"
      fill
      className="object-contain"
    />
  </div>
  <span className="text-2xl md:text-2xl font-semibold text-white">
  E
  <span className="text-2xl md:text-4xl relative top-1 bg-gradient-to-r from-purple-500 to-[#111111] bg-clip-text text-transparent">
    X
  </span>
  amEase
</span>

</div>


      {/* Menu Section */}
      <div className="w-full">
        <span className="w-full text-[#9D9D9D] font-bold text-sm">Menu</span>
        <nav className="w-full mt-3">
          <ul>
            {MENU_ITEMS.map((item) => (
              <SidebarItem
                key={item.title}
                href={item.href}
                notification={0}
                title={item.title}
                icon={item.icon}
                selected={pathname === item.href}
              />
            ))}
          </ul>
        </nav>
      </div>

      {/* Separator */}
      <div className="w-4/5 h-[1px] bg-muted/50 my-4"></div>

      {/* Logout Section */}
      <div className="w-full mt-auto">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 p-[5px] rounded-lg hover:bg-[#1D1D1D] transition-all"
        >
          <LogOut size={18} className="text-red-400" />
          <span className="font-medium text-sm text-red-400">Logout</span>
        </button>
      </div>

   
      <div className="w-full mt-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-[#111111] rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">{session.user?.name[0]}</span>
          </div>
          <div className="flex-1">
            <div className="text-white text-sm font-medium">{session.user?.name}</div>
            <div className="text-neutral-400 text-xs">{session.user?.moodle_id}</div>
          </div>
        </div>
      </div>
    </div>
  );

  console.log(session);
  

  return (
    <div className="full">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">{SidebarSection}</div>

      {/* Mobile Menu */}
      <div className="md:hidden">
        {/* Mobile Header */}
        <div className="bg-[#111111] p-4 flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center gap-3">
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white hover:bg-neutral-800 p-2 rounded-lg transition-colors"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Mobile Overlay Menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="absolute left-0 top-0 h-full w-[250px] bg-[#111111] transform transition-transform">
              {SidebarSection}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
