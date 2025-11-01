'use client'

import React, { useState, useEffect } from "react";
import { Calendar, Clock, Upload, FileText, Trash2, Download, Plus, User, Building2, GraduationCap, Zap } from "lucide-react";
import { Document, Packer, Paragraph, TextRun, Table, TableCell, TableRow, WidthType, AlignmentType, BorderStyle, HeadingLevel, ImageRun } from "docx";

interface VTEntry {
  date: string;
  day: string;
  morningShift: string;
  eveningShift: string;
}

interface Subject {
  name: string;
  type: 'core' | 'honors' | 'department' | 'institute';
}

interface ExamSchedule {
  date: string;
  day: string;
  morningExam: Subject | null;
  morningTime: string;
  eveningExam: Subject | null;
  eveningTime: string;
}

const TimetableGenerator = () => {
  const [vtDate, setVtDate] = useState("");
  const [vtDay, setVtDay] = useState("");
  const [morningShift, setMorningShift] = useState("10:30");
  const [eveningShift, setEveningShift] = useState("13:30");
  const [vtEntries, setVtEntries] = useState<VTEntry[]>([]);

  const [academicYear, setAcademicYear] = useState("");
  const [unitTest, setUnitTest] = useState("");

  const [departmentLogo, setDepartmentLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");

  const [collegeLogo, setCollegeLogo] = useState<File | null>(null);
const [collegeLogoPreview, setCollegeLogoPreview] = useState<string>("");

  const [year, setYear] = useState("");
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [subjectFile, setSubjectFile] = useState<File | null>(null);
  const [teacherFile, setTeacherFile] = useState<File | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [examCoordinator, setExamCoordinator] = useState("");
  const [examIncharge, setExamIncharge] = useState("");
  const [classIncharge, setClassIncharge] = useState("");
  const [hodDepartment, setHodDepartment] = useState("");

  const [generatedTimetable, setGeneratedTimetable] = useState<ExamSchedule[]>([]);
  const [isGenerated, setIsGenerated] = useState(false);

  useEffect(() => {
    if (vtDate) {
      const day = new Date(vtDate).toLocaleDateString("en-US", { weekday: "long" });
      setVtDay(day);
    }
  }, [vtDate]);

  const handleAddVTEntry = () => {
    if (vtDate && morningShift && eveningShift) {
      const newEntry: VTEntry = {
        date: vtDate,
        day: vtDay,
        morningShift,
        eveningShift,
      };
      setVtEntries([...vtEntries, newEntry]);
      setVtDate("");
      setVtDay("");
      setIsGenerated(false);
    }
  };

  const handleDeleteVTEntry = (index: number) => {
    const updated = vtEntries.filter((_, i) => i !== index);
    setVtEntries(updated);
    setIsGenerated(false);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDepartmentLogo(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCollegeLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCollegeLogo(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setCollegeLogoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubjectUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setSubjectFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split("\n").slice(1);
      
      const subjectList: Subject[] = lines
        .map((line) => {
          const parts = line.split(",");
          const name = parts[0]?.replace(/"/g, '').trim();
          
          if (!name) return null;
          
          let type: 'core' | 'honors' | 'department' | 'institute' = 'core';
          const nameLower = name.toLowerCase();
          
          if (nameLower.includes('honor') || nameLower.includes('honour')) {
            type = 'honors';
          } else if (nameLower.includes('department') || nameLower.includes('elective')) {
            type = 'department';
          } else if (nameLower.includes('institute') || nameLower.includes('cyber') || nameLower.includes('management')) {
            type = 'institute';
          }
          
          return { name, type };
        })
        .filter((s): s is Subject => s !== null);
      
      setSubjects(subjectList);
      setIsGenerated(false);
    };
    reader.readAsText(file);
  };

  const handleTeacherUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTeacherFile(file);
    }
  };

  const generateTimetable = () => {
    if (vtEntries.length === 0) {
      alert("Please add at least one date entry!");
      return;
    }
    
    if (subjects.length === 0) {
      alert("Please upload subject data!");
      return;
    }

    const schedule: ExamSchedule[] = [];
    let subjectIndex = 0;

    for (const entry of vtEntries) {
      if (subjectIndex >= subjects.length) break;

      schedule.push({
        date: entry.date,
        day: entry.day,
        morningExam: subjects[subjectIndex] || null,
        morningTime: entry.morningShift,
        eveningExam: subjects[subjectIndex + 1] || null,
        eveningTime: entry.eveningShift,
      });

      subjectIndex += 2;
    }

    setGeneratedTimetable(schedule);
    setIsGenerated(true);
  };

  const downloadTimetable = async () => {
    if (generatedTimetable.length === 0) return;

    const getSubjectDisplay = (subject: Subject | null) => {
      if (!subject) return "No Exam Scheduled";
      
      let prefix = "";
      if (subject.type === 'honors') prefix = "Honors: ";
      else if (subject.type === 'department') prefix = "Department Level Elective: ";
      else if (subject.type === 'institute') prefix = "Institute Level Elective: ";
      
      return prefix + subject.name;
    };

    let departmentLogoBuffer = null;
    let collegeLogoBuffer = null;
  
    if (departmentLogo) {
      departmentLogoBuffer = await departmentLogo.arrayBuffer();
    }
    if (collegeLogo) {
      collegeLogoBuffer = await collegeLogo.arrayBuffer();
    }

    const doc = new Document({
      sections: [{
        properties: {},
        children: [
           new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 33, type: WidthType.PERCENTAGE },
                    children: departmentLogoBuffer
                      ? [
                          new Paragraph({
                            alignment: AlignmentType.LEFT,
                            children: [
                              new ImageRun({
                                data: departmentLogoBuffer,
                                transformation: { width: 80, height: 80 },
                              }),
                            ],
                          }),
                        ]
                      : [new Paragraph("")],
                    borders: { top: { style: BorderStyle.NONE } },
                  }),

                  new TableCell({
                    width: { size: 34, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        text: "A. P. SHAH INSTITUTE OF TECHNOLOGY",
                        alignment: AlignmentType.CENTER,
                        style: HeadingLevel.HEADING_1,
                      }),
                      new Paragraph({
                        text: "(NBA Accredited)",
                        alignment: AlignmentType.CENTER,
                      }),
                      new Paragraph({
                        text: `Department of ${department}`,
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                    borders: { top: { style: BorderStyle.NONE } },
                  }),

                  new TableCell({
                    width: { size: 33, type: WidthType.PERCENTAGE },
                    children: collegeLogoBuffer
                      ? [
                          new Paragraph({
                            alignment: AlignmentType.RIGHT,
                            children: [
                              new ImageRun({
                                data: collegeLogoBuffer,
                                transformation: { width: 80, height: 80 },
                              }),
                            ],
                          }),
                        ]
                      : [new Paragraph("")],
                    borders: { top: { style: BorderStyle.NONE } },
                  }),
                ],
              }),
            ],
          }),
          new Paragraph({
            text: "A. P. SHAH INSTITUTE OF TECHNOLOGY",
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
            style: HeadingLevel.HEADING_1,
          }),
          
          new Paragraph({
            text: `Department of ${department}`,
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
          }),
          
          new Paragraph({
            text: "(NBA Accredited)",
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),
          
          new Paragraph({
            text: `UNIT TEST-${unitTest} TIME TABLE (Academic Year ${academicYear})`,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            style: HeadingLevel.HEADING_2,
          }),
          
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ 
                      text: `${department.toUpperCase()} SEM-${semester}`,
                      alignment: AlignmentType.CENTER,
                      spacing: { before: 100, after: 100 },
                    })],
                    columnSpan: 3,
                    shading: { fill: "E5E7EB" },
                  }),
                ],
              }),
              
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ 
                      text: `Timetable for Unit Test-${unitTest}`,
                      alignment: AlignmentType.CENTER,
                      spacing: { before: 100, after: 100 },
                    })],
                    columnSpan: 3,
                    shading: { fill: "F3F4F6" },
                  }),
                ],
              }),
              
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ 
                      text: "Date",
                      alignment: AlignmentType.CENTER,
                      children: [new TextRun({ text: "Time", bold: true })],
                    })],
                    shading: { fill: "D1D5DB" },
                  }),
                  new TableCell({
                    children: [new Paragraph({ 
                      text: "Time",
                      alignment: AlignmentType.CENTER,
                      children: [new TextRun({ text: "Time", bold: true })],
                    })],
                    shading: { fill: "D1D5DB" },
                  }),
                  new TableCell({
                    children: [new Paragraph({ 
                      text: "Subject",
                      alignment: AlignmentType.CENTER,
                      children: [new TextRun({ text: "Time", bold: true })],
                    })],
                    shading: { fill: "D1D5DB" },
                  }),
                ],
              }),
              
              ...generatedTimetable.flatMap((exam, i) => {
                const formattedDate = new Date(exam.date).toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                });
                
                return [
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph({ text: formattedDate })],
                        rowSpan: exam.eveningExam ? 2 : 1,
                        verticalAlign: "center",
                      }),
                      new TableCell({
                        children: [new Paragraph({ text: `${exam.morningTime} am - 11:30 am` })],
                      }),
                      new TableCell({
                        children: [new Paragraph({ text: getSubjectDisplay(exam.morningExam) })],
                      }),
                    ],
                  }),
                  
                  ...(exam.eveningExam ? [
                    new TableRow({
                      children: [
                        new TableCell({
                          children: [new Paragraph({ text: `${exam.eveningTime} pm - 2:30 pm` })],
                        }),
                        new TableCell({
                          children: [new Paragraph({ text: getSubjectDisplay(exam.eveningExam) })],
                        }),
                      ],
                    }),
                  ] : []),
                ];
              }),
            ],
          }),
          
          new Paragraph({
            text: "",
            spacing: { before: 600 },
          }),
          
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({ text: examCoordinator || "_______________", alignment: AlignmentType.CENTER }),
                      new Paragraph({ text: "Exam Coordinator", alignment: AlignmentType.CENTER }),
                    ],
                    borders: {
                      top: { style: BorderStyle.NONE },
                      bottom: { style: BorderStyle.NONE },
                      left: { style: BorderStyle.NONE },
                      right: { style: BorderStyle.NONE },
                    },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({ text: examIncharge || "_______________", alignment: AlignmentType.CENTER }),
                      new Paragraph({ text: "Exam In-charge", alignment: AlignmentType.CENTER }),
                    ],
                    borders: {
                      top: { style: BorderStyle.NONE },
                      bottom: { style: BorderStyle.NONE },
                      left: { style: BorderStyle.NONE },
                      right: { style: BorderStyle.NONE },
                    },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({ text: classIncharge || "_______________", alignment: AlignmentType.CENTER }),
                      new Paragraph({ text: "Class In-charge", alignment: AlignmentType.CENTER }),
                    ],
                    borders: {
                      top: { style: BorderStyle.NONE },
                      bottom: { style: BorderStyle.NONE },
                      left: { style: BorderStyle.NONE },
                      right: { style: BorderStyle.NONE },
                    },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({ text: hodDepartment || "_______________", alignment: AlignmentType.CENTER }),
                      new Paragraph({ text: `Hod, ${department}`, alignment: AlignmentType.CENTER }),
                    ],
                    borders: {
                      top: { style: BorderStyle.NONE },
                      bottom: { style: BorderStyle.NONE },
                      left: { style: BorderStyle.NONE },
                      right: { style: BorderStyle.NONE },
                    },
                  }),
                ],
              }),
            ],
          }),
          
          new Paragraph({
            text: "",
            spacing: { before: 400 },
          }),
          
          new Paragraph({
            text: `Department of ${department} | APSIT`,
            alignment: AlignmentType.CENTER,
            spacing: { before: 200 },
          }),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${year}_${department}_SEM${semester}_UT${unitTest}_Timetable.docx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getSubjectTypeColor = (type: string) => {
    switch(type) {
      case 'honors': return 'text-purple-400';
      case 'department': return 'text-blue-400';
      case 'institute': return 'text-green-400';
      default: return 'text-white';
    }
  };

  const getSubjectTypeBadge = (type: string) => {
    switch(type) {
      case 'honors': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'department': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'institute': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-neutral-500/20 text-neutral-400 border-neutral-500/30';
    }
  };

  const getSubjectTypeLabel = (type: string) => {
    switch(type) {
      case 'honors': return 'Honors';
      case 'department': return 'Dept. Elective';
      case 'institute': return 'Institute Elective';
      default: return 'Core';
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white">
      <div className="bg-[#000000] border-b border-neutral-800 p-6">
        <div className="max-w-[1800px] mx-auto">
          <h1 className="text-3xl font-bold">
          <span className="text-2xl md:text-2xl font-semibold text-white">
  E
  <span className="text-2xl md:text-4xl relative top-1 bg-linear-to-r from-[#8B5CF6] to-[#0B0B0B] bg-clip-text text-transparent">
    X
  </span>
  amEase
</span>
            <span className="ml-3 text-lg font-normal text-neutral-400">Timetable Generator</span>
          </h1>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-[#111111] border border-neutral-800 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="text-[#8B5CF6]" size={20} />
                <h2 className="text-lg font-semibold">UT Timetable</h2>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-neutral-400 mb-1 block">Date</label>
                    <input
                      type="date"
                      value={vtDate}
                      onChange={(e) => setVtDate(e.target.value)}
                      className="w-full bg-[#1D1D1D] border border-neutral-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-[#8B5CF6]"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-neutral-400 mb-1 block">Day</label>
                    <input
                      type="text"
                      value={vtDay}
                      readOnly
                      placeholder="Auto-generated"
                      className="w-full bg-[#1D1D1D] border border-neutral-700 rounded-lg p-2.5 text-sm text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-neutral-400 mb-1 block">Morning Shift</label>
                    <input
                      type="time"
                      value={morningShift}
                      onChange={(e) => setMorningShift(e.target.value)}
                      className="w-full bg-[#1D1D1D] border border-neutral-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-[#8B5CF6]"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-neutral-400 mb-1 block">Evening Shift</label>
                    <input
                      type="time"
                      value={eveningShift}
                      onChange={(e) => setEveningShift(e.target.value)}
                      className="w-full bg-[#1D1D1D] border border-neutral-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-[#8B5CF6]"
                    />
                  </div>
                </div>

                <button
                  onClick={handleAddVTEntry}
                  className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] text-white px-4 py-2.5 rounded-lg hover:from-[#7C3AED] hover:to-[#5B21B6] text-sm font-medium flex items-center justify-center gap-2"
                >
                  <Plus size={16} />
                  Add Schedule
                </button>
              </div>

              {vtEntries.length > 0 && (
                <div className="mt-4 space-y-2 max-h-[200px] overflow-y-auto">
                  {vtEntries.map((entry, i) => (
                    <div key={i} className="bg-[#1D1D1D] border border-neutral-800 rounded-lg p-3 flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">{entry.date} — {entry.day}</p>
                        <p className="text-xs text-neutral-400 mt-0.5">
                          {entry.morningShift} | {entry.eveningShift}
                        </p>
                      </div>
                      <button onClick={() => handleDeleteVTEntry(i)} className="text-red-400 hover:text-red-300">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-[#111111] border border-neutral-800 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="text-[#8B5CF6]" size={20} />
                <h2 className="text-lg font-semibold">Academic Details</h2>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-neutral-400 mb-1 block">Academic Year</label>
                    <input
                      type="text"
                      placeholder="2024-2025"
                      value={academicYear}
                      onChange={(e) => setAcademicYear(e.target.value)}
                      className="w-full bg-[#1D1D1D] border border-neutral-700 rounded-lg p-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#8B5CF6]"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-neutral-400 mb-1 block">Unit Test</label>
                    <select
                      value={unitTest}
                      onChange={(e) => setUnitTest(e.target.value)}
                      className="w-full bg-[#1D1D1D] border border-neutral-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-[#8B5CF6]"
                    >
                      <option value="">Select</option>
                      <option value="I">Unit Test I</option>
                      <option value="II">Unit Test II</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#111111] border border-neutral-800 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="text-[#8B5CF6]" size={20} />
                <h2 className="text-lg font-semibold">Department Logo</h2>
              </div>

              <div className="space-y-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="w-full bg-[#1D1D1D] border border-neutral-700 rounded-lg p-2.5 text-sm text-white file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-[#8B5CF6] file:text-white hover:file:bg-[#7C3AED]"
                />
                {logoPreview && (
                  <div className="flex justify-center">
                    <img src={logoPreview} alt="Logo Preview" className="h-24 w-24 object-contain rounded-lg border border-neutral-700" />
                  </div>
                )}
              </div>
            </div>

<div className="bg-[#111111] border border-neutral-800 rounded-xl p-5">
  <div className="flex items-center gap-2 mb-4">
    <Building2 className="text-[#8B5CF6]" size={20} />
    <h2 className="text-lg font-semibold">College Logo</h2>
  </div>

  <div className="space-y-3">
    <input
      type="file"
      accept="image/*"
      onChange={handleCollegeLogoUpload}
      className="w-full bg-[#1D1D1D] border border-neutral-700 rounded-lg p-2.5 text-sm text-white file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-[#8B5CF6] file:text-white hover:file:bg-[#7C3AED]"
    />
    {collegeLogoPreview && (
      <div className="flex justify-center">
        <img src={collegeLogoPreview} alt="College Logo Preview" className="h-24 w-24 object-contain rounded-lg border border-neutral-700" />
      </div>
    )}
  </div>
</div>
            <div className="bg-[#111111] border border-neutral-800 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Upload className="text-[#8B5CF6]" size={20} />
                <h2 className="text-lg font-semibold">Subject Dataset</h2>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-neutral-400 mb-1 block">Year</label>
                    <select
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full bg-[#1D1D1D] border border-neutral-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-[#8B5CF6]"
                    >
                      <option value="">Select</option>
                      <option value="B.E.">B.E.</option>
                      <option value="S.E.">S.E.</option>
                      <option value="T.E.">T.E.</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-neutral-400 mb-1 block">Department</label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full bg-[#1D1D1D] border border-neutral-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-[#8B5CF6]"
                    >
                      <option value="">Select</option>
                      <option value="Information Technology">IT</option>
                      <option value="Computer">Computer</option>
                      <option value="Civil">Civil</option>
                      <option value="Mechanical">Mechanical</option>
                      <option value="Electronics">Electronics</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-neutral-400 mb-1 block">Select Semester</label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full bg-[#1D1D1D] border border-neutral-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-[#8B5CF6]"
                  >
                    <option value="">Select</option>
                    <option value="VII">Semester VII</option>
                    <option value="VI">Semester VI</option>
                    <option value="V">Semester V</option>
                    <option value="IV">Semester IV</option>
                    <option value="III">Semester III</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-neutral-400 mb-1 block">Upload Subject Data</label>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleSubjectUpload}
                    className="w-full bg-[#1D1D1D] border border-neutral-700 rounded-lg p-2.5 text-sm text-white file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-[#8B5CF6] file:text-white hover:file:bg-[#7C3AED]"
                  />
                  {subjects.length > 0 && (
                    <p className="text-xs text-neutral-400 mt-1">✓ {subjects.length} subjects loaded</p>
                  )}
                </div>

                <div>
                  <label className="text-xs text-neutral-400 mb-1 block">Upload Teacher Data</label>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleTeacherUpload}
                    className="w-full bg-[#1D1D1D] border border-neutral-700 rounded-lg p-2.5 text-sm text-white file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-[#8B5CF6] file:text-white hover:file:bg-[#7C3AED]"
                  />
                  {teacherFile && (
                    <p className="text-xs text-neutral-400 mt-1">✓ {teacherFile.name}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-[#111111] border border-neutral-800 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <User className="text-[#8B5CF6]" size={20} />
                <h2 className="text-lg font-semibold">Exam Authorities</h2>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-neutral-400 mb-1 block">Exam Coordinator</label>
                  <input
                    type="text"
                    placeholder="Enter name"
                    value={examCoordinator}
                    onChange={(e) => setExamCoordinator(e.target.value)}
                    className="w-full bg-[#1D1D1D] border border-neutral-700 rounded-lg p-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#8B5CF6]"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 mb-1 block">Exam Incharge</label>
                  <input
                    type="text"
                    placeholder="Enter name"
                    value={examIncharge}
                    onChange={(e) => setExamIncharge(e.target.value)}
                    className="w-full bg-[#1D1D1D] border border-neutral-700 rounded-lg p-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#8B5CF6]"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 mb-1 block">Class Incharge</label>
                  <input
                    type="text"
                    placeholder="Enter name"
                    value={classIncharge}
                    onChange={(e) => setClassIncharge(e.target.value)}
                    className="w-full bg-[#1D1D1D] border border-neutral-700 rounded-lg p-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#8B5CF6]"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 mb-1 block">HOD Department</label>
                  <input
                    type="text"
                    placeholder="Enter name"
                    value={hodDepartment}
                    onChange={(e) => setHodDepartment(e.target.value)}
                    className="w-full bg-[#1D1D1D] border border-neutral-700 rounded-lg p-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#8B5CF6]"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={generateTimetable}
              className="w-full bg-gradient-to-r from-[#10B981] to-[#059669] text-white px-6 py-4 rounded-xl hover:from-[#059669] hover:to-[#047857] text-base font-semibold flex items-center justify-center gap-3 shadow-lg shadow-green-500/20"
            >
              <Zap size={20} />
              Generate Timetable
            </button>
          </div>

          <div className="bg-[#111111] border border-neutral-800 rounded-xl p-5 h-fit sticky top-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="text-[#8B5CF6]" size={20} />
                <h2 className="text-lg font-semibold">Generated Timetable</h2>
              </div>
              {isGenerated && generatedTimetable.length > 0 && (
                <button
                  onClick={downloadTimetable}
                  className="bg-[#1D1D1D] border border-neutral-700 text-white px-3 py-1.5 rounded-lg hover:bg-[#2D2D2D] text-xs font-medium flex items-center gap-2"
                >
                  <Download size={14} />
                  Download
                </button>
              )}
            </div>

            {!isGenerated ? (
              <div className="text-center py-12 text-neutral-500">
                <FileText size={48} className="mx-auto mb-3 opacity-20" />
                <p className="text-sm">Click "Generate Timetable" to create your exam schedule</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-[#1D1D1D] to-[#2D2D2D] border border-neutral-800 rounded-lg p-4">
                {(collegeLogoPreview || logoPreview) && (
  <div className="flex justify-center items-center gap-4 mb-3">
    {collegeLogoPreview && (
      <img src={collegeLogoPreview} alt="College Logo" className="h-16 w-16 object-contain" />
    )}
    {logoPreview && (
      <img src={logoPreview} alt="Department Logo" className="h-16 w-16 object-contain" />
    )}
  </div>
)}
                  <div className="text-center space-y-1 mb-3">
                    <h3 className="font-bold text-lg">{year} SEM-{semester}</h3>
                    <p className="text-sm text-neutral-400">Timetable for Unit Test-{unitTest}</p>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Academic Year:</span>
                      <span className="font-medium">{academicYear || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Department:</span>
                      <span className="font-medium">{department || "N/A"}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 max-h-[calc(100vh-500px)] overflow-y-auto pr-2">
                  {generatedTimetable.map((exam, i) => (
                    <div key={i} className="bg-[#1D1D1D] border border-neutral-800 rounded-lg overflow-hidden">
                      {/* Date Header */}
                      <div className="bg-gradient-to-r from-[#8B5CF6]/20 to-[#6D28D9]/20 border-b border-neutral-800 p-3">
                        <div className="flex items-center gap-3">
                          <div className="bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] w-10 h-10 rounded-lg flex items-center justify-center font-bold flex-shrink-0">
                            {i + 1}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold">{exam.day}</p>
                            <p className="text-xs text-neutral-400">
                              {new Date(exam.date).toLocaleDateString("en-US", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 space-y-3">
                        <div className="bg-[#0a0a0a] border border-neutral-800 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Clock className="text-yellow-400" size={14} />
                              <span className="text-xs font-semibold text-yellow-400">MORNING SESSION</span>
                            </div>
                            <span className="text-xs text-neutral-400">{exam.morningTime}</span>
                          </div>
                          
                          {exam.morningExam ? (
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-[10px] px-2 py-0.5 rounded border ${getSubjectTypeBadge(exam.morningExam.type)}`}>
                                  {getSubjectTypeLabel(exam.morningExam.type)}
                                </span>
                              </div>
                              <p className={`text-sm font-medium ${getSubjectTypeColor(exam.morningExam.type)}`}>
                                {exam.morningExam.name}
                              </p>
                            </div>
                          ) : (
                            <p className="text-sm text-neutral-500">No Exam Scheduled</p>
                          )}
                        </div>

                        <div className="bg-[#0a0a0a] border border-neutral-800 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Clock className="text-blue-400" size={14} />
                              <span className="text-xs font-semibold text-blue-400">EVENING SESSION</span>
                            </div>
                            <span className="text-xs text-neutral-400">{exam.eveningTime}</span>
                          </div>
                          
                          {exam.eveningExam ? (
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-[10px] px-2 py-0.5 rounded border ${getSubjectTypeBadge(exam.eveningExam.type)}`}>
                                  {getSubjectTypeLabel(exam.eveningExam.type)}
                                </span>
                              </div>
                              <p className={`text-sm font-medium ${getSubjectTypeColor(exam.eveningExam.type)}`}>
                                {exam.eveningExam.name}
                              </p>
                            </div>
                          ) : (
                            <p className="text-sm text-neutral-500">No Exam Scheduled</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-[#1D1D1D] to-[#2D2D2D] border border-neutral-800 rounded-lg p-4 mt-4">
                  <p className="text-xs font-semibold text-neutral-400 mb-3">EXAM AUTHORITIES</p>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-[#0a0a0a] border border-neutral-800 rounded p-2">
                      <span className="text-neutral-500 block mb-1">Exam Coordinator</span>
                      <p className="font-medium">{examCoordinator || "N/A"}</p>
                    </div>
                    <div className="bg-[#0a0a0a] border border-neutral-800 rounded p-2">
                      <span className="text-neutral-500 block mb-1">Exam Incharge</span>
                      <p className="font-medium">{examIncharge || "N/A"}</p>
                    </div>
                    <div className="bg-[#0a0a0a] border border-neutral-800 rounded p-2">
                      <span className="text-neutral-500 block mb-1">Class Incharge</span>
                      <p className="font-medium">{classIncharge || "N/A"}</p>
                    </div>
                    <div className="bg-[#0a0a0a] border border-neutral-800 rounded p-2">
                      <span className="text-neutral-500 block mb-1">HOD</span>
                      <p className="font-medium">{hodDepartment || "N/A"}</p>
                    </div>
                  </div>
                  <div className="text-center mt-3 pt-3 border-t border-neutral-800">
                    <p className="text-[10px] text-neutral-500">Department of {department} | APSIT</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimetableGenerator;