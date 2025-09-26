// app/dashboard/remuneration/services/suggestions.ts
export const activityTemplates = {
    assessment: [
      { type: 'Theory Paper Assessment', rate: 15, category: 'assessment', difficulty: 'medium' },
      { type: 'Unit Test Paper Assessment', rate: 10, category: 'assessment', difficulty: 'easy' },
      { type: 'Term Work Submission', rate: 8, category: 'assessment', difficulty: 'easy' }
    ],
    practical: [
      { type: 'Practical Exam', rate: 25, category: 'practical', difficulty: 'medium' },
      { type: 'Oral Exam', rate: 20, category: 'practical', difficulty: 'medium' },
    ],
    project: [
      { type: 'Mini Project', rate: 30, category: 'project', difficulty: 'hard' },
      { type: 'BE Project', rate: 50, category: 'project', difficulty: 'hard' },
    ],
    duty: [
      { type: 'Exam Duty', rate: 200, category: 'duty', difficulty: 'easy' },
    ]
  };
  
  // export const subjectSuggestions = {
  //   COMP: {
  //     I: ['Basic Programming', 'Mathematics-I', 'Physics', 'Chemistry'],
  //     II: ['Data Structures', 'Mathematics-II', 'Digital Logic'],
  //     III: ['OOP', 'Database Systems', 'Computer Networks'],
  //     IV: ['Software Engineering', 'Operating Systems', 'Theory of Computation']
  //   },
  //   IT: {
  //     I: ['Programming Fundamentals', 'Mathematics-I', 'Physics'],
  //     II: ['Web Technology', 'Database Management', 'Software Engineering']
  //   }
  // };

  // app/dashboard/remuneration/data/subjectSuggestions.ts

export const subjectSuggestions = {
  COMP: {
    I: ['Basic Programming', 'Mathematics-I', 'Physics', 'Chemistry', 'Engineering Graphics'],
    II: ['Data Structures', 'Mathematics-II', 'Digital Logic', 'Computer Organization', 'Discrete Mathematics'],
    III: ['OOP', 'Database Systems', 'Computer Networks', 'Data Structures & Algorithms', 'Software Engineering'],
    IV: ['Operating Systems', 'Theory of Computation', 'Machine Learning', 'Compiler Design', 'Computer Graphics'],
    V: ['Advanced Algorithms', 'Distributed Systems', 'Information Security', 'Human Computer Interaction'],
    VI: ['Mobile Computing', 'Cloud Computing', 'Big Data Analytics', 'Artificial Intelligence'],
    VII: ['Project Management', 'Advanced Database Systems', 'Internet of Things', 'Blockchain Technology'],
    VIII: ['Final Year Project', 'Industry Training', 'Research Methodology', 'Entrepreneurship']
  },
  IT: {
    I: ['Programming Fundamentals', 'Mathematics-I', 'Physics', 'Basic Electronics'],
    II: ['Web Technology', 'Database Management', 'Software Engineering', 'Computer Networks'],
    III: ['System Analysis & Design', 'Java Programming', 'Operating Systems', 'Data Mining'],
    IV: ['Mobile Application Development', 'Information Security', 'Cloud Computing', 'AI & ML'],
    V: ['Advanced Web Technologies', 'DevOps', 'Cybersecurity', 'Internet of Things'],
    VI: ['Final Year Project', 'Industry Internship', 'Research & Development'],
    VII: ['Advanced Database Systems', 'Cloud Architecture', 'Machine Learning', 'Cybersecurity'],
    VIII: ['Final Year Project', 'Industry Training', 'Research Methodology', 'Entrepreneurship']
  },
  EXTC: {
    I: ['Basic Electronics', 'Mathematics-I', 'Physics', 'Engineering Drawing'],
    II: ['Electronic Circuits', 'Digital Electronics', 'Signals & Systems', 'Mathematics-II'],
    III: ['Communication Systems', 'Microprocessors', 'Control Systems', 'Electromagnetic Theory'],
    IV: ['VLSI Design', 'Digital Signal Processing', 'Antenna & Wave Propagation', 'Embedded Systems'],
    V: ['Wireless Communication', 'Optical Communication', 'Advanced Signal Processing', 'RF Engineering'],
    VI: ['Satellite Communication', 'Mobile Communication', 'Radar Engineering', 'Biomedical Electronics'],
    VII: ['Advanced VLSI Design', 'Communication Networks', 'Digital Image Processing', 'Project Work'],
    VIII: ['Final Year Project', 'Industry Training', 'Research Methodology', 'Entrepreneurship']
  },
  MECH: {
    I: ['Engineering Mechanics', 'Mathematics-I', 'Physics', 'Chemistry', 'Engineering Graphics'],
    II: ['Strength of Materials', 'Mathematics-II', 'Thermodynamics', 'Material Science', 'Manufacturing Processes'],
    III: ['Machine Design', 'Fluid Mechanics', 'Heat Transfer', 'Dynamics of Machinery', 'Production Technology'],
    IV: ['Automobile Engineering', 'Refrigeration & AC', 'Industrial Engineering', 'Mechanical Vibrations'],
    V: ['CAD/CAM', 'Finite Element Analysis', 'Advanced Manufacturing', 'Robotics & Automation'],
    VI: ['Project Management', 'Quality Control', 'Advanced Heat Transfer', 'Computational Fluid Dynamics'],
    VII: ['Advanced Machine Design', 'Renewable Energy', 'Industrial Automation', 'Project Work'],
    VIII: ['Final Year Project', 'Industry Training', 'Research Methodology', 'Entrepreneurship']
  },
  CIVIL: {
    I: ['Engineering Mechanics', 'Mathematics-I', 'Physics', 'Chemistry', 'Engineering Graphics'],
    II: ['Strength of Materials', 'Mathematics-II', 'Surveying', 'Building Materials', 'Fluid Mechanics'],
    III: ['Structural Analysis', 'Concrete Technology', 'Geotechnical Engineering', 'Environmental Engineering'],
    IV: ['Design of Concrete Structures', 'Transportation Engineering', 'Water Resources Engineering', 'Construction Management'],
    V: ['Design of Steel Structures', 'Foundation Engineering', 'Highway Engineering', 'Earthquake Engineering'],
    VI: ['Advanced Structural Design', 'Water Supply Engineering', 'Town Planning', 'Project Management'],
    VII: ['Bridge Engineering', 'Advanced Foundation Design', 'Construction Technology', 'Project Work'],
    VIII: ['Final Year Project', 'Industry Training', 'Research Methodology', 'Entrepreneurship']
  }
};

export const departments = ['COMP', 'IT', 'EXTC', 'MECH', 'CIVIL'];
export const semesters = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

export const getSubjectsForSemester = (department: string, semester: string): string[] => {
  const departmentSuggestions = subjectSuggestions[department as keyof typeof subjectSuggestions];
  return departmentSuggestions && semester in departmentSuggestions
    ? departmentSuggestions[semester as keyof typeof departmentSuggestions]
    : [];
};
  
  export const steps = [
    { title: 'Faculty Info', description: 'Basic details' },
    { title: 'Activities', description: 'Add your work' },
    { title: 'Review & Export', description: 'Generate report' }
  ];
  