import { 
  getFirestore, 
  collection, 
  setDoc, 
  addDoc,
  getDoc,
  deleteDoc, 
  getDocs,
  doc,
  where,
  query,
  updateDoc,
} from "firebase/firestore";

import { googleProvider, ownerMail } from "../firebase/config";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  getAuth,
  signOut,
  fetchSignInMethodsForEmail,
  linkWithCredential,
  FacebookAuthProvider,
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  PhoneAuthProvider, 
  signInWithCredential,  
} from "firebase/auth";

export const ERROR_DISPLAY_ON = 'ERROR_DISPLAY_ON';
export const ERROR_DISPLAY_OFF = 'ERROR_DISPLAY_OFF';
export const LOADER_DISPLAY_ON = 'LOADER_DISPLAY_ON';
export const LOADER_DISPLAY_OFF = 'LOADER_DISPLAY_OFF';
export const GET_USERS = 'GET_USERS';
export const SET_USERS = 'SET_USERS';
export const GET_TRIPS = 'GET_TRIPS';
export const AUTH = 'AUTH';
export const LOGOUT = 'LOGOUT';

export function errorOn(text){
  return dispatch => {
    dispatch({ type: ERROR_DISPLAY_ON, text });
  }
}

export function loaderOn(){
  return{
      type: LOADER_DISPLAY_ON,
  }
}

export function loaderOff(){
  return{
      type: LOADER_DISPLAY_OFF,
  }
}

export const signInViaSocialNetwork = (provider, navigate, toast) => async (dispatch) => {
  const auth = getAuth();

  try {  
    const result = await signInWithPopup(auth, provider).catch((error) => {
      if (error.code === 'auth/account-exists-with-different-credential') {
        const email = error.customData.email;

        fetchSignInMethodsForEmail(auth, email)
        .then((providers) => {
          const googleProviderExists = providers.includes("google.com");

          if (googleProviderExists) {
            googleProvider.setCustomParameters({ login_hint: email });
            return signInWithPopup(auth, googleProvider)
              .then((userCredential) => {
                const { user } = userCredential;
                return linkWithCredential(user, FacebookAuthProvider.credentialFromError(error));
              })
          }
        })
      }
    });

    const db = getFirestore();
    const userDocRef = doc(db, 'users', result.user.uid);

    const usersCollection = collection(db, 'users');
    const querySnapshot = await getDocs(usersCollection);

    let userExists = false;

    querySnapshot.forEach(doc => {
      if (doc.data().email === result.user.email) {
        userExists = true;

        dispatch({
          type: AUTH,
          data: doc.data()
        });
        navigate('/')
      }
    });

    if(!userExists){
      await setDoc(userDocRef, {
        name: result.user.displayName,
        isAdmin: auth.currentUser.email === ownerMail ? true : false,
        role: 'passenger',
        email: result.user.email,
        id: result.user.uid,
      }).then(() => {
        dispatch({
          type: AUTH,
          data: {
            name: result.user.displayName,
            isAdmin: auth.currentUser.email === ownerMail ? true : false,
            role: 'passenger',
            email: result.user.email,
            id: result.user.uid,
          },
        });
    
        navigate('/');
      });
    }
  } catch (error) {
    console.error(error);
  }
};

export const login = (values, toast, setSubmitting, resetForm, navigate) => async (dispatch) => {
  const auth = getAuth();
  const db = getFirestore();

  signInWithEmailAndPassword(auth, values.email, values.password)
    .then(() => {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      getDoc(userDocRef).then((doc) => {
        const user = doc.data();

        if(user){
          dispatch({
            type: AUTH,
            data: {
              name: user.name,
              role: user.role,
              isAdmin: user.isAdmin,
              email: user.email,
              id: auth.currentUser.uid,
            },
          });

          navigate('/');
        } else {
          toast.error('User not found!')
        }
      })
    }).catch((error) => {
      if (error.code === 'auth/wrong-password') {
        toast.error('Invalid credentials!');
      } else if (error.code === 'auth/user-not-found'){
        toast.error('User not found!');
      } else {
        toast.error('Error')
      }
    }).finally(() => {
      setSubmitting(false);
      resetForm();
    });
};

export const logout = (navigate) => async (dispatch) => {
  try {
    const auth = getAuth();
    
    await signOut(auth).then(() => {
      navigate('/auth')
      dispatch({ type: LOGOUT });
    }).catch((error) => {
      dispatch(errorOn(error.response.status));
    });
  } catch (error) {
    dispatch(errorOn(error.response.status));
  }
};

export const register = (values, toast, setSubmitting, resetForm, navigate) => async (dispatch) => {
  const auth = getAuth();
  const db = getFirestore();
  
  createUserWithEmailAndPassword(auth, values.email, values.password)
    .then(async() => {
      const usersRef = collection(db, 'users');
      const userDoc = doc(usersRef, auth.currentUser.uid);

      const usersCollection = collection(db, 'users');
      const querySnapshot = await getDocs(usersCollection);
    
      let userExist;
      querySnapshot.forEach(doc => {
        if (doc.data().email === auth.currentUser.email) {  
          userExist = true;
        }
      });
      
      if(!userExist) {
        setDoc(userDoc, {
          name: values.name,
          role: values.role,
          isAdmin: auth.currentUser.email === ownerMail ? true : false,
          email: values.email,
          id: auth.currentUser.uid,
        });
      }

      dispatch({
        type: AUTH,
        data: {
          name: values.name,
          role: values.role,
          isAdmin: auth.currentUser.email === ownerMail ? true : false,
          email: values.email,
          id: auth.currentUser.uid,
        },
      });

      navigate('/');
    }).catch((error) => {
      if (error.code === 'auth/email-already-in-use') {
        toast.error('User already exists!');
      } else {
        toast.error('Error');
      }
    }).finally(() => {
      setSubmitting(false);
      resetForm();
    });
};

export const getUsers = () => async (dispatch) => {
  const db = getFirestore();

  try {
    dispatch(loaderOn());
    await getDocs(collection(db, "users")).then((res) => {
      const formData = res.docs.map((doc) => doc.data());
      dispatch({ type: GET_USERS, data: formData });

    }).finally(() => dispatch(loaderOff()));
  } catch (error) {
    dispatch(errorOn(error));
  }
};

export const changeUserSettings = (values, user) => async (dispatch) => {
  const db = getFirestore();

  const dataToUpdate = {
    name: values.name,
    role: values.role
  }
  
  try {
    const userRef = doc(db, "users", user.id);

    await updateDoc(userRef, dataToUpdate).then(() => {
      dispatch(getUsers());
    });
  } catch (error) {
    console.log(error)

    dispatch(errorOn(error.response.status));
  }
}

export const createTrip = (trip, toast) => async (dispatch) => {
  const db = getFirestore();

  try {
    await addDoc(collection(db, "trips"), trip).then(() => {
      toast.success('Your trip has been successfully created, please wait while the dispatcher processes the request')
      dispatch(getTrips());
    });
  } catch (error) {
    dispatch(errorOn(error.response.status));
  }
};

export const getTrips = () => async (dispatch) => {
  const db = getFirestore();

  try {
    dispatch(loaderOn());
    const tripsCollection = collection(db, 'trips');
    const tripsSnapshot = await getDocs(tripsCollection);

    const tripsData = [];
    
    tripsSnapshot.forEach((doc) => {
      tripsData.push({ id: doc.id, ...doc.data() });
    });

    dispatch({ type: GET_TRIPS, data: tripsData });
  } catch (error) {
    dispatch(errorOn(error));
  } finally {
    dispatch(loaderOff());
  }
};

export const deleteTrip = (id) => async (dispatch) => {
  const db = getFirestore();
  const tripDocRef = doc(db, 'trips', id);

  try {
    await deleteDoc(tripDocRef).then(() => dispatch(getTrips()));
  } catch (error) {
    dispatch(errorOn(error));
  }
};

export const sendVerificationCode = (phoneNumber, setVerificationId, setErrorMessage, toast, authMode) => async (dispatch) => {
  const auth = getAuth();
  const db = getFirestore();

  try {
    const phoneRef = collection(db, "users");
    const phoneField = query(phoneRef, where("phone", "==", phoneNumber));
    const querySnapshot = await getDocs(phoneField);
    
    if(!querySnapshot.empty && authMode === 'register'){
      toast.error('User exists');
    } else if(authMode === 'login' && querySnapshot.empty){
      toast.error('User not found');
    } else {
      const verifier = new RecaptchaVerifier('recaptcha', {
        callback: () => {},
        onError: (error) => console.error('error', error)
      }, auth);
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, verifier);

      setVerificationId(confirmationResult.verificationId);

      toast.success('SMS sent successfully');
    }
  } catch (error){
    setErrorMessage(error.code)
  }
}

export const verifyCode = (verificationId, values, setErrorMessage, authMode, navigate) => async (dispatch) => {
  const auth = getAuth();
  const db = getFirestore();

  try {
    const usersRef = collection(db, "users");
    const phoneField = query(usersRef, where("phone", "==", values.phone));
    const querySnapshot = await getDocs(phoneField);
    const credential = PhoneAuthProvider.credential(verificationId, values.verificationCode);

    await signInWithCredential(auth, credential)
      .then(async (userCredential) => {
        const userDoc = doc(usersRef, userCredential.user.uid);

        if(authMode === 'register' && querySnapshot.empty) {
          await setDoc(userDoc, {
            phone: values.phone,
            name: values.name,
            role: values.role,
            isAdmin: false,
            id: userCredential.user.uid
          })
        }
        dispatch({
          type: AUTH,
          data: {
            name: values.name,
            role: values.role,
            isAdmin: false,
            phone: values.phone,
            id: userCredential.user.uid,
          },
        }); 

        navigate('/');
      }).catch(err => console.log('err', err));
  } catch (error) {
    setErrorMessage(error.code)
  }
}
