"use client";

import { useSession } from "next-auth/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Folder } from "@/components/global/Folder/page";
import Faculty from "@/components/global/Faculty/page";

function DashboardPage() {
  const { data: session, status } = useSession();

  

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const isAdmin = session?.user?.role === 'ADMIN';

  return (

    <>
    <div className="text-white p-8 bg-black min-h-screen">
    <article className='flex flex-col gap-2'>
        <h1 className='text-4xl text-white font-bold'>
            MyWorkspace
        </h1>
    </article>
    <Tabs defaultValue='folder' className='mt-6'>
        <div className='flex w-full justify-between items-center'>
          <TabsList className='bg-transparent gap-2 pl-0'>
              <TabsTrigger className='p-[13px] px-6 rounded-full data-[state=active]:bg-[#252525] text-white' value='folder'>Folders</TabsTrigger>
              {isAdmin && (

              <TabsTrigger className='p-[13px] px-6 rounded-full data-[state=active]:bg-[#aba9a9] text-white' value='faculty'>View Faculty</TabsTrigger>
              )}
          </TabsList>

          <div className='flex gap-x-3'>
            {/* <CreateWorkspace></CreateWorkspace> */}
            {/* <CreateFolders workspaceId={params.workspaceId}></CreateFolders> */}
          </div>
        </div>

        <div>
          <section>
            <TabsContent value='folder'>
              <Folder></Folder>
            </TabsContent>
          </section>
            
            {isAdmin && (

          <section>
            <TabsContent value="faculty">
              <Faculty></Faculty>
            </TabsContent>
          </section>
            )}
        </div>
      </Tabs>
    </div>
    </>
  );
}

export default DashboardPage;