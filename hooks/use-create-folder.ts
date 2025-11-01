// import { CreateFolders } from "@/app/actions/workspace";
// import { useMutationData } from "./use-Mutation";

export const useCreateFolder = (workSpaceId:string) => {
//   const { mutate } = useMutationData(
//     ["create-folder"],
//     () => CreateFolders(workSpaceId),
//      ['workspace-folders']
//   );

  const onCreateNewFolder = () => {
    console.log("folder created");
    
  }
    // mutate({name:"Untitled",id:'optimistic--id'}); //pass id also for optimistic update
    // return {onCreateNewFolder}
  return {onCreateNewFolder}
    
};
