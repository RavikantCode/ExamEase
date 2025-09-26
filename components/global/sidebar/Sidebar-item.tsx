'use client'


// import { cn } from "@/lib/utils";
import {cn} from '../../../lib/utils'
import Link from "next/link";

type Props={
    href:string
    icon:React.ReactNode
    selected:boolean
    title:string
    notification:number
}

const SidebarItem = ({ href, icon, selected, title, notification }: Props) => {
    return (
      <li className="cursor-pointer my-[5px]">
        <Link
          href={href}
          className={cn(
            'flex items-center justify-between group rounded-lg hover:bg-[#1D1D1D]',
            selected ? 'bg-[#1D1D1D]' : ''
          )}
        >
          <div className="flex items-center gap-2 transition-all p-[5px] cursor-pointer">
            {icon}
            <span
              className={cn(
                'font-medium group-hover:text-[#909090] transition-all truncate w-32',
                selected ? 'text-[#909090]' : 'text-[#545454]'
              )}
            >
              {title}
            </span>
          </div>
        </Link>
      </li>
    );
  };
  
  export default SidebarItem;