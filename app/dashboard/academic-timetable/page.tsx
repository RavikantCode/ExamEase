'use client';

import { useEffect, useState } from 'react';
import CSVUploader from '@/components/academic-timetable/CSVUploader';
import TimetableGenerator from '@/components/academic-timetable/TimetableGenerator';

interface UploadStats {
  rooms: number;
  instructors: number;
  courses: number;
  workload: number;
}

interface Department {
  id: string;
  name: string;
  abbreviation?: string;
}

interface Section {
  id: string;
  sectionName: string;
  departmentId: string;
  semester: number;
  division: string;
  department?: Department;
}

type UploadTab = 'rooms' | 'instructors' | 'courses' | 'workload';

type SemesterType = 'EVEN' | 'ODD';

export default function AcademicTimetablePage() {
  const [activeTab, setActiveTab] = useState<UploadTab>('rooms');
  const [academicYear, setAcademicYear] = useState('2025-26');
  const [semester, setSemester] = useState<SemesterType>('EVEN');
  const [stats, setStats] = useState<UploadStats>({ rooms: 0, instructors: 0, courses: 0, workload: 0 });
  const [loadingStats, setLoadingStats] = useState(true);

  const [departments, setDepartments] = useState<Department[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSection, setSelectedSection] = useState('');
  const [loadingSections, setLoadingSections] = useState(true);

  // Section creation form state
  const [showSectionForm, setShowSectionForm] = useState(false);
  const [creatingSec, setCreatingSec] = useState(false);
  const [secForm, setSecForm] = useState({
    sectionName: '',
    departmentId: '',
    semester: '8',
    division: 'C',
    numStudents: '60',
    classesPerWeek: '30'
  });
  const [secError, setSecError] = useState('');

  const tabs = [
    { id: 'rooms' as const, label: 'Rooms', description: 'Room numbers and capacities' },
    { id: 'instructors' as const, label: 'Instructors', description: 'Faculty IDs and preferences' },
    { id: 'courses' as const, label: 'Courses', description: 'Course metadata and hours' },
    { id: 'workload' as const, label: 'Workload', description: 'Course → faculty mapping' }
  ];

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const [roomsRes, instructorsRes, coursesRes, workloadRes] = await Promise.all([
        fetch('/api/data/rooms'),
        fetch('/api/data/instructors'),
        fetch('/api/data/courses'),
        fetch('/api/data/workload')
      ]);

      const [rooms, instructors, courses, workload] = await Promise.all([
        roomsRes.json(),
        instructorsRes.json(),
        coursesRes.json(),
        workloadRes.json()
      ]);

      setStats({
        rooms: Array.isArray(rooms) ? rooms.length : 0,
        instructors: Array.isArray(instructors) ? instructors.length : 0,
        courses: Array.isArray(courses) ? courses.length : 0,
        workload: Array.isArray(workload) ? workload.length : 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchSections = async () => {
    setLoadingSections(true);
    try {
      const response = await fetch('/api/sections');
      const data = await response.json();
      if (Array.isArray(data)) {
        setSections(data);
        if (data.length > 0) {
          setSelectedSection(data[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching sections:', error);
    } finally {
      setLoadingSections(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchSections();
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await fetch('/api/departments');
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setDepartments(data);
        setSecForm(prev => prev.departmentId ? prev : { ...prev, departmentId: data[0].id });
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const ensureDepartment = async () => {
    // If departments are already loaded, nothing to do
    if (departments.length > 0) return;
    // Try fetching first
    try {
      const res = await fetch('/api/departments');
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setDepartments(data);
        setSecForm(prev => ({ ...prev, departmentId: data[0].id }));
        return;
      }
    } catch {}
    // Still empty — auto-create IT department
    try {
      const res = await fetch('/api/departments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Information Technology', abbreviation: 'IT' })
      });
      const dept = await res.json();
      if (dept?.id) {
        setDepartments([dept]);
        setSecForm(prev => ({ ...prev, departmentId: dept.id }));
      }
    } catch (error) {
      console.error('Error creating default department:', error);
    }
  };
  
  const openSectionForm = async () => {
    setShowSectionForm(true);
    await ensureDepartment();
  };

  const handleCreateSection = async () => {
    setSecError('');
    if (!secForm.sectionName.trim()) {
      setSecError('Section name is required');
      return;
    }
    if (!secForm.departmentId) {
      setSecError('Select a department (upload workload CSV first to auto-create IT dept)');
      return;
    }

    setCreatingSec(true);
    try {
      const res = await fetch('/api/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(secForm)
      });
      const data = await res.json();
      if (data.error) {
        setSecError(data.error);
      } else {
        setShowSectionForm(false);
        setSecForm({ sectionName: '', departmentId: departments[0]?.id || '', semester: '8', division: 'C', numStudents: '60', classesPerWeek: '30' });
        await fetchSections();
        // Auto-select newly created section
        if (data.id) setSelectedSection(data.id);
      }
    } catch (err: any) {
      setSecError(err.message || 'Failed to create section');
    } finally {
      setCreatingSec(false);
    }
  };

  const handleUploadComplete = () => {
    fetchStats();
    fetchDepartments(); // Re-fetch after workload upload creates the IT dept
  };

  const selectedSectionData = sections.find(section => section.id === selectedSection);
  const dataReady = stats.rooms > 0 && stats.instructors > 0 && stats.courses > 0 && stats.workload > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <header className="space-y-4">
          <p className="text-sm font-semibold text-blue-600">Academic Operations</p>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Academic Timetable Generator
              </h1>
              <p className="mt-2 text-gray-600 max-w-3xl">
                Upload the core datasets and run the genetic algorithm to auto-build conflict-free schedules for every section.
              </p>
            </div>
            <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${
              dataReady ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              <span className={`h-2 w-2 rounded-full ${dataReady ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
              {dataReady ? 'Ready to generate timetable' : 'Upload datasets to enable generation'}
            </div>
          </div>
        </header>

        {/* Data snapshot */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Rooms', value: stats.rooms, color: 'blue' },
            { label: 'Instructors', value: stats.instructors, color: 'green' },
            { label: 'Courses', value: stats.courses, color: 'purple' },
            { label: 'Workload Links', value: stats.workload, color: 'orange' }
          ].map(item => (
            <div key={item.label} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className={`mt-2 text-3xl font-semibold text-${item.color}-600`}>
                {loadingStats ? '—' : item.value}
              </p>
            </div>
          ))}
        </section>

        <section className="grid gap-8 lg:grid-cols-2">
          {/* Data onboarding */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Data Onboarding</h2>
                  <p className="text-sm text-gray-500">Upload CSVs and keep the dataset in sync with academics.</p>
                </div>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                  Academic Session
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm">
                  <span className="text-gray-600">Academic Year</span>
                  <input
                    type="text"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="2025-26"
                  />
                </label>
                <label className="text-sm">
                  <span className="text-gray-600">Semester</span>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value as SemesterType)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="EVEN">Even Semester</option>
                    <option value="ODD">Odd Semester</option>
                  </select>
                </label>
              </div>

              <div className="mt-6 space-y-2 rounded-xl bg-gray-50 p-2">
                <div className="grid grid-cols-2 gap-2 text-sm font-medium text-gray-600">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`rounded-lg px-3 py-2 text-left transition ${
                        activeTab === tab.id ? 'bg-white shadow text-blue-600' : 'hover:bg-white'
                      }`}
                    >
                      <div>{tab.label}</div>
                      <p className="text-xs text-gray-500">{tab.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                {activeTab === 'rooms' && (
                  <CSVUploader type="rooms" onUploadComplete={handleUploadComplete} />
                )}
                {activeTab === 'instructors' && (
                  <CSVUploader type="instructors" onUploadComplete={handleUploadComplete} />
                )}
                {activeTab === 'courses' && (
                  <CSVUploader type="courses" onUploadComplete={handleUploadComplete} />
                )}
                {activeTab === 'workload' && (
                  <CSVUploader
                    type="workload"
                    academicYear={academicYear}
                    semester={semester}
                    onUploadComplete={handleUploadComplete}
                  />
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5 text-sm text-blue-900">
              <h3 className="font-semibold">Generation Checklist</h3>
              <ul className="mt-2 space-y-1 list-disc pl-5">
                <li>Rooms, instructors, courses, and workload CSVs uploaded</li>
                <li>Academic year and semester verified</li>
                <li>At least one section created under the IT department</li>
              </ul>
            </div>
          </div>

          {/* Generation workspace */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Generate Timetable</h2>
                <p className="text-sm text-gray-500">Select a section and run the GA engine.</p>
              </div>
              {!dataReady && (
                <span className="text-xs font-semibold text-red-600">Upload datasets first</span>
              )}
            </div>

            {loadingSections ? (
              <div className="flex min-h-[200px] items-center justify-center text-gray-500">
                Loading sections...
              </div>
            ) : sections.length === 0 && !showSectionForm ? (
              <div className="space-y-4">
                <div className="rounded-lg border border-dashed border-yellow-300 bg-yellow-50 p-6 text-center text-sm text-yellow-700">
                  No sections found. Create one below to start generating timetables.
                </div>
                <button
                  onClick={openSectionForm}
                  className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition"
                >
                  + Create Section
                </button>
              </div>
            ) : showSectionForm || sections.length === 0 ? (
              /* Section creation form */
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Create New Section</h3>
                {secError && (
                  <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">{secError}</div>
                )}
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="text-sm">
                    <span className="text-gray-600">Section Name *</span>
                    <input
                      type="text"
                      value={secForm.sectionName}
                      onChange={(e) => setSecForm({ ...secForm, sectionName: e.target.value })}
                      placeholder="e.g. BE-IT-VIII-C"
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </label>
                  <label className="text-sm">
                    <span className="text-gray-600">Department *</span>
                    {departments.length === 0 ? (
                      <div className="mt-1 space-y-2">
                        <div className="rounded-lg border border-dashed border-yellow-300 bg-yellow-50 px-3 py-2 text-xs text-yellow-700">
                          No departments found.
                        </div>
                        <button
                          type="button"
                          onClick={ensureDepartment}
                          className="w-full rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-700 transition"
                        >
                          Create IT Department
                        </button>
                      </div>
                    ) : (
                      <select
                        value={secForm.departmentId}
                        onChange={(e) => setSecForm({ ...secForm, departmentId: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      >
                        {departments.map(d => (
                          <option key={d.id} value={d.id}>{d.name} {d.abbreviation ? `(${d.abbreviation})` : ''}</option>
                        ))}
                      </select>
                    )}
                  </label>
                  <label className="text-sm">
                    <span className="text-gray-600">Semester</span>
                    <input
                      type="number"
                      value={secForm.semester}
                      onChange={(e) => setSecForm({ ...secForm, semester: e.target.value })}
                      min="1" max="10"
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </label>
                  <label className="text-sm">
                    <span className="text-gray-600">Division</span>
                    <input
                      type="text"
                      value={secForm.division}
                      onChange={(e) => setSecForm({ ...secForm, division: e.target.value })}
                      placeholder="e.g. A, B, C"
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </label>
                  <label className="text-sm">
                    <span className="text-gray-600">Students</span>
                    <input
                      type="number"
                      value={secForm.numStudents}
                      onChange={(e) => setSecForm({ ...secForm, numStudents: e.target.value })}
                      min="1"
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </label>
                  <label className="text-sm">
                    <span className="text-gray-600">Classes/Week</span>
                    <input
                      type="number"
                      value={secForm.classesPerWeek}
                      onChange={(e) => setSecForm({ ...secForm, classesPerWeek: e.target.value })}
                      min="1"
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </label>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleCreateSection}
                    disabled={creatingSec}
                    className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-gray-300 transition"
                  >
                    {creatingSec ? 'Creating...' : 'Create Section'}
                  </button>
                  {sections.length > 0 && (
                    <button
                      onClick={() => setShowSectionForm(false)}
                      className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Target Section
                    </label>
                    <button
                      onClick={openSectionForm}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition"
                    >
                      + Add Section
                    </button>
                  </div>
                  <select
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    {sections.map(section => (
                      <option key={section.id} value={section.id}>
                        {section.sectionName} · Sem {section.semester} · Div {section.division} {section.department ? `(${section.department.abbreviation || section.department.name})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedSectionData && dataReady ? (
                  <TimetableGenerator
                    sectionId={selectedSectionData.id}
                    sectionName={selectedSectionData.sectionName}
                  />
                ) : (
                  <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-600">
                    Complete all uploads to unlock the generator.
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
