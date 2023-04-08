import { useState } from "react";
import { useDispatch } from "react-redux";
import { sendVerificationCode,verifyCode } from '../../redux/actions';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { toast } from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

const RegisterWithPhone = () => {
  const [authMode, setAuthMode] = useState('login');
  const [verificationId, setVerificationId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  const loginSchema = Yup.object().shape({
    phone: Yup.string()
      .matches(/^\+?[0-9]{1,3}[\s-]?\(?\d{2,4}\)?[\s-]?\d{2,4}[\s-]?\d{2,4}$/, 'Invalid phone number')
      .required('Phone number is required'),
  });
  
  const registerSchema = Yup.object().shape({
    phone: Yup.string()
      .matches(/^\+?[0-9]{1,3}[\s-]?\(?\d{2,4}\)?[\s-]?\d{2,4}[\s-]?\d{2,4}$/, 'Invalid phone number')
      .required('Phone number is required'), 
    name: Yup.string()
      .required('Required')
      .max(35, 'Name is too large'),
    role: Yup.string().
      required('Required'),
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSendVerificationCode = (phoneNumber) => {
    dispatch(sendVerificationCode(phoneNumber, setVerificationId, setErrorMessage, toast, authMode));
  };

  const handleVerifyCode = (values) => {
    dispatch(verifyCode(verificationId, values, setErrorMessage, authMode, navigate));
  };
  
  return (
    <div className="p-3">
      <h2 className=" text-center mb-4">{authMode === 'login' ? 'Login' : 'Register'} with phone</h2>
        <Formik
          initialValues={{ 
            name: '', 
            phone: '',
            verificationCode: '',
            role: 'passenger',
          }}
          validationSchema={authMode === 'login' ? loginSchema : registerSchema}
          onSubmit={(values) => 
            handleSendVerificationCode(values.phone)
          }
        >
          {({ isSubmitting, values }) => (
            <Form>
              {authMode === 'login' ? (
                <div className='text-center my-class text-muted small'>
                  <div className="d-flex input-group">
                    <Field 
                      type='text' 
                      name='phone' 
                      className='form-control' 
                      placeholder='Phone' 
                    />
                    <div class="input-group-append">
                      {!verificationId &&
                        <button
                          class="btn btn-info" 
                          type="submit" 
                          id="send-code-btn"
                          >Send SMS
                        </button>
                      }
                    </div>
                  </div>
                  <ErrorMessage name='phone' className='text-danger' component='div' />
                </div>
              ) : (
                <div className=' text-center my-class text-muted small'>
                  <div className="d-flex input-group mt-2">
                    <Field 
                      type='text' 
                      name='phone' 
                      className='form-control' 
                      placeholder='Phone' 
                    />
                  </div>
                  <ErrorMessage name='phone' className='text-danger' component='div' />
                  <Field type='text' name='name' className='form-control mt-2' placeholder='Name' />
                  <ErrorMessage style={{fonSize:'10px'}} name='name' className='text-danger' component='div' />
                  <div className="input-group mt-2">
                    <Field name='role' as='select' className="custom-select" id="role">
                      <option value="passenger">Passenger</option>
                      <option value="driver">Driver</option>
                      <option value="dispatcher">Dispatcher</option>
                    </Field>
                  </div>
                  {!verificationId &&
                    <button 
                      className="w-100 mt-4 btn btn-info" 
                      type="submit" 
                      id="send-code-btn"
                    >Send SMS
                    </button>
                  }
                </div>
              )}
              {verificationId && (
              <div>
                {verificationId && (
                  <div className="input-group mt-2">
                    <Field
                      type="text"
                      name="verificationCode"
                      className="form-control"
                      placeholder="Verification code"
                      aria-label="Verification code"
                      aria-describedby="send-code-btn"
                    />
                    <div className="input-group-append">
                      <div
                        onClick={() => handleVerifyCode(values)}
                        className="btn btn-outline-info"
                      >
                        Confirm code
                      </div>
                    </div>
                  </div>
                )}
              </div>
              )}
            </Form>
          )}
        </Formik> 
        <Toaster />
        <div className="mt-3 d-flex justify-content-center" id="recaptcha"></div>
        {errorMessage && <div className="text-center my-class small text-danger mt-1">Error: {errorMessage}</div>}
        <div className='d-flex justify-content-end'>
            {authMode === 'login' ? (
              <button disabled={verificationId} onClick={() => setAuthMode('register')} className='p-0 font-weight-bold' style={{ cursor: 'pointer', fontSize: '12px' }}>
                Don't have an account?
              </button>
            ) : (
                <button disabled={verificationId} onClick={() => setAuthMode('login')} className='p-0 font-weight-bold' style={{cursor:'pointer', fontSize:'12px'}}>
                  Have an account?
                </button>
              )
            }
        </div>
    </div>
  );
};

export default RegisterWithPhone;
