import SignUpForm from '../../components/sign-up-form/sign-up-form.component';
import SignInForm from '../../components/sign-in-form/sign-in-form.component';

import { AuthenticationContainer } from './authentication.styles';

//call to database is asynchronous.

// const myFunction = async () => {
//     const response=await getRedirectResult(auth);
//     if(response){
//         const userDocRef=await createUserDocumentFromAuth(response.user);
//     }
// };



const Authentication=()=>{

    // useEffect(()=>{
    //     myFunction();
    // },[]);

    //will run only once,when the sign-in mounted for the first time.

    // const logGoogleRedirectUser=async ()=>{
    //     const {user}=await signInWithGoogleRedirect();
    //     const userDocRef=await createUserDocumentFromAuth(user);
    // };
    
    return (
        <AuthenticationContainer>
        <SignInForm />
        <SignUpForm />
      </AuthenticationContainer>
    );
  };

export default Authentication;

