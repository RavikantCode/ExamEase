import { PDFDocument, StandardFonts } from "pdf-lib";

function generateSchedule(subjects: string[], startDate: string) {
  const date = new Date(startDate);
  const schedule: { date: string; morning?: string; evening?: string }[] = [];

  for (let i = 0; i < subjects.length; i += 2) {
    const day = date.toISOString().split("T")[0];
    schedule.push({
      date: day,
      morning: subjects[i],
      evening: subjects[i + 1],
    });
    date.setDate(date.getDate() + 1);
  }

  return schedule;
}

async function createPDFBuffer(
  title: string,
  schedule: any[],
  morningTime: string,
  eveningTime: string
) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const { height } = page.getSize();
  let y = height - 60;

  page.drawText("A. P. Shah Institute of Technology", { x: 150, y, size: 14, font });
  y -= 20;
  page.drawText(`UNIT TEST-II TIME TABLE (${title})`, { x: 180, y, size: 12, font });
  y -= 40;

  for (const s of schedule) {
    page.drawText(`${s.date}`, { x: 60, y, size: 10, font });
    page.drawText(`Morning (${morningTime}): ${s.morning || "-"}`, { x: 180, y, size: 10, font });
    y -= 15;
    page.drawText(`Evening (${eveningTime}): ${s.evening || "-"}`, { x: 180, y, size: 10, font });
    y -= 25;
  }

  return await pdfDoc.save();
}

export async function POST(req: Request) {
  try {
    const { subjects, title, startDate, morningTime, eveningTime } = await req.json();
    const schedule = generateSchedule(subjects, startDate);
    const pdfBuffer = await createPDFBuffer(title, schedule, morningTime, eveningTime);

    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename=${title}_Timetable.pdf`,
      },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to generate PDF" }), { status: 500 });
  }
}

// Disable caching for this route (important for binary responses)
export const dynamic = "force-dynamic";
