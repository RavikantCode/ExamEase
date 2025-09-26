'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface Room {
  id: string;
  name: string;
  capacity: number;
}

interface RoomListProps {
  rooms: Room[];
  removeRoom: (id: string) => void;
}

const RoomList: React.FC<RoomListProps> = ({ rooms, removeRoom }) => {
  return (
    <div className="space-y-2 max-h-60 overflow-y-auto">
      {rooms.map((room) => (
        <div key={room.id} className="flex items-center justify-between p-2 bg-yellow-50 rounded text-sm">
          <div>
            <div className="font-medium">{room.name}</div>
            <div className="text-gray-600">Capacity: {room.capacity}</div>
          </div>
          <Button variant="destructive" size="sm" onClick={() => removeRoom(room.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default RoomList;
