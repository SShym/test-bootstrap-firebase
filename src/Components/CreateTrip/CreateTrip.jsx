import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { createTrip, getTrips, deleteTrip } from '../../redux/actions';
import * as Yup from 'yup';
import { Toaster } from 'react-hot-toast';
import { toast } from 'react-hot-toast';
import { useEffect } from 'react';

const CreateTrip = () => {
    const dispatch = useDispatch();

    const user = useSelector(state => state.authReducer.user);
    const trips = useSelector(state => state.mainReducer.trips);
    const loading = useSelector(state => state.appReducer.loading);

    const initialValues = {
        from: '',
        to: '',
        passengers: 0,
        creator: user?.email
    };

    const validationSchema = Yup.object({
        from: Yup.string()
            .required('From is required')
            .max(20, "A large number of words"),
        to: Yup.string()
            .required('To is required')
            .max(20, "A large number of words"),
        passengers: Yup.number()
            .required("Passengers are required")
            .min(0, "Number must be positive")
            .max(8, "Max 8 passengers are allowed"),
    });

    const onSubmit = (values, { resetForm }) => {
        dispatch(createTrip(values, toast));
        resetForm();
    };

    const handleDeleteTrip = (id) => dispatch(deleteTrip(id));
    

    useEffect(() => {
        dispatch(getTrips());
    }, []) // eslint-disable-line
    
    return(
        <div className="m-3 d-flex flex-column mt-5 justify-content-center align-items-center">
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {({ errors, touched }) => (
                <Form>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label htmlFor="from">From</label>
                            <Field 
                                type="text" 
                                className={`form-control ${
                                    touched.from && errors.from ? "is-invalid" : ""
                                }`}
                                id="from"
                                name="from"
                            />
                            <ErrorMessage
                                component="div"
                                name="from"
                                className="invalid-feedback"
                            />
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="to">To</label>
                            <Field 
                                type="text" 
                                className={`form-control ${
                                    touched.to && errors.to ? "is-invalid" : ""
                                }`}
                                id="to"
                                name="to"
                            />
                            <ErrorMessage
                                component="div"
                                name="to"
                                className="invalid-feedback"
                            />
                        </div>
                    </div>
                    <div className="form-group text-center">
                        <label htmlFor="passengers">Passengers</label>
                        <Field 
                            type="number" 
                            min="0" 
                            max="8"
                            className={`form-control ${
                                touched.passengers && errors.passengers ? "is-invalid" : ""
                            }`}
                            id="passengers"
                            name="passengers"
                        />
                        <ErrorMessage
                            component="div"
                            name="passengers"
                            className="invalid-feedback"
                        />
                    </div>
                    <button className='btn btn-primary w-100'>SAVE</button>
                </Form>
                )}
            </Formik>
            <Toaster />
            <h3 className="font-weight-bold mt-5 mb-4 text-center">Existing trips of all people:</h3>
            {!loading 
                ? <div>
                    {trips?.map(trip => 
                        <div className='text-center d-flex align-items-center'>
                            <div className='border border-primary p-3 m-2'>
                                From: {trip.from}. To: {trip.to}. Passangers: {trip.passengers}
                            </div>
                            {user?.email === trip.creator &&
                                <button onClick={() => handleDeleteTrip(trip.id)} className='btn btn-danger h-25'>delete</button>
                            }
                        </div>
                    )}
                </div>
                : <div className="spinner-border text-dark mt-5" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
            
            }
        </div>
    )
}

export default CreateTrip;
