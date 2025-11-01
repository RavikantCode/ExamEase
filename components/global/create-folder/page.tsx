'use client'
import { Button } from '@/components/ui/button'
import { useCreateFolder } from '@/hooks/use-create-folder'
import { FolderPlus } from 'lucide-react'
import  React from 'react'

type Props ={
    userId:string
}

export const CreateFolders = ({userId}:Props) =>{
    const {onCreateNewFolder} = useCreateFolder(userId);

    return (
    <>
    

        <Button onClick={onCreateNewFolder} className='bg-[#1D1D1D] text-[#707070] flex items-center gap-2 py-6 px-4 rounded-2xl'>
            <FolderPlus>Create a Folder</FolderPlus>

        </Button>
    </>)
}

export default CreateFolders