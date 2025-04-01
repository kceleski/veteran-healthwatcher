
import {
  mockVeterans,
  generateMockVitals,
  generateMockMedications,
  generateMockSymptomReports,
  generateMockAppointments,
  generateMockMessages,
  generateMockAlerts,
  generateMockAvaPredictions,
  type Veteran,
  type VitalReading,
  type Medication,
  type SymptomReport,
  type Appointment,
  type Message,
  type Alert,
  type AvaPrediction
} from './mockData';

// Simulate API request delay
const simulateDelay = async () => {
  return new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 300));
};

// API error simulation (10% chance of failure)
const simulateError = async () => {
  if (Math.random() < 0.05) {
    throw new Error("Simulated API error. Please try again.");
  }
};

// Veterans API
export const getVeterans = async (): Promise<Veteran[]> => {
  await simulateDelay();
  await simulateError();
  return [...mockVeterans];
};

export const getVeteranById = async (id: string): Promise<Veteran> => {
  await simulateDelay();
  await simulateError();
  const veteran = mockVeterans.find(v => v.id === id);
  if (!veteran) {
    throw new Error(`Veteran with ID ${id} not found.`);
  }
  return { ...veteran };
};

// Vitals API
export const getVitalsForVeteran = async (veteranId: string): Promise<VitalReading[]> => {
  await simulateDelay();
  await simulateError();
  return generateMockVitals(veteranId);
};

export const addVitalReading = async (veteranId: string, reading: Omit<VitalReading, 'id'>): Promise<VitalReading> => {
  await simulateDelay();
  await simulateError();
  return {
    id: `vital-${Date.now()}`,
    ...reading
  };
};

// Medications API
export const getMedicationsForVeteran = async (veteranId: string): Promise<Medication[]> => {
  await simulateDelay();
  await simulateError();
  return generateMockMedications(veteranId);
};

export const updateMedicationAdherence = async (medicationId: string, taken: boolean): Promise<void> => {
  await simulateDelay();
  await simulateError();
  // In a real app, this would update the database
  console.log(`Medication ${medicationId} marked as ${taken ? 'taken' : 'not taken'}`);
};

// Symptom Reports API
export const getSymptomReportsForVeteran = async (veteranId: string): Promise<SymptomReport[]> => {
  await simulateDelay();
  await simulateError();
  return generateMockSymptomReports(veteranId);
};

export const addSymptomReport = async (veteranId: string, report: Omit<SymptomReport, 'id'>): Promise<SymptomReport> => {
  await simulateDelay();
  await simulateError();
  return {
    id: `symptom-${Date.now()}`,
    ...report
  };
};

// Appointments API
export const getAppointmentsForVeteran = async (veteranId: string): Promise<Appointment[]> => {
  await simulateDelay();
  await simulateError();
  return generateMockAppointments(veteranId);
};

export const scheduleAppointment = async (appointment: Omit<Appointment, 'id' | 'status'>): Promise<Appointment> => {
  await simulateDelay();
  await simulateError();
  return {
    id: `appt-${Date.now()}`,
    status: 'scheduled',
    ...appointment
  };
};

export const updateAppointmentStatus = async (appointmentId: string, status: 'scheduled' | 'completed' | 'canceled' | 'rescheduled'): Promise<void> => {
  await simulateDelay();
  await simulateError();
  console.log(`Appointment ${appointmentId} status changed to ${status}`);
};

// Messages API
export const getMessagesForVeteran = async (veteranId: string): Promise<Message[]> => {
  await simulateDelay();
  await simulateError();
  return generateMockMessages(veteranId);
};

export const sendMessage = async (message: Omit<Message, 'id' | 'timestamp' | 'isRead'>): Promise<Message> => {
  await simulateDelay();
  await simulateError();
  return {
    id: `msg-${Date.now()}`,
    timestamp: new Date().toISOString(),
    isRead: false,
    ...message
  };
};

export const markMessageAsRead = async (messageId: string): Promise<void> => {
  await simulateDelay();
  await simulateError();
  console.log(`Message ${messageId} marked as read`);
};

// Alerts API (for clinician view)
export const getAlertsForVeteran = async (veteranId: string): Promise<Alert[]> => {
  await simulateDelay();
  await simulateError();
  return generateMockAlerts(veteranId);
};

export const getAllAlerts = async (): Promise<Alert[]> => {
  await simulateDelay();
  await simulateError();
  return mockVeterans.flatMap(veteran => generateMockAlerts(veteran.id));
};

export const resolveAlert = async (alertId: string): Promise<void> => {
  await simulateDelay();
  await simulateError();
  console.log(`Alert ${alertId} marked as resolved`);
};

// AVA Predictions API
export const getPredictionsForVeteran = async (veteranId: string): Promise<AvaPrediction[]> => {
  await simulateDelay();
  await simulateError();
  return generateMockAvaPredictions(veteranId);
};

// VistA Integration Mock API
export const synchronizeWithVistA = async (veteranId: string): Promise<{ success: boolean; message: string }> => {
  await simulateDelay();
  await simulateError();
  return {
    success: true,
    message: `Successfully synchronized data for veteran ${veteranId} with VistA EHR system.`
  };
};

// User authentication mock
export interface AuthResponse {
  user: {
    id: string;
    name: string;
    role: 'veteran' | 'clinician';
    avatar?: string;
  };
  token: string;
}

export const loginUser = async (credentials: { username: string; password: string }): Promise<AuthResponse> => {
  await simulateDelay();
  
  if (credentials.username.includes('veteran')) {
    return {
      user: {
        id: 'v-001',
        name: 'James Wilson',
        role: 'veteran',
        avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=JW'
      },
      token: 'mock-veteran-token-123456'
    };
  } else if (credentials.username.includes('clinician')) {
    return {
      user: {
        id: 'c-001',
        name: 'Dr. Sarah Johnson',
        role: 'clinician',
        avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=SJ'
      },
      token: 'mock-clinician-token-654321'
    };
  }
  
  throw new Error('Invalid credentials');
};

// New functions for treatment planning and patient searching

// Search for patients by name, ID, or condition
export const searchPatients = async (query: string): Promise<Veteran[]> => {
  await simulateDelay();
  await simulateError();
  
  if (!query) return [];
  
  const normalizedQuery = query.toLowerCase();
  
  return mockVeterans.filter(veteran => 
    veteran.name.toLowerCase().includes(normalizedQuery) ||
    veteran.id.toLowerCase().includes(normalizedQuery) ||
    veteran.conditions.some(condition => condition.toLowerCase().includes(normalizedQuery))
  );
};

// Interface for care plan operations
interface CarePlanInput {
  patientId: string;
  patientName: string;
  condition: string;
  goals: string;
  medications: string;
  notes: string;
}

export const createCarePlan = async (planData: CarePlanInput): Promise<{id: number}> => {
  await simulateDelay();
  await simulateError();
  
  // In a real app, this would create a record in the database
  return {
    id: Date.now()
  };
};

export const updateCarePlan = async (planId: number, updates: Partial<CarePlanInput>): Promise<void> => {
  await simulateDelay();
  await simulateError();
  
  // In a real app, this would update a record in the database
  console.log(`Care plan ${planId} updated with:`, updates);
};

// More detailed appointment scheduling
interface AppointmentInput {
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  type: string;
  provider: string;
  location: string;
  notes?: string;
}

export const scheduleAppointmentDetailed = async (appointmentData: AppointmentInput): Promise<{id: number}> => {
  await simulateDelay();
  await simulateError();
  
  // In a real app, this would create a record in the database
  return {
    id: Date.now()
  };
};
