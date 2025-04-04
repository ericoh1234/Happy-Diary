import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { Entry, InsertEntry } from '@shared/schema';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA8d4xvwpKKng61SiopQ7czOrayznvVeaQ",
  authDomain: "diary-ee2e7.firebaseapp.com",
  projectId: "diary-ee2e7",
  storageBucket: "diary-ee2e7.firebasestorage.app",
  messagingSenderId: "585474363501",
  appId: "1:585474363501:web:927d697394d80b6b0b6f64"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Collection references
const entriesCollection = collection(db, 'entries');

// Helper function to convert Firestore data to our Entry type
const convertToEntry = (id: string, data: any): Entry => {
  return {
    id: parseInt(id), // Keep using numbers for IDs to maintain compatibility
    title: data.title,
    content: data.content,
    createdAt: data.createdAt?.toDate() || new Date() // Convert Firestore Timestamp to Date
  };
};

export const firebaseDb = {
  // Get all entries
  getEntries: async (): Promise<Entry[]> => {
    try {
      const q = query(entriesCollection, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const entries: Entry[] = [];
      
      querySnapshot.forEach((doc) => {
        entries.push(convertToEntry(doc.id, doc.data()));
      });
      
      return entries;
    } catch (error) {
      console.error('Error getting entries from Firebase:', error);
      return [];
    }
  },
  
  // Get a single entry
  getEntry: async (id: number): Promise<Entry | undefined> => {
    try {
      // Convert numeric id to string for Firestore
      const entryRef = doc(entriesCollection, id.toString());
      const docSnap = await getDoc(entryRef);
      
      if (docSnap.exists()) {
        return convertToEntry(docSnap.id, docSnap.data());
      } else {
        return undefined;
      }
    } catch (error) {
      console.error('Error getting entry from Firebase:', error);
      return undefined;
    }
  },
  
  // Create a new entry
  createEntry: async (entry: InsertEntry): Promise<Entry> => {
    try {
      const docRef = await addDoc(entriesCollection, {
        ...entry,
        createdAt: serverTimestamp()
      });
      
      // Get the newly created document
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return convertToEntry(docSnap.id, {
          ...docSnap.data(),
          // Since serverTimestamp() might not be immediately available in the snapshot
          createdAt: docSnap.data().createdAt || new Date()
        });
      } else {
        throw new Error('Failed to retrieve created entry');
      }
    } catch (error) {
      console.error('Error creating entry in Firebase:', error);
      throw error;
    }
  },
  
  // Update an entry
  updateEntry: async (id: number, updatedEntry: Partial<InsertEntry>): Promise<Entry | undefined> => {
    try {
      const entryRef = doc(entriesCollection, id.toString());
      
      // Check if the entry exists
      const docSnap = await getDoc(entryRef);
      if (!docSnap.exists()) {
        return undefined;
      }
      
      // Update the document
      await updateDoc(entryRef, updatedEntry);
      
      // Get the updated document
      const updatedDocSnap = await getDoc(entryRef);
      
      if (updatedDocSnap.exists()) {
        return convertToEntry(updatedDocSnap.id, updatedDocSnap.data());
      } else {
        return undefined;
      }
    } catch (error) {
      console.error('Error updating entry in Firebase:', error);
      return undefined;
    }
  },
  
  // Delete an entry
  deleteEntry: async (id: number): Promise<boolean> => {
    try {
      const entryRef = doc(entriesCollection, id.toString());
      
      // Check if the entry exists
      const docSnap = await getDoc(entryRef);
      if (!docSnap.exists()) {
        return false;
      }
      
      // Delete the document
      await deleteDoc(entryRef);
      return true;
    } catch (error) {
      console.error('Error deleting entry from Firebase:', error);
      return false;
    }
  }
};