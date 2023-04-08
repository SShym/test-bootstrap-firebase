import 'firebase/compat/auth';
import { useDispatch } from "react-redux";
import { signInViaSocialNetwork, login, register } from '../../redux/actions';
import { FcGoogle } from 'react-icons/fc';
import { AiOutlineMail } from 'react-icons/ai';
import { AiFillFacebook } from 'react-icons/ai';
import { AiOutlinePhone } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Toaster } from 'react-hot-toast';
import { toast } from 'react-hot-toast';
import * as Yup from 'yup';
import { googleProvider, facebookProvider } from '../../firebase/config';
import PhoneAuth from './PhoneAuth';

const Auth = () => {
  const [authMode, setAuthMode] = useState('login');
  const [phoneAuth, setPhoneAuth] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLoginViaSN = (provider) => dispatch(signInViaSocialNetwork(provider, navigate, toast));

  const loginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().required('Required'),
  });

  const registerSchema = Yup.object().shape({
    name: Yup.string().required('Required').max(35, 'Name is too large'),
    email: Yup.string().email('Invalid email').required('Required').max(35, 'Email is too large'),
    password: Yup.string().min(6, 'Must be at least 6 characters').required('Required'),
    role: Yup.string().required('Required'),
  });

  return (
    <div className='d-flex flex-column flex-md-row justify-content-center align-items-center vh-100'>
      {!phoneAuth ?
        <div className='position-relative bg-white shadow-sm d-flex flex-column border p-3'>
          <Formik
            initialValues={{ 
              name: '', 
              email: '', 
              role: 'passenger',
              password: ''
            }}
            validationSchema={authMode === 'login' ? loginSchema : registerSchema}
            onSubmit={(values, { setSubmitting, resetForm  }) => {
              authMode === 'login' 
                ? dispatch(login(values, toast, setSubmitting, resetForm, navigate))
                : dispatch(register(values, toast, setSubmitting, resetForm, navigate))
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <span className='d-flex justify-content-center font-weight-bold'>
                  {authMode === 'login' ? 'Sign In' : 'Sign Up'}
                </span>
                {authMode === 'login' ? (
                  <div className='text-center my-class text-muted small'>
                    <Field type='email' name='email' className='form-control mt-2' placeholder='Email' />
                    <ErrorMessage name='email' className='text-danger' component='div' />
                    <Field type='password' name='password' className='form-control mt-2' placeholder='Password' />
                    <ErrorMessage name='password' className='text-danger' component='div' />
                  </div>
                ) : (
                  <div className='text-center my-class text-muted small'>
                    <Field type='text' name='name' className='form-control mt-2' placeholder='Name' />
                    <ErrorMessage style={{fonSize:'10px'}} name='name' className='text-danger' component='div' />
                    <Field type='email' name='email' className='form-control mt-2' placeholder='Email' />
                    <ErrorMessage name='email' className='text-danger' component='div' />
                    <Field type='password' name='password' className='form-control mt-2' placeholder='Password' />
                    <ErrorMessage name='password' className='text-danger' component='div' />
                    <div className="input-group mt-2">
                      <Field name='role' as='select' className="custom-select" id="role">
                        <option value="passenger">Passenger</option>
                        <option value="driver">Driver</option>
                        <option value="dispatcher">Dispatcher</option>
                      </Field>
                    </div>
                  </div>
                )}
                <button type='submit' className='w-100 btn btn-primary mt-3' disabled={isSubmitting}>
                  {authMode === 'login' ? 'Login' : 'Register'}
                </button>
              </Form>
            )}
          </Formik>
          <div className='border-bottom border-dak m-3'></div>
          <button onClick={() => handleLoginViaSN(googleProvider)} className='btn btn-outline-info d-flex align-items-center justify-content-center'>
            <FcGoogle className='mr-3' />
            <span>Signin With Google</span>
          </button>
          <button onClick={() => handleLoginViaSN(facebookProvider)} className='btn btn-outline-primary d-flex align-items-center justify-content-center mt-2'>
            <AiFillFacebook className='mr-3' />
            <span>Signin With Facebook</span>
          </button>
          <button className="btn btn-outline-primary mt-2 d-flex align-items-center justify-content-center" onClick={() => setPhoneAuth(!phoneAuth)}>
            <AiOutlinePhone className="mr-2" />
            Auth via Phone
          </button>
          <div className='d-flex justify-content-end'>
            {authMode === 'login' ? (
              <span onClick={() => setAuthMode('register')} className='mt-3 font-weight-bold' style={{ cursor: 'pointer', fontSize: '12px' }}>
                Don't have an account?
              </span>
            ) : (
                <span onClick={() => setAuthMode('login')} className='mt-3 font-weight-bold' style={{cursor:'pointer', fontSize:'12px'}}>Have an account?</span>
              )
            }
          </div>
        </div> 
        :
          <div className='position-relative ml-4 mr-4 border bg-white'>
            <PhoneAuth />
            <button style={{position:'absolute', right:'0', top:'-65px'}} className="btn btn-outline-primary mt-3 d-flex align-items-center justify-content-center" onClick={() => setPhoneAuth(!phoneAuth)}>
              <AiOutlineMail className="mr-2" />
              Auth via Email
            </button>
          </div>
        }
      <Toaster />
    </div>
  )
}

export default Auth;