export const BRANCHES = [
  { id: 'cse', name: 'Computer Science', color: 'from-violet-500 to-purple-600' },
  { id: 'it', name: 'Information Tech', color: 'from-blue-500 to-cyan-500' },
  { id: 'aiml', name: 'AI & ML', color: 'from-emerald-400 to-teal-500' },
  { id: 'robotics', name: 'Robotics', color: 'from-orange-500 to-red-500' },
  { id: 'electrical', name: 'Electrical', color: 'from-yellow-400 to-orange-400' },
  { id: 'electronics', name: 'Electronics', color: 'from-pink-500 to-rose-500' },
  { id: 'mechanical', name: 'Mechanical', color: 'from-slate-500 to-slate-600' },
  { id: 'civil', name: 'Civil', color: 'from-amber-600 to-brown-600' },
];

export const INITIAL_SUBJECTS_DATA = {
  "cse": {
    "Semester 1": ["Engineering Mathematics I", "Engineering Physics", "Basic Electrical", "Engineering Mechanics"],
    "Semester 2": ["Engineering Mathematics II", "Chemistry", "Programming in C"],
    "Semester 5": ["Database Management Systems", "Theory of Computation", "Operating Systems", "Software Engineering"],
  },
  "it": {
    "Semester 1": ["Engineering Mathematics I", "Chemistry", "Basic Electronics"],
    "Semester 5": ["Web Technology", "Computer Networks", "Design Analysis Algo"],
  }
};

export const MOCK_SEMESTERS = {
  "Year 1": ["Semester 1", "Semester 2"],
  "Year 2": ["Semester 3", "Semester 4"],
  "Year 3": ["Semester 5", "Semester 6"],
  "Year 4": ["Semester 7", "Semester 8"],
};

export const MOCK_NOTES = [
  { id: 1, title: "DBMS Unit 1 Summary", type: "pdf", url: "#", author: "Rahul K.", likes: 24 },
  { id: 2, title: "Normalization Cheat Sheet", type: "img", url: "#", author: "Anjali S.", likes: 12 },
  { id: 3, title: "Operating System Finals", type: "pdf", url: "#", author: "Srushti D.", likes: 45 },
];
