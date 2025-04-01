
// Mock Data for VetGuardian Application

// Veteran Data
export interface Veteran {
  id: string;
  name: string;
  age: number;
  gender: string;
  serviceEra: string;
  conditions: string[];
  riskLevel: 'low' | 'medium' | 'high';
  lastCheckin: string;
  primaryProvider: string;
}

// Vital Signs Data
export interface VitalReading {
  id: string;
  timestamp: string;
  type: 'blood_pressure' | 'heart_rate' | 'temperature' | 'oxygen' | 'glucose' | 'weight';
  value: number | string;
  unit: string;
  isNormal: boolean;
}

// Medication Data
export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  timesPerDay: number;
  startDate: string;
  endDate?: string;
  instructions: string;
  isActive: boolean;
  adherenceRate: number;
}

// Symptom Report
export interface SymptomReport {
  id: string;
  timestamp: string;
  symptoms: {
    type: string;
    severity: number;
    description: string;
  }[];
  notes: string;
}

// Appointment Data
export interface Appointment {
  id: string;
  title: string;
  providerName: string;
  department: string;
  dateTime: string;
  duration: number;
  isVirtual: boolean;
  status: 'scheduled' | 'completed' | 'canceled' | 'rescheduled';
  notes?: string;
}

// Message Data
export interface Message {
  id: string;
  sender: string;
  senderRole: 'veteran' | 'clinician' | 'system';
  recipient: string;
  timestamp: string;
  subject: string;
  content: string;
  isRead: boolean;
  priority: 'normal' | 'urgent';
}

// Alert Data
export interface Alert {
  id: string;
  veteranId: string;
  timestamp: string;
  type: 'vital_sign' | 'medication' | 'symptom' | 'appointment' | 'message' | 'ava_prediction';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  isResolved: boolean;
  metadata?: Record<string, any>;
}

// AVA Prediction
export interface AvaPrediction {
  id: string;
  veteranId: string;
  timestamp: string;
  predictionType: 'health_decline' | 'medication_issue' | 'appointment_needed' | 'mental_health';
  confidence: number;
  details: string;
  suggestedActions: string[];
  dataPoints: { label: string; value: string }[];
}

// Generate mock veterans
export const mockVeterans: Veteran[] = [
  {
    id: 'v-001',
    name: 'James Wilson',
    age: 68,
    gender: 'Male',
    serviceEra: 'Vietnam War',
    conditions: ['Type 2 Diabetes', 'PTSD', 'Hypertension'],
    riskLevel: 'high',
    lastCheckin: '2023-05-12T14:30:00Z',
    primaryProvider: 'Dr. Sarah Johnson'
  },
  {
    id: 'v-002',
    name: 'Robert Miller',
    age: 42,
    gender: 'Male',
    serviceEra: 'Gulf War',
    conditions: ['Major Depression', 'Chronic Back Pain'],
    riskLevel: 'medium',
    lastCheckin: '2023-05-13T09:15:00Z',
    primaryProvider: 'Dr. Michael Chen'
  },
  {
    id: 'v-003',
    name: 'Patricia Davis',
    age: 35,
    gender: 'Female',
    serviceEra: 'OEF/OIF',
    conditions: ['Anxiety Disorder', 'Mild TBI'],
    riskLevel: 'low',
    lastCheckin: '2023-05-14T16:45:00Z',
    primaryProvider: 'Dr. Lisa Patel'
  },
  {
    id: 'v-004',
    name: 'George Thompson',
    age: 72,
    gender: 'Male',
    serviceEra: 'Vietnam War',
    conditions: ['Coronary Artery Disease', 'Hearing Loss', 'Agent Orange Exposure'],
    riskLevel: 'high',
    lastCheckin: '2023-05-11T10:00:00Z',
    primaryProvider: 'Dr. Sarah Johnson'
  },
  {
    id: 'v-005',
    name: 'Maria Rodriguez',
    age: 29,
    gender: 'Female',
    serviceEra: 'OEF/OIF',
    conditions: ['PTSD', 'Adjustment Disorder'],
    riskLevel: 'medium',
    lastCheckin: '2023-05-13T13:20:00Z',
    primaryProvider: 'Dr. Lisa Patel'
  }
];

// Generate mock vital readings for a veteran
export const generateMockVitals = (veteranId: string): VitalReading[] => {
  const now = new Date();
  const vitals: VitalReading[] = [];
  
  // Generate blood pressure readings for the last 7 days
  for (let i = 0; i < 7; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Morning reading
    vitals.push({
      id: `bp-${veteranId}-${i}-am`,
      timestamp: new Date(date.setHours(9, 0, 0, 0)).toISOString(),
      type: 'blood_pressure',
      value: `${Math.floor(120 + Math.random() * 20)}/${Math.floor(70 + Math.random() * 15)}`,
      unit: 'mmHg',
      isNormal: Math.random() > 0.2 // 80% chance of being normal
    });
    
    // Evening reading
    vitals.push({
      id: `bp-${veteranId}-${i}-pm`,
      timestamp: new Date(date.setHours(18, 0, 0, 0)).toISOString(),
      type: 'blood_pressure',
      value: `${Math.floor(120 + Math.random() * 20)}/${Math.floor(70 + Math.random() * 15)}`,
      unit: 'mmHg',
      isNormal: Math.random() > 0.2
    });
    
    // Heart rate readings
    vitals.push({
      id: `hr-${veteranId}-${i}-am`,
      timestamp: new Date(date.setHours(9, 0, 0, 0)).toISOString(),
      type: 'heart_rate',
      value: Math.floor(65 + Math.random() * 20),
      unit: 'bpm',
      isNormal: Math.random() > 0.2
    });
    
    vitals.push({
      id: `hr-${veteranId}-${i}-pm`,
      timestamp: new Date(date.setHours(18, 0, 0, 0)).toISOString(),
      type: 'heart_rate',
      value: Math.floor(65 + Math.random() * 20),
      unit: 'bpm',
      isNormal: Math.random() > 0.2
    });
    
    // Temperature once a day
    vitals.push({
      id: `temp-${veteranId}-${i}`,
      timestamp: new Date(date.setHours(12, 0, 0, 0)).toISOString(),
      type: 'temperature',
      value: (97 + Math.random() * 3).toFixed(1),
      unit: '°F',
      isNormal: Math.random() > 0.1
    });
    
    // Oxygen saturation
    vitals.push({
      id: `ox-${veteranId}-${i}`,
      timestamp: new Date(date.setHours(12, 0, 0, 0)).toISOString(),
      type: 'oxygen',
      value: Math.floor(94 + Math.random() * 6),
      unit: '%',
      isNormal: Math.random() > 0.15
    });
    
    // Glucose level for diabetic patients
    if (veteranId === 'v-001') {
      vitals.push({
        id: `gl-${veteranId}-${i}-am`,
        timestamp: new Date(date.setHours(8, 0, 0, 0)).toISOString(),
        type: 'glucose',
        value: Math.floor(100 + Math.random() * 80),
        unit: 'mg/dL',
        isNormal: Math.random() > 0.3 // Higher chance of abnormal for diabetic patient
      });
      
      vitals.push({
        id: `gl-${veteranId}-${i}-pm`,
        timestamp: new Date(date.setHours(19, 0, 0, 0)).toISOString(),
        type: 'glucose',
        value: Math.floor(100 + Math.random() * 80),
        unit: 'mg/dL',
        isNormal: Math.random() > 0.3
      });
    }
    
    // Weight once a week
    if (i % 7 === 0) {
      vitals.push({
        id: `wt-${veteranId}-${i}`,
        timestamp: new Date(date.setHours(9, 0, 0, 0)).toISOString(),
        type: 'weight',
        value: Math.floor(160 + Math.random() * 40),
        unit: 'lbs',
        isNormal: true
      });
    }
  }
  
  return vitals;
};

// Generate mock medications for a veteran
export const generateMockMedications = (veteranId: string): Medication[] => {
  const medications: Medication[] = [];
  
  if (veteranId === 'v-001') {
    // Diabetic veteran
    medications.push(
      {
        id: 'med-001',
        name: 'Metformin',
        dosage: '500mg',
        frequency: 'twice daily',
        timesPerDay: 2,
        startDate: '2022-01-15',
        instructions: 'Take with food in the morning and evening',
        isActive: true,
        adherenceRate: 0.85
      },
      {
        id: 'med-002',
        name: 'Lisinopril',
        dosage: '10mg',
        frequency: 'once daily',
        timesPerDay: 1,
        startDate: '2022-03-10',
        instructions: 'Take in the morning with or without food',
        isActive: true,
        adherenceRate: 0.92
      },
      {
        id: 'med-003',
        name: 'Sertraline',
        dosage: '50mg',
        frequency: 'once daily',
        timesPerDay: 1,
        startDate: '2022-02-01',
        instructions: 'Take in the morning with food',
        isActive: true,
        adherenceRate: 0.78
      }
    );
  } else if (veteranId === 'v-002') {
    // Depression and back pain
    medications.push(
      {
        id: 'med-004',
        name: 'Duloxetine',
        dosage: '60mg',
        frequency: 'once daily',
        timesPerDay: 1,
        startDate: '2022-04-05',
        instructions: 'Take in the morning with food',
        isActive: true,
        adherenceRate: 0.9
      },
      {
        id: 'med-005',
        name: 'Cyclobenzaprine',
        dosage: '10mg',
        frequency: 'three times daily',
        timesPerDay: 3,
        startDate: '2022-05-15',
        instructions: 'Take every 8 hours as needed for muscle spasms',
        isActive: true,
        adherenceRate: 0.65
      },
      {
        id: 'med-006',
        name: 'Ibuprofen',
        dosage: '800mg',
        frequency: 'three times daily',
        timesPerDay: 3,
        startDate: '2022-01-10',
        instructions: 'Take with food every 8 hours as needed for pain',
        isActive: true,
        adherenceRate: 0.7
      }
    );
  } else if (veteranId === 'v-003') {
    // Anxiety and TBI
    medications.push(
      {
        id: 'med-007',
        name: 'Buspirone',
        dosage: '15mg',
        frequency: 'twice daily',
        timesPerDay: 2,
        startDate: '2022-03-01',
        instructions: 'Take in the morning and evening',
        isActive: true,
        adherenceRate: 0.88
      },
      {
        id: 'med-008',
        name: 'Acetaminophen',
        dosage: '500mg',
        frequency: 'as needed',
        timesPerDay: 4,
        startDate: '2022-02-15',
        instructions: 'Take as needed for headaches, not to exceed 4 times per day',
        isActive: true,
        adherenceRate: 0.95
      }
    );
  } else if (veteranId === 'v-004') {
    // Heart condition
    medications.push(
      {
        id: 'med-009',
        name: 'Atorvastatin',
        dosage: '40mg',
        frequency: 'once daily',
        timesPerDay: 1,
        startDate: '2021-11-05',
        instructions: 'Take in the evening',
        isActive: true,
        adherenceRate: 0.82
      },
      {
        id: 'med-010',
        name: 'Aspirin',
        dosage: '81mg',
        frequency: 'once daily',
        timesPerDay: 1,
        startDate: '2021-11-05',
        instructions: 'Take in the morning with food',
        isActive: true,
        adherenceRate: 0.94
      },
      {
        id: 'med-011',
        name: 'Metoprolol',
        dosage: '25mg',
        frequency: 'twice daily',
        timesPerDay: 2,
        startDate: '2022-01-15',
        instructions: 'Take in the morning and evening',
        isActive: true,
        adherenceRate: 0.89
      }
    );
  } else if (veteranId === 'v-005') {
    // PTSD
    medications.push(
      {
        id: 'med-012',
        name: 'Prazosin',
        dosage: '1mg',
        frequency: 'once daily',
        timesPerDay: 1,
        startDate: '2022-06-01',
        instructions: 'Take at bedtime',
        isActive: true,
        adherenceRate: 0.75
      },
      {
        id: 'med-013',
        name: 'Sertraline',
        dosage: '100mg',
        frequency: 'once daily',
        timesPerDay: 1,
        startDate: '2022-02-15',
        instructions: 'Take in the morning with food',
        isActive: true,
        adherenceRate: 0.83
      }
    );
  }
  
  return medications;
};

// Generate mock symptom reports for a veteran
export const generateMockSymptomReports = (veteranId: string): SymptomReport[] => {
  const now = new Date();
  const reports: SymptomReport[] = [];
  
  for (let i = 0; i < 5; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i * 3); // One report every 3 days
    
    let symptoms = [];
    let notes = '';
    
    if (veteranId === 'v-001') {
      symptoms = [
        {
          type: 'Fatigue',
          severity: Math.floor(1 + Math.random() * 5),
          description: 'Feeling tired throughout the day'
        },
        {
          type: 'Increased Thirst',
          severity: Math.floor(1 + Math.random() * 5),
          description: 'Feeling thirsty more than usual'
        }
      ];
      notes = 'Symptoms seem to be worse after missing medication dose';
    } else if (veteranId === 'v-002') {
      symptoms = [
        {
          type: 'Back Pain',
          severity: Math.floor(3 + Math.random() * 3),
          description: 'Lower back pain, worse when sitting for long periods'
        },
        {
          type: 'Low Mood',
          severity: Math.floor(1 + Math.random() * 5),
          description: 'Feeling down and unmotivated'
        }
      ];
      notes = 'Pain medication provides temporary relief';
    } else if (veteranId === 'v-003') {
      symptoms = [
        {
          type: 'Headache',
          severity: Math.floor(1 + Math.random() * 5),
          description: 'Dull headache, primarily on the left side'
        },
        {
          type: 'Anxiety',
          severity: Math.floor(2 + Math.random() * 4),
          description: 'Feeling anxious, particularly in crowds'
        }
      ];
      notes = 'Relaxation techniques have been somewhat helpful';
    } else if (veteranId === 'v-004') {
      symptoms = [
        {
          type: 'Chest Discomfort',
          severity: Math.floor(1 + Math.random() * 3),
          description: 'Mild pressure sensation in chest, no sharp pain'
        },
        {
          type: 'Shortness of Breath',
          severity: Math.floor(1 + Math.random() * 3),
          description: 'Slightly winded after walking up stairs'
        }
      ];
      notes = 'Symptoms improve with rest';
    } else if (veteranId === 'v-005') {
      symptoms = [
        {
          type: 'Nightmares',
          severity: Math.floor(2 + Math.random() * 4),
          description: 'Disturbing dreams about combat situations'
        },
        {
          type: 'Hypervigilance',
          severity: Math.floor(2 + Math.random() * 4),
          description: 'Feeling on edge, especially in public places'
        }
      ];
      notes = 'Meditation before bed has helped with sleep quality';
    }
    
    reports.push({
      id: `sr-${veteranId}-${i}`,
      timestamp: date.toISOString(),
      symptoms,
      notes
    });
  }
  
  return reports;
};

// Generate mock appointments for a veteran
export const generateMockAppointments = (veteranId: string): Appointment[] => {
  const now = new Date();
  const appointments: Appointment[] = [];
  
  // Past appointments (completed)
  for (let i = 1; i <= 3; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i * 14); // Every two weeks in the past
    
    appointments.push({
      id: `appt-${veteranId}-past-${i}`,
      title: `Follow-up Appointment ${i}`,
      providerName: veteranId === 'v-001' || veteranId === 'v-004' ? 'Dr. Sarah Johnson' : 
                   veteranId === 'v-002' ? 'Dr. Michael Chen' : 'Dr. Lisa Patel',
      department: 'Primary Care',
      dateTime: date.toISOString(),
      duration: 30,
      isVirtual: i % 2 === 0,
      status: 'completed',
      notes: 'Regular follow-up appointment, no significant changes.'
    });
  }
  
  // Future appointments (scheduled)
  for (let i = 1; i <= 2; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() + i * 10); // Every 10 days in the future
    
    let title, department, duration;
    
    if (veteranId === 'v-001') {
      if (i === 1) {
        title = 'Diabetes Management';
        department = 'Endocrinology';
        duration = 45;
      } else {
        title = 'Mental Health Check-in';
        department = 'Mental Health';
        duration = 60;
      }
    } else if (veteranId === 'v-002') {
      if (i === 1) {
        title = 'Pain Management';
        department = 'Physical Therapy';
        duration = 60;
      } else {
        title = 'Depression Follow-up';
        department = 'Mental Health';
        duration = 45;
      }
    } else if (veteranId === 'v-003') {
      if (i === 1) {
        title = 'Anxiety Treatment';
        department = 'Mental Health';
        duration = 45;
      } else {
        title = 'TBI Assessment';
        department = 'Neurology';
        duration = 60;
      }
    } else if (veteranId === 'v-004') {
      if (i === 1) {
        title = 'Cardiology Check-up';
        department = 'Cardiology';
        duration = 30;
      } else {
        title = 'Hearing Aid Fitting';
        department = 'Audiology';
        duration = 45;
      }
    } else if (veteranId === 'v-005') {
      if (i === 1) {
        title = 'PTSD Group Therapy';
        department = 'Mental Health';
        duration = 90;
      } else {
        title = 'Individual Therapy';
        department = 'Mental Health';
        duration = 60;
      }
    }
    
    appointments.push({
      id: `appt-${veteranId}-future-${i}`,
      title,
      providerName: veteranId === 'v-001' || veteranId === 'v-004' ? 'Dr. Sarah Johnson' : 
                   veteranId === 'v-002' ? 'Dr. Michael Chen' : 'Dr. Lisa Patel',
      department,
      dateTime: date.toISOString(),
      duration,
      isVirtual: i % 2 === 0,
      status: 'scheduled'
    });
  }
  
  return appointments;
};

// Generate mock messages for a veteran
export const generateMockMessages = (veteranId: string): Message[] => {
  const now = new Date();
  const messages: Message[] = [];
  
  // Get veteran and provider names
  const veteran = mockVeterans.find(v => v.id === veteranId);
  if (!veteran) return [];
  
  const providerName = veteran.primaryProvider;
  const veteranName = veteran.name;
  
  // System notifications
  for (let i = 0; i < 3; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i * 2);
    
    messages.push({
      id: `msg-${veteranId}-sys-${i}`,
      sender: 'VetGuardian System',
      senderRole: 'system',
      recipient: veteranName,
      timestamp: date.toISOString(),
      subject: i === 0 ? 'Appointment Reminder' : 
               i === 1 ? 'Medication Refill Available' : 'Health Tip of the Week',
      content: i === 0 ? `This is a reminder that you have an appointment with ${providerName} coming up. Please confirm your attendance or reschedule if needed.` :
               i === 1 ? 'Your medication refill is available at the VA pharmacy. Please pick it up at your convenience.' :
               'Stay hydrated! Drinking enough water is essential for managing many chronic health conditions.',
      isRead: i !== 0,
      priority: i === 0 ? 'urgent' : 'normal'
    });
  }
  
  // Provider messages
  for (let i = 0; i < 2; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i * 3 - 1);
    
    messages.push({
      id: `msg-${veteranId}-prov-${i}`,
      sender: providerName,
      senderRole: 'clinician',
      recipient: veteranName,
      timestamp: date.toISOString(),
      subject: i === 0 ? 'Follow-up on Last Visit' : 'Lab Results Discussion',
      content: i === 0 ? 
        `Hello ${veteranName.split(' ')[0]}, I wanted to follow up on our last appointment. How have you been feeling with the adjusted medication dosage?` :
        `Your recent lab tests show improvement in several areas. Let's discuss these results at your upcoming appointment.`,
      isRead: i !== 0,
      priority: 'normal'
    });
    
    // Add veteran response for the older message
    if (i === 1) {
      const responseDate = new Date(date);
      responseDate.setHours(date.getHours() + 5);
      
      messages.push({
        id: `msg-${veteranId}-resp-${i}`,
        sender: veteranName,
        senderRole: 'veteran',
        recipient: providerName,
        timestamp: responseDate.toISOString(),
        subject: 'Re: Lab Results Discussion',
        content: 'Thank you for letting me know about the lab results. I am looking forward to discussing them during our upcoming appointment.',
        isRead: true,
        priority: 'normal'
      });
    }
  }
  
  return messages.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// Generate mock alerts for a veteran (for clinician view)
export const generateMockAlerts = (veteranId: string): Alert[] => {
  const now = new Date();
  const alerts: Alert[] = [];
  
  // Get veteran info
  const veteran = mockVeterans.find(v => v.id === veteranId);
  if (!veteran) return [];
  
  // Elevated vital sign alert
  if (veteranId === 'v-001' || veteranId === 'v-004') {
    const date = new Date(now);
    date.setHours(date.getHours() - 6);
    
    alerts.push({
      id: `alert-${veteranId}-vital-1`,
      veteranId,
      timestamp: date.toISOString(),
      type: 'vital_sign',
      title: veteranId === 'v-001' ? 'Elevated Blood Glucose' : 'High Blood Pressure',
      description: veteranId === 'v-001' ? 
        `${veteran.name}'s blood glucose reading was 210 mg/dL, above the target range.` :
        `${veteran.name}'s blood pressure was recorded as 156/94 mmHg, above normal range.`,
      severity: 'medium',
      isResolved: false,
      metadata: {
        reading: veteranId === 'v-001' ? '210 mg/dL' : '156/94 mmHg',
        normalRange: veteranId === 'v-001' ? '70-140 mg/dL' : '90-120/60-80 mmHg',
        trend: 'increasing'
      }
    });
  }
  
  // Medication adherence alert
  if (veteranId === 'v-002' || veteranId === 'v-005') {
    const date = new Date(now);
    date.setHours(date.getHours() - 24);
    
    alerts.push({
      id: `alert-${veteranId}-med-1`,
      veteranId,
      timestamp: date.toISOString(),
      type: 'medication',
      title: 'Medication Adherence Issue',
      description: `${veteran.name} has missed ${veteranId === 'v-002' ? 'pain medication' : 'PTSD medication'} doses for 2 consecutive days.`,
      severity: veteranId === 'v-005' ? 'high' : 'medium',
      isResolved: false,
      metadata: {
        medication: veteranId === 'v-002' ? 'Duloxetine' : 'Sertraline',
        adherenceRate: veteranId === 'v-002' ? '65%' : '70%',
        lastTaken: veteranId === 'v-002' ? '2 days ago' : '2 days ago'
      }
    });
  }
  
  // Symptom report alert
  if (veteranId === 'v-003') {
    const date = new Date(now);
    date.setHours(date.getHours() - 12);
    
    alerts.push({
      id: `alert-${veteranId}-symptom-1`,
      veteranId,
      timestamp: date.toISOString(),
      type: 'symptom',
      title: 'Worsening Headaches Reported',
      description: `${veteran.name} reported increasing frequency and severity of headaches, potentially related to TBI history.`,
      severity: 'medium',
      isResolved: false,
      metadata: {
        symptomType: 'Headache',
        severity: '4/5',
        frequency: 'Daily',
        trend: 'increasing'
      }
    });
  }
  
  // AVA prediction alert
  if (veteranId === 'v-001' || veteranId === 'v-004') {
    const date = new Date(now);
    date.setHours(date.getHours() - 2);
    
    alerts.push({
      id: `alert-${veteranId}-ava-1`,
      veteranId,
      timestamp: date.toISOString(),
      type: 'ava_prediction',
      title: veteranId === 'v-001' ? 'Potential Diabetic Complication Risk' : 'Cardiac Event Risk Prediction',
      description: veteranId === 'v-001' ?
        `AVA has detected patterns suggesting increased risk of diabetic complications for ${veteran.name}.` :
        `AVA's predictive model indicates elevated cardiac event risk for ${veteran.name} in the next 30 days.`,
      severity: 'high',
      isResolved: false,
      metadata: {
        confidence: veteranId === 'v-001' ? '78%' : '82%',
        dataPoints: veteranId === 'v-001' ? 
          'Blood glucose variability, Recent medication adherence issues, Reported increased thirst' :
          'Blood pressure trend, Heart rate variability, Recent symptom reports',
        recommendedAction: 'Schedule immediate follow-up appointment'
      }
    });
  }
  
  // Add a resolved alert for each veteran for completeness
  const date = new Date(now);
  date.setDate(date.getDate() - 5);
  
  alerts.push({
    id: `alert-${veteranId}-resolved-1`,
    veteranId,
    timestamp: date.toISOString(),
    type: 'vital_sign',
    title: 'Abnormal Vital Sign',
    description: `${veteran.name} had an abnormal vital sign reading that has since returned to normal range.`,
    severity: 'medium',
    isResolved: true,
    metadata: {
      resolvedDate: new Date(now).setDate(now.getDate() - 3).toString(),
      resolvedBy: 'Dr. ' + veteran.primaryProvider.split(' ')[1],
      resolution: 'Medication adjustment'
    }
  });
  
  return alerts;
};

// Generate mock AVA predictions for a veteran
export const generateMockAvaPredictions = (veteranId: string): AvaPrediction[] => {
  const now = new Date();
  const predictions: AvaPrediction[] = [];
  
  // Get veteran info
  const veteran = mockVeterans.find(v => v.id === veteranId);
  if (!veteran) return [];
  
  // Create predictions based on veteran condition
  if (veteranId === 'v-001') {
    // Diabetic veteran
    predictions.push({
      id: `pred-${veteranId}-1`,
      veteranId,
      timestamp: new Date(now).toISOString(),
      predictionType: 'health_decline',
      confidence: 0.78,
      details: 'Analysis of recent glucose readings shows increased variability and an upward trend, suggesting potential need for medication adjustment.',
      suggestedActions: [
        'Schedule endocrinology follow-up',
        'Review medication compliance',
        'Check for dietary changes'
      ],
      dataPoints: [
        { label: 'Avg Glucose (Last 7 Days)', value: '165 mg/dL' },
        { label: 'Glucose Variability', value: 'High' },
        { label: 'Medication Adherence', value: '85%' },
        { label: 'Reported Symptoms', value: 'Increased thirst, fatigue' }
      ]
    });
  } else if (veteranId === 'v-004') {
    // Heart condition veteran
    predictions.push({
      id: `pred-${veteranId}-1`,
      veteranId,
      timestamp: new Date(now).toISOString(),
      predictionType: 'health_decline',
      confidence: 0.82,
      details: 'Cardiac metrics show patterns consistent with increased risk of cardiac event in the next 30 days based on blood pressure trends and reported symptoms.',
      suggestedActions: [
        'Immediate cardiology consult',
        'Review medication regimen',
        'Assess for fluid retention',
        'Consider stress test'
      ],
      dataPoints: [
        { label: 'Systolic BP Trend', value: 'Increasing' },
        { label: 'Heart Rate Variability', value: 'Decreased' },
        { label: 'Reported Chest Discomfort', value: 'Mild, intermittent' },
        { label: 'Activity Tolerance', value: 'Declining' }
      ]
    });
  } else if (veteranId === 'v-002') {
    // Depression and back pain
    predictions.push({
      id: `pred-${veteranId}-1`,
      veteranId,
      timestamp: new Date(now).toISOString(),
      predictionType: 'mental_health',
      confidence: 0.71,
      details: 'Behavioral patterns and reported symptoms suggest increasing depression severity that may require intervention.',
      suggestedActions: [
        'Schedule mental health follow-up',
        'Evaluate medication effectiveness',
        'Consider pain management impact on mood',
        'Assess sleep quality'
      ],
      dataPoints: [
        { label: 'Self-reported Mood', value: 'Declining' },
        { label: 'Pain Level', value: 'Consistently high' },
        { label: 'Sleep Quality', value: 'Poor' },
        { label: 'Activity Level', value: 'Decreasing' }
      ]
    });
  } else if (veteranId === 'v-003') {
    // Anxiety and TBI
    predictions.push({
      id: `pred-${veteranId}-1`,
      veteranId,
      timestamp: new Date(now).toISOString(),
      predictionType: 'appointment_needed',
      confidence: 0.75,
      details: 'Increasing frequency and severity of headaches may indicate need for TBI follow-up assessment.',
      suggestedActions: [
        'Schedule neurology consultation',
        'Assess headache patterns',
        'Review current medications',
        'Consider additional imaging'
      ],
      dataPoints: [
        { label: 'Headache Frequency', value: 'Daily' },
        { label: 'Headache Severity', value: 'Increasing' },
        { label: 'Anxiety Level', value: 'Elevated' },
        { label: 'Cognitive Function', value: 'Stable' }
      ]
    });
  } else if (veteranId === 'v-005') {
    // PTSD
    predictions.push({
      id: `pred-${veteranId}-1`,
      veteranId,
      timestamp: new Date(now).toISOString(),
      predictionType: 'mental_health',
      confidence: 0.68,
      details: 'Recent patterns indicate increased PTSD symptoms that may benefit from therapeutic intervention.',
      suggestedActions: [
        'Schedule mental health check-in',
        'Review medication effectiveness',
        'Assess sleep disturbances',
        'Consider stress management techniques'
      ],
      dataPoints: [
        { label: 'Reported Nightmares', value: 'Increased frequency' },
        { label: 'Anxiety Level', value: 'Elevated' },
        { label: 'Medication Adherence', value: '75%' },
        { label: 'Sleep Quality', value: 'Poor' }
      ]
    });
  }
  
  return predictions;
};
