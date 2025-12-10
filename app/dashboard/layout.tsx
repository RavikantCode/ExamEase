import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth/auth";
import { redirect } from "next/navigation";
import Sidebar from "../../components/global/sidebar/page";

type Props = {
  children: React.ReactNode;
};

export default async function DashboardLayout({ children }: Props) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin"); 
  }

  return (
    <div className="flex min-h-screen bg-[#111111]">
         <Sidebar session={session} />

      <div className="flex-1 md:ml-61 flex flex-col w-fulll">
        <main className="p-1 pt-16 md:pt-1">{children}</main>
      </div>
    </div>
  );
}
