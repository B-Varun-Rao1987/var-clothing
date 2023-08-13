import { createContext, useState, useEffect } from 'react';

import {
  onAuthStateChangedListener,
  createUserDocumentFromAuth,
} from '../utils/firebase/firebase.utils';

//we will see it as the actual value that I want to access.   
export const UserContext = createContext({
    setCurrentUser: () => null,
    currentUser: null,
  });
  
  export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const value = { currentUser, setCurrentUser };
  
    useEffect(() => {
      const unsubscribe = onAuthStateChangedListener((user) => {
        if (user) {
          createUserDocumentFromAuth(user);
        }
        setCurrentUser(user);
      });
  
      return unsubscribe;
    }, []);
  
    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
  };
  

//On every context that gets built for us,there will be a provider.The provider will basically be the component that bascially wraps around any other components that needs access to the values inside.

//The main objective that we have,is to store the user object.The provider is essentially allowing any of its child components to access the values inside of its useState.

//Now we need to build the empty state of the UserContext.So,currentUser being an actual object,usually the empty state of an object should be null.It is because you want to null check to define whether or not you have a user existing object or no object.An empty object is still going to evaluate as true.So we know that there's no context when the current user value is null.
// The default value of the setter function would be the empty function that returns null. 

// !important 
//Essentially what's happening is,we are going to create this user provider and we want to wrap it around the portion of our code that matters.So,we will wrap the entire App component inside of this(in index.js).Now,on doing that.If any component inside of this UserProvider,nested deep within the app can access the context value inside of the provider itself. 