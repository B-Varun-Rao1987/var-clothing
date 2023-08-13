import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithRedirect,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  writeBatch,
  query,
  getDocs,
} from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAiyXD3MQ9kLqOtQMZ5LFESW0FnaFSbnJ8",
  authDomain: "var-clothing-db.firebaseapp.com",
  projectId: "var-clothing-db",
  storageBucket: "var-clothing-db.appspot.com",
  messagingSenderId: "235076212033",
  appId: "1:235076212033:web:cba201a7bb28b5873bbdc0"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: 'select_account',
});


export const auth = getAuth();
export const signInWithGooglePopup = () =>
  signInWithPopup(auth, googleProvider);
export const signInWithGoogleRedirect = () =>
  signInWithRedirect(auth, googleProvider);
// export const signInWithGoogleRedirect=()=>signInWithRedirect(auth,googleProvider);

export const db = getFirestore();

export const addCollectionAndDocuments = async (
  collectionKey,
  objectsToAdd,
  field
) => {
  const collectionRef = collection(db, collectionKey);
    //this will make us a collection reference.
    const batch = writeBatch(db);

    objectsToAdd.forEach((object) => {
      const docRef = doc(collectionRef, object.title.toLowerCase());
      batch.set(docRef, object);
    });
  
    await batch.commit();
    console.log('done');
  };
  
  export const getCategoriesAndDocuments = async () => {
    const collectionRef = collection(db, 'categories');
    const q = query(collectionRef);
    //This gives me an object through which I can get a snapshot from,using the method: getDocs.
    const querySnapshot=await getDocs(q);
    //getDocs gives the asynchronous ability to fetch those document snapshots that we want.This will make them all of the data encapsulated in the querySnapshot.
    const categoryMap = querySnapshot.docs.reduce((acc, docSnapshot) => {
      const { title, items } = docSnapshot.data();
      acc[title.toLowerCase()] = items;
      return acc;
    }, {});
  
    return categoryMap;
    //querySnapshot.docs will give us an array of all those individual documents inside,and the snapshots are the actual data themselves as we've seen before,when we use snapshots. 
}

export const createUserDocumentFromAuth = async (
  userAuth,
  additionalInformation = {}
) => {
  if (!userAuth) return;

  //We need to first see whether there is an existing document reference.When I use reference,it means it is a special type of object that the firestore uses when talking about an actual instance of document model.

  //doc takes three arguments.First it takes is the database that we instantiated.Second,is going to collections(So,since we know we're going to call it users collection),so we will pass in 'users' string as the collection name.Thirdly,we would pass in an identifier. 

  //The user authentication object that is returned via firebase authentication holds the user object which contains lots regarding the user object including the acces-token.Most importantly,it contains a unique-id(UID),corresponding to the authorised user.

  //So,while creating the user instance,we would like to for the authorised user instance with the help of this UID.It would help us to get the respective document reference.

  const userDocRef=doc(db,'users',userAuth.uid);

  const userSnapshot=await getDoc(userDocRef);
  if(!userSnapshot.exists()){
    //Meaning,if user does not exist in the database.
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
        ...additionalInformation,
      });
    } catch (error) {
      console.log('error creating the user', error.message);
    }
  }

  return userDocRef;
};

export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangedListener = (callback) =>
  onAuthStateChanged(auth, callback);
