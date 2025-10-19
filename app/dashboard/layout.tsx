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
        <div className="w-64 fixed h-full">
         <Sidebar session={session} />
      </div>

      <div className="flex-1 ml-61 flex flex-col">
        <main className="p-1">{children}</main>
      </div>
    </div>
  );
}
