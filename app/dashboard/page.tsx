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
    <div className="text-white p-4 sm:p-6 md:p-8 bg-black min-h-screen">
    <article className='flex flex-col gap-2'>
        <h1 className='text-2xl sm:text-3xl md:text-4xl text-white font-bold'>
            MyWorkspace
        </h1>
    </article>
    <Tabs defaultValue='folder' className='mt-4 sm:mt-6'>
        <div className='flex flex-col sm:flex-row w-full justify-between items-start sm:items-center gap-4'>
          <TabsList className='flex-wrap bg-transparent gap-2 pl-0'>
              <TabsTrigger className='p-[13px] px-4 sm:px-6 rounded-full data-[state=active]:bg-[#252525] text-white text-sm sm:text-base' value='folder'>Folders</TabsTrigger>
              {isAdmin && (

              <TabsTrigger className='p-[13px] px-6 rounded-full data-[state=active]:bg-[#aba9a9] text-white' value='faculty'>View Faculty</TabsTrigger>
              )}
          </TabsList>

          <div className='flex gap-x-3 w-full sm:w-auto justify-end'>
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