'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';

interface RoomFormProps {
  newRoom: { name: string; capacity: number };
  setNewRoom: React.Dispatch<React.SetStateAction<{ name: string; capacity: number }>>;
  addRoom: () => void;
}

const RoomForm: React.FC<RoomFormProps> = ({ newRoom, setNewRoom, addRoom }) => {
  return (
    <div className="space-y-3">
      {/* <Input
        placeholder="Room Name/Number"
        value={newRoom.name}
        onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
      />
      <Input
        type="number"
        placeholder="Capacity"
        value={newRoom.capacity}
        onChange={(e) => setNewRoom({ ...newRoom, capacity: parseInt(e.target.value) || 0 })}
      /> */}
      <Input
  placeholder="Room Name/Number"
  value={newRoom.name}
  onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
  className="!text-white !placeholder-gray-300 !bg-gray-800 !border-gray-600"
/>
<Input
  type="number"
  placeholder="Capacity"
  value={newRoom.capacity}
  onChange={(e) => setNewRoom({ ...newRoom, capacity: parseInt(e.target.value) || 0 })}
  className="!text-white !placeholder-gray-300 !bg-gray-800 !border-gray-600"
/>

      <Button onClick={addRoom} className="w-full">
        <Plus className="h-4 w-4 mr-2" /> Add Room
      </Button>
    </div>
  );
};

export default RoomForm;
