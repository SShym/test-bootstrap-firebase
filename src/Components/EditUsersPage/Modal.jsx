import { Button, Modal } from 'react-bootstrap';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { changeUserSettings } from '../../redux/actions';
import { useDispatch } from "react-redux";
import * as Yup from 'yup';

const ModalWindow = ({ modalOpen, setModalOpen, user }) => {
    const dispatch = useDispatch();

    const initialValues = {
        name: user?.name,
        role: user?.role
    };

    const validationSchema = Yup.object({
        name: Yup.string()
            .required('Name is required')
            .max(30, "A large number of words. Limit - 30"),
        role: Yup.string()
            .required('Role is required')
    });

    const onSubmit = (values, { resetForm }) => {
        dispatch(changeUserSettings(values, user));
        setModalOpen(false);
        resetForm();
    };

    return (
        <Modal show={modalOpen} onHide={() => setModalOpen(false)}>
            <Modal.Header>
            <Modal.Title>Settings</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {({ errors, touched }) => (
                <Form>
                    <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <Field type="text" className={`form-control ${touched.name && errors.name ? 'is-invalid' : ''}`} id="name" name="name" />
                    <ErrorMessage name="name" component="div" className="invalid-feedback" />
                    </div>
                    <div className="form-group">
                        <Field name='role' as='select' className="custom-select" id="role">
                            <option value="passenger">Passenger</option>
                            <option value="driver">Driver</option>
                            <option value="dispatcher">Dispatcher</option>
                        </Field>
                    </div>
                    <div className="d-flex justify-content-between">
                        <Button variant="secondary" onClick={() => setModalOpen(false)}>
                        Close
                        </Button>
                        <Button variant="primary" type="submit">
                            Save changes
                        </Button>
                    </div>
                </Form>
                )}
            </Formik>
            </Modal.Body>
        </Modal>
        );
};

export default ModalWindow;
