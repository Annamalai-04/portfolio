// This visual analogy is independent of the résumé/experience skills data.
export const skillEquivalents = {
  frontend: ['HTML', 'CSS', 'JavaScript', 'React', 'GWT', 'NiceGUI', 'Pyqt', 'Swing', 'Electron', 'ReactNative', 'Android', 'Flet'],
  backend: ['Java', 'Python', 'Node.js', 'Spring Boot', 'Django', 'GenAi', 'AgenticAi'],
  database: ['MySQL', 'MongoDB', 'Excel', 'XMLS', 'JSON'],
  deployment: ['AWS EC2', 'Docker', 'Kubernetes', 'git', 'CI/CD'],
};

export const constructionStages = [
  {
    id: 'frontend', name: 'Frontend', title: 'Everything you see & touch.',
    subtitle: 'THE VISIBLE EXPERIENCE', color: '#9ee1c1',
    description: 'The spaces, surfaces and details that make a house feel like home.',
    items: [
      { id: 'walls', name: 'Walls' }, { id: 'doors', name: 'Doors' },
      { id: 'windows', name: 'Windows' }, { id: 'garden', name: 'Garden' },
      { id: 'painting', name: 'Wall painting' }, { id: 'furniture', name: 'Furniture' },
      { id: 'staircase', name: 'Staircase' }, { id: 'roof', name: 'Roof design' },
      { id: 'balcony', name: 'Balcony' }, { id: 'decorations', name: 'Interior decorations' },
    ],
  },
  {
    id: 'backend', name: 'Backend', title: 'The systems behind it all.',
    subtitle: 'THE INTERNAL WORKING SYSTEMS', color: '#efb781',
    description: 'Open the house to reveal the services that keep everything running.',
    items: [
      { id: 'wiring', name: 'Electrical wiring' }, { id: 'water-pipes', name: 'Water pipelines' },
      { id: 'drainage', name: 'Drainage system' }, { id: 'pump', name: 'Water pump' },
      { id: 'distribution-board', name: 'Distribution board' }, { id: 'gas-pipes', name: 'Gas pipelines' },
      { id: 'ventilation', name: 'Ventilation ducts' }, { id: 'air-conditioning', name: 'Air conditioning' },
      { id: 'elevator', name: 'Elevator machinery' }, { id: 'alarm', name: 'Security alarm system' },
    ],
  },
  {
    id: 'database', name: 'Database', title: 'A place for everything.',
    subtitle: 'RESOURCES, BELONGINGS & RECORDS', color: '#9bd0e8',
    description: 'Store essential resources, everyday belongings and important information.',
    items: [
      { id: 'water-tank', name: 'Water tank', stores: 'Water' },
      { id: 'gas-cylinder', name: 'Gas cylinder', stores: 'Cooking gas' },
      { id: 'storage-room', name: 'Storage room', stores: 'Household items' },
      { id: 'wardrobe', name: 'Wardrobe', stores: 'Clothes' },
      { id: 'kitchen-containers', name: 'Kitchen containers', stores: 'Food grains' },
      { id: 'refrigerator', name: 'Refrigerator', stores: 'Food' },
      { id: 'document-cupboard', name: 'Document cupboard', stores: 'Important documents' },
      { id: 'tool-cabinet', name: 'Tool cabinet', stores: 'Tools' },
      { id: 'bookshelf', name: 'Bookshelf', stores: 'Books' },
      { id: 'digital-storage', name: 'Digital storage', stores: 'Photos, videos & documents' },
    ],
  },
  {
    id: 'deployment', name: 'Deployment', title: 'Ready for the real world.',
    subtitle: 'APPROVE. CONNECT. HAND OVER.', color: '#e9cb84',
    description: 'Approvals, live connections and the final handover turn a build into a home.',
    items: [
      { id: 'ownership', name: 'Ownership documents' }, { id: 'plan-approval', name: 'Building plan approval' },
      { id: 'completion', name: 'Completion certificate' }, { id: 'keys', name: 'Key handover' },
      { id: 'electricity', name: 'Electricity activation' }, { id: 'water-connection', name: 'Water supply connection' },
      { id: 'sewage', name: 'Sewage connection' }, { id: 'house-number', name: 'House number allocation' },
      { id: 'family', name: 'Family moving in' }, { id: 'occupation', name: 'Ready for occupation' },
    ],
  },
];

export const constructionItems = constructionStages.flatMap((stage, stageIndex) =>
  stage.items.map((item, itemIndex) => ({ ...item, stage: stage.id, index: stageIndex * 10 + itemIndex })),
);

export function itemRange(id) {
  const item = constructionItems.find(entry => entry.id === id);
  if (!item) throw new Error(`Unknown house component: ${id}`);
  return { start: item.index / 40 + 0.001, end: (item.index + 0.88) / 40 };
}
