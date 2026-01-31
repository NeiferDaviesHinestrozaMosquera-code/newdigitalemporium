import { db, storage } from '@/config/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
  onSnapshot
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import type { Service, Project, Testimonial, QuoteRequest, SiteSettings } from '@/types';

// Services
export const servicesCollection = collection(db, 'services');

export const getServices = async (): Promise<Service[]> => {
  const q = query(servicesCollection, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate() || new Date(),
  } as Service));
};

export const subscribeToServices = (callback: (services: Service[]) => void) => {
  const q = query(servicesCollection, orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const services = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    } as Service));
    callback(services);
  });
};

export const addService = async (service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>) => {
  const docRef = await addDoc(servicesCollection, {
    ...service,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
};

export const updateService = async (id: string, service: Partial<Service>) => {
  const docRef = doc(db, 'services', id);
  await updateDoc(docRef, {
    ...service,
    updatedAt: Timestamp.now(),
  });
};

export const deleteService = async (id: string) => {
  const docRef = doc(db, 'services', id);
  await deleteDoc(docRef);
};

// Projects
export const projectsCollection = collection(db, 'projects');

export const getProjects = async (): Promise<Project[]> => {
  const q = query(projectsCollection, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate() || new Date(),
  } as Project));
};

export const subscribeToProjects = (callback: (projects: Project[]) => void) => {
  const q = query(projectsCollection, orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const projects = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    } as Project));
    callback(projects);
  });
};

export const addProject = async (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
  const docRef = await addDoc(projectsCollection, {
    ...project,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
};

export const updateProject = async (id: string, project: Partial<Project>) => {
  const docRef = doc(db, 'projects', id);
  await updateDoc(docRef, {
    ...project,
    updatedAt: Timestamp.now(),
  });
};

export const deleteProject = async (id: string) => {
  const docRef = doc(db, 'projects', id);
  await deleteDoc(docRef);
};

// Testimonials
export const testimonialsCollection = collection(db, 'testimonials');

export const getTestimonials = async (): Promise<Testimonial[]> => {
  const q = query(testimonialsCollection, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
  } as Testimonial));
};

export const subscribeToTestimonials = (callback: (testimonials: Testimonial[]) => void) => {
  const q = query(testimonialsCollection, orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const testimonials = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    } as Testimonial));
    callback(testimonials);
  });
};

export const addTestimonial = async (testimonial: Omit<Testimonial, 'id' | 'createdAt'>) => {
  const docRef = await addDoc(testimonialsCollection, {
    ...testimonial,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
};

export const updateTestimonial = async (id: string, testimonial: Partial<Testimonial>) => {
  const docRef = doc(db, 'testimonials', id);
  await updateDoc(docRef, testimonial);
};

export const deleteTestimonial = async (id: string) => {
  const docRef = doc(db, 'testimonials', id);
  await deleteDoc(docRef);
};

// Quote Requests
export const quoteRequestsCollection = collection(db, 'quoteRequests');

export const getQuoteRequests = async (): Promise<QuoteRequest[]> => {
  const q = query(quoteRequestsCollection, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate() || new Date(),
  } as QuoteRequest));
};

export const subscribeToQuoteRequests = (callback: (requests: QuoteRequest[]) => void) => {
  const q = query(quoteRequestsCollection, orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const requests = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    } as QuoteRequest));
    callback(requests);
  });
};

export const addQuoteRequest = async (request: Omit<QuoteRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
  const docRef = await addDoc(quoteRequestsCollection, {
    ...request,
    status: 'pending',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
};

export const updateQuoteRequest = async (id: string, request: Partial<QuoteRequest>) => {
  const docRef = doc(db, 'quoteRequests', id);
  await updateDoc(docRef, {
    ...request,
    updatedAt: Timestamp.now(),
  });
};

export const deleteQuoteRequest = async (id: string) => {
  const docRef = doc(db, 'quoteRequests', id);
  await deleteDoc(docRef);
};

// Site Settings
export const siteSettingsDoc = doc(db, 'settings', 'site');

export const getSiteSettings = async (): Promise<SiteSettings | null> => {
  const docSnap = await getDoc(siteSettingsDoc);
  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as SiteSettings;
  }
  return null;
};

export const subscribeToSiteSettings = (callback: (settings: SiteSettings | null) => void) => {
  return onSnapshot(siteSettingsDoc, (docSnap) => {
    if (docSnap.exists()) {
      callback({
        id: docSnap.id,
        ...docSnap.data(),
      } as SiteSettings);
    } else {
      callback(null);
    }
  });
};

export const updateSiteSettings = async (settings: Partial<SiteSettings>) => {
  await updateDoc(siteSettingsDoc, settings);
};

// Storage
export const uploadImage = async (file: File, path: string): Promise<string> => {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
};

export const deleteImage = async (url: string) => {
  try {
    const urlParts = url.split('/');
    const fileName = urlParts[urlParts.length - 1].split('?')[0];
    const decodedName = decodeURIComponent(fileName);
    const storageRef = ref(storage, decodedName);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
  }
};
