import { useState } from 'react';

import FormInput from '../form-input/form-input.component';
import Button from '../button/button.component';

import {
  createAuthUserWithEmailAndPassword,
  createUserDocumentFromAuth,
} from '../../utils/firebase/firebase.utils';

import { SignUpContainer } from './sign-up-form.styles';

const defaultFormFields = {
  displayName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const SignUpForm = () => {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { displayName, email, password, confirmPassword } = formFields;


    // const {setCurrentUser}=useContext(UserContext);
    //sign-in will lead to this component to re-run.Not re-render,since as of now the JSX that the component returns does not use the context. 

    const resetFormFields = () => {
        setFormFields(defaultFormFields);
      };
    
      const handleSubmit = async (event) => {
        event.preventDefault();
    
        if (password !== confirmPassword) {
          alert('passwords do not match');
          return;
        }
    
        try {
          const { user } = await createAuthUserWithEmailAndPassword(
            email,
            password
          );
    
          await createUserDocumentFromAuth(user, { displayName });
          resetFormFields();
            //In case the user authentication object that is returned from createAuthUserWithEmailAndPassword,it would not have displayName,because we would be filling in data via email and password only wrt user authentication through email and password via email and password sign-in.However,we would passing the current state displayName value to createUserDocumentFromAuth with the userAuth object that is returned previously with the current value,and we will use it set the display name too into our firestore database.
        }   
        catch (error) {
            if (error.code === 'auth/email-already-in-use') {
              alert('Cannot create user, email already in use');
            } else {
              console.log('user creation encountered an error', error);
            }
          }
        };
      
        const handleChange = (event) => {
          const { name, value } = event.target;
      
          setFormFields({ ...formFields, [name]: value });
        };
      
        return (
          <SignUpContainer>
            <h2>Don't have an account?</h2>
            <span>Sign up with your email and password</span>
            <form onSubmit={handleSubmit}>
              <FormInput
                label='Display Name'
                type='text'
                required
                onChange={handleChange}
                name='displayName'
                value={displayName}
              />
      
              <FormInput
                label='Email'
                type='email'
                required
                onChange={handleChange}
                name='email'
                value={email}
              />
      
              <FormInput
                label='Password'
                type='password'
                required
                onChange={handleChange}
                name='password'
                value={password}
              />
      
              <FormInput
                label='Confirm Password'
                type='password'
                required
                onChange={handleChange}
                name='confirmPassword'
                value={confirmPassword}
              />
              <Button type='submit'>Sign Up</Button>
            </form>
          </SignUpContainer>
        );
      };
      
      export default SignUpForm;
      