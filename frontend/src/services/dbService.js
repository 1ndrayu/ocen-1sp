import { db } from '../firebase.config';
import { collection, addDoc, getDocs, query, where, Timestamp, orderBy } from "firebase/firestore";

/**
 * Save a new loan application to Firestore
 */
export const saveLoanApplication = async (applicationData) => {
  try {
    const docRef = await addDoc(collection(db, "applications"), {
      ...applicationData,
      status: 'pending',
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};

/**
 * Get all applications for a user
 */
export const getUserApplications = async (userId) => {
  try {
    let q;
    if (userId) {
      q = query(collection(db, "applications"), where("user_id", "==", userId), orderBy("createdAt", "desc"));
    } else {
      q = query(collection(db, "applications"), orderBy("createdAt", "desc"));
    }
    const querySnapshot = await getDocs(q);
    const apps = [];
    querySnapshot.forEach((doc) => {
      apps.push({ id: doc.id, ...doc.data() });
    });
    return apps;
  } catch (e) {
    console.error("Error getting documents: ", e);
    throw e;
  }
};
