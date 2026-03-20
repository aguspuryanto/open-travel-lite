import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { collection, onSnapshot, doc, setDoc, addDoc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { handleFirestoreError, OperationType } from '../utils/firestoreErrorHandler';
import { onAuthStateChanged, User } from 'firebase/auth';

// Types
export interface Vehicle {
  id: string;
  name: string;
  licensePlate: string;
  capacity: number;
  transmission: 'Manual' | 'Automatic';
  fuel: string;
  year: number;
  images: string[];
  facilities: string[];
  terms: string;
  status: 'Available' | 'Rented' | 'Maintenance';
}

export interface RoutePrice {
  id: string;
  vehicleId: string;
  origin: string;
  destination: string;
  price: number;
}

export interface Destination {
  id: string;
  title: string;
  description: string;
  image: string;
  price?: number;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  image: string;
  date: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  caption: string;
  title?: string;
  category?: string;
}

export interface FinanceRecord {
  id: string;
  date: string;
  type: 'Income' | 'Expense';
  amount: number;
  description: string;
  category: string;
}

export interface VehicleActivity {
  id: string;
  vehicleId: string;
  date: string;
  time: string;
  route: string;
  type: string;
  customerName: string;
  description: string;
  status: 'Scheduled' | 'On Trip' | 'Completed' | 'Cancelled' | 'Maintenance';
}

export interface Settings {
  siteName: string;
  tagline: string;
  description: string;
  whatsappNumbers: string[];
  googleMapsIframe: string;
  seoKeywords: string;
}

interface AppState {
  vehicles: Vehicle[];
  routePrices: RoutePrice[];
  destinations: Destination[];
  articles: Article[];
  gallery: GalleryImage[];
  finances: FinanceRecord[];
  activities: VehicleActivity[];
  settings: Settings;
  user: User | null;
  isAuthReady: boolean;
}

interface AppContextType extends AppState {
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => Promise<void>;
  updateVehicle: (id: string, vehicle: Partial<Vehicle>) => Promise<void>;
  deleteVehicle: (id: string) => Promise<void>;
  
  addRoutePrice: (routePrice: Omit<RoutePrice, 'id'>) => Promise<void>;
  updateRoutePrice: (id: string, routePrice: Partial<RoutePrice>) => Promise<void>;
  deleteRoutePrice: (id: string) => Promise<void>;

  addDestination: (destination: Omit<Destination, 'id'>) => Promise<void>;
  updateDestination: (id: string, destination: Partial<Destination>) => Promise<void>;
  deleteDestination: (id: string) => Promise<void>;

  addArticle: (article: Omit<Article, 'id'>) => Promise<void>;
  updateArticle: (id: string, article: Partial<Article>) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;

  addGalleryImage: (image: Omit<GalleryImage, 'id'>) => Promise<void>;
  updateGalleryImage: (id: string, image: Partial<GalleryImage>) => Promise<void>;
  deleteGalleryImage: (id: string) => Promise<void>;

  addFinanceRecord: (record: Omit<FinanceRecord, 'id'>) => Promise<void>;
  updateFinanceRecord: (id: string, record: Partial<FinanceRecord>) => Promise<void>;
  deleteFinanceRecord: (id: string) => Promise<void>;

  addActivity: (activity: Omit<VehicleActivity, 'id'>) => Promise<void>;
  updateActivity: (id: string, activity: Partial<VehicleActivity>) => Promise<void>;
  deleteActivity: (id: string) => Promise<void>;

  updateSettings: (settings: Settings) => Promise<void>;
}

const defaultSettings: Settings = {
  siteName: 'Open Travel Pro',
  tagline: 'Marketplace Travel & Rental Mobil Terlengkap',
  description: 'Solusi perjalanan dan rental mobil terbaik dengan harga transparan dan pelayanan profesional.',
  whatsappNumbers: ['+6281234567890'],
  googleMapsIframe: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.666427009762!2d106.82496411476892!3d-6.175392395529198!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f5d2e764b12d%3A0x3d2ad6e1e0e9bcc8!2sMonumen%20Nasional!5e0!3m2!1sen!2sid!4v1628567890123!5m2!1sen!2sid" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>',
  seoKeywords: 'rental mobil, travel, sewa mobil murah, open travel pro',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [routePrices, setRoutePrices] = useState<RoutePrice[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [finances, setFinances] = useState<FinanceRecord[]>([]);
  const [activities, setActivities] = useState<VehicleActivity[]>([]);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isAuthReady) return;

    const unsubVehicles = onSnapshot(collection(db, 'vehicles'), (snapshot) => {
      setVehicles(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Vehicle)));
    }, (error) => handleFirestoreError(error, OperationType.GET, 'vehicles'));

    const unsubRoutePrices = onSnapshot(collection(db, 'routePrices'), (snapshot) => {
      setRoutePrices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RoutePrice)));
    }, (error) => handleFirestoreError(error, OperationType.GET, 'routePrices'));

    const unsubDestinations = onSnapshot(collection(db, 'destinations'), (snapshot) => {
      setDestinations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Destination)));
    }, (error) => handleFirestoreError(error, OperationType.GET, 'destinations'));

    const unsubArticles = onSnapshot(collection(db, 'articles'), (snapshot) => {
      setArticles(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Article)));
    }, (error) => handleFirestoreError(error, OperationType.GET, 'articles'));

    const unsubGallery = onSnapshot(collection(db, 'gallery'), (snapshot) => {
      setGallery(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryImage)));
    }, (error) => handleFirestoreError(error, OperationType.GET, 'gallery'));

    const unsubSettings = onSnapshot(doc(db, 'settings', 'global'), (docSnap) => {
      if (docSnap.exists()) {
        setSettings(docSnap.data() as Settings);
      } else if (user) {
        setDoc(doc(db, 'settings', 'global'), defaultSettings).catch(e => handleFirestoreError(e, OperationType.WRITE, 'settings/global'));
      }
    }, (error) => handleFirestoreError(error, OperationType.GET, 'settings/global'));

    let unsubFinances = () => {};
    let unsubActivities = () => {};

    if (user) {
      unsubFinances = onSnapshot(collection(db, 'finances'), (snapshot) => {
        setFinances(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FinanceRecord)));
      }, (error) => handleFirestoreError(error, OperationType.GET, 'finances'));

      unsubActivities = onSnapshot(collection(db, 'activities'), (snapshot) => {
        setActivities(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as VehicleActivity)));
      }, (error) => handleFirestoreError(error, OperationType.GET, 'activities'));
    } else {
      setFinances([]);
      setActivities([]);
    }

    return () => {
      unsubVehicles();
      unsubRoutePrices();
      unsubDestinations();
      unsubArticles();
      unsubGallery();
      unsubSettings();
      unsubFinances();
      unsubActivities();
    };
  }, [user, isAuthReady]);

  const addVehicle = async (vehicle: Omit<Vehicle, 'id'>) => {
    try { await addDoc(collection(db, 'vehicles'), vehicle); } catch (e) { handleFirestoreError(e, OperationType.CREATE, 'vehicles'); }
  };
  const updateVehicle = async (id: string, vehicle: Partial<Vehicle>) => {
    try { await updateDoc(doc(db, 'vehicles', id), vehicle); } catch (e) { handleFirestoreError(e, OperationType.UPDATE, `vehicles/${id}`); }
  };
  const deleteVehicle = async (id: string) => {
    try { await deleteDoc(doc(db, 'vehicles', id)); } catch (e) { handleFirestoreError(e, OperationType.DELETE, `vehicles/${id}`); }
  };

  const addRoutePrice = async (routePrice: Omit<RoutePrice, 'id'>) => {
    try { await addDoc(collection(db, 'routePrices'), routePrice); } catch (e) { handleFirestoreError(e, OperationType.CREATE, 'routePrices'); }
  };
  const updateRoutePrice = async (id: string, routePrice: Partial<RoutePrice>) => {
    try { await updateDoc(doc(db, 'routePrices', id), routePrice); } catch (e) { handleFirestoreError(e, OperationType.UPDATE, `routePrices/${id}`); }
  };
  const deleteRoutePrice = async (id: string) => {
    try { await deleteDoc(doc(db, 'routePrices', id)); } catch (e) { handleFirestoreError(e, OperationType.DELETE, `routePrices/${id}`); }
  };

  const addDestination = async (destination: Omit<Destination, 'id'>) => {
    try { await addDoc(collection(db, 'destinations'), destination); } catch (e) { handleFirestoreError(e, OperationType.CREATE, 'destinations'); }
  };
  const updateDestination = async (id: string, destination: Partial<Destination>) => {
    try { await updateDoc(doc(db, 'destinations', id), destination); } catch (e) { handleFirestoreError(e, OperationType.UPDATE, `destinations/${id}`); }
  };
  const deleteDestination = async (id: string) => {
    try { await deleteDoc(doc(db, 'destinations', id)); } catch (e) { handleFirestoreError(e, OperationType.DELETE, `destinations/${id}`); }
  };

  const addArticle = async (article: Omit<Article, 'id'>) => {
    try { await addDoc(collection(db, 'articles'), article); } catch (e) { handleFirestoreError(e, OperationType.CREATE, 'articles'); }
  };
  const updateArticle = async (id: string, article: Partial<Article>) => {
    try { await updateDoc(doc(db, 'articles', id), article); } catch (e) { handleFirestoreError(e, OperationType.UPDATE, `articles/${id}`); }
  };
  const deleteArticle = async (id: string) => {
    try { await deleteDoc(doc(db, 'articles', id)); } catch (e) { handleFirestoreError(e, OperationType.DELETE, `articles/${id}`); }
  };

  const addGalleryImage = async (image: Omit<GalleryImage, 'id'>) => {
    try { await addDoc(collection(db, 'gallery'), image); } catch (e) { handleFirestoreError(e, OperationType.CREATE, 'gallery'); }
  };
  const updateGalleryImage = async (id: string, image: Partial<GalleryImage>) => {
    try { await updateDoc(doc(db, 'gallery', id), image); } catch (e) { handleFirestoreError(e, OperationType.UPDATE, `gallery/${id}`); }
  };
  const deleteGalleryImage = async (id: string) => {
    try { await deleteDoc(doc(db, 'gallery', id)); } catch (e) { handleFirestoreError(e, OperationType.DELETE, `gallery/${id}`); }
  };

  const addFinanceRecord = async (record: Omit<FinanceRecord, 'id'>) => {
    try { await addDoc(collection(db, 'finances'), record); } catch (e) { handleFirestoreError(e, OperationType.CREATE, 'finances'); }
  };
  const updateFinanceRecord = async (id: string, record: Partial<FinanceRecord>) => {
    try { await updateDoc(doc(db, 'finances', id), record); } catch (e) { handleFirestoreError(e, OperationType.UPDATE, `finances/${id}`); }
  };
  const deleteFinanceRecord = async (id: string) => {
    try { await deleteDoc(doc(db, 'finances', id)); } catch (e) { handleFirestoreError(e, OperationType.DELETE, `finances/${id}`); }
  };

  const addActivity = async (activity: Omit<VehicleActivity, 'id'>) => {
    try { await addDoc(collection(db, 'activities'), activity); } catch (e) { handleFirestoreError(e, OperationType.CREATE, 'activities'); }
  };
  const updateActivity = async (id: string, activity: Partial<VehicleActivity>) => {
    try { await updateDoc(doc(db, 'activities', id), activity); } catch (e) { handleFirestoreError(e, OperationType.UPDATE, `activities/${id}`); }
  };
  const deleteActivity = async (id: string) => {
    try { await deleteDoc(doc(db, 'activities', id)); } catch (e) { handleFirestoreError(e, OperationType.DELETE, `activities/${id}`); }
  };

  const updateSettings = async (newSettings: Settings) => {
    try { await setDoc(doc(db, 'settings', 'global'), newSettings); } catch (e) { handleFirestoreError(e, OperationType.WRITE, 'settings/global'); }
  };

  return (
    <AppContext.Provider value={{
      vehicles, addVehicle, updateVehicle, deleteVehicle,
      routePrices, addRoutePrice, updateRoutePrice, deleteRoutePrice,
      destinations, addDestination, updateDestination, deleteDestination,
      articles, addArticle, updateArticle, deleteArticle,
      gallery, addGalleryImage, updateGalleryImage, deleteGalleryImage,
      finances, addFinanceRecord, updateFinanceRecord, deleteFinanceRecord,
      activities, addActivity, updateActivity, deleteActivity,
      settings, updateSettings,
      user, isAuthReady
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
