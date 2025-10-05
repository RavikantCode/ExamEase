import React from "react";
// import { Room } from "../../types"; // adjust path if needed
import { Room } from "../types/seating";

interface RoomFormProps {
  rooms: Room[];
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
}

const RoomForms: React.FC<RoomFormProps> = ({ rooms, setRooms }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
      <h2 className="text-xl font-bold mb-4">Rooms ({rooms.length} total)</h2>
      <div className="space-y-2 h-96 overflow-y-auto">
        {rooms.map((room, idx) => (
          <div key={idx} className="flex gap-2 items-center bg-gray-700 p-2 rounded">
            <input
              type="text"
              value={room.roomNumber}
              onChange={(e) => {
                const newRooms = [...rooms];
                newRooms[idx].roomNumber = e.target.value;
                setRooms(newRooms);
              }}
              className="flex-1 bg-gray-600 text-white px-3 py-1 rounded"
            />
            <input
              type="number"
              value={room.benches}
              onChange={(e) => {
                const newRooms = [...rooms];
                newRooms[idx].benches = parseInt(e.target.value) || 0;
                setRooms(newRooms);
              }}
              className="w-20 bg-gray-600 text-white px-3 py-1 rounded"
            />
            <span className="text-xs text-gray-400 w-20">{room.benches * 2} seats</span>
            <button
              onClick={() => setRooms(rooms.filter((_, i) => i !== idx))}
              className="text-red-400 hover:text-red-300 px-2"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={() => setRooms([...rooms, { roomNumber: "", benches: 40 }])}
        className="mt-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm"
      >
        Add Room
      </button>
    </div>
  );
};

export default RoomForms;
