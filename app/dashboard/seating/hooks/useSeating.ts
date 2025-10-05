import { useState } from "react";
// import { Room, StudentData, SeatingData } from "@/types/seating";
import { Room , StudentData, SeatingData  } from "../types/seating";
// import { generateSeatingArrangement } from "@/utils/seatingAlgorithm";
import { generateSeatingArrangement } from "../utils/seatingAlgorithm";

export const useSeating = () => {
  const [date, setDate] = useState("18/08/2025");
  const [timeSlots, setTimeSlots] = useState(["10:30 to 11:30 AM", "1:30 to 2:30 PM"]);
  const [students, setStudents] = useState<StudentData[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [output, setOutput] = useState<SeatingData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = () => {
    setLoading(true);
    setError("");
    try {
      const result = generateSeatingArrangement(students, rooms, date, timeSlots);
      if (!result) setError("Not enough rooms to accommodate all students!");
      setOutput(result);
    } catch (err) {
      setError("Error: " + err);
    } finally {
      setLoading(false);
    }
  };

  return {
    date, setDate,
    timeSlots, setTimeSlots,
    students, setStudents,
    rooms, setRooms,
    output, error, loading,
    generate
  };
};
