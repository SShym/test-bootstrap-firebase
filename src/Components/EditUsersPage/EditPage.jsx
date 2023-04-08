import { useEffect, useState } from "react";
import { getUsers } from '../../redux/actions';
import { useDispatch, useSelector } from "react-redux";
import ModalWindow from './Modal.jsx';
import deffaultPhoto from '../../images/gug.webp'

const EditPage = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState('');

    const dispatch = useDispatch();
    const loggedInUser = useSelector(state => state.authReducer.user);
    const users = useSelector(state => state.mainReducer.users)
    const loading = useSelector(state => state.appReducer.loading)

    const handleOpenModal = (user) => {
        setModalOpen(true)
        setSelectedUser(user)
    }

    useEffect(() => {
        dispatch(getUsers());
    }, []) // eslint-disable-line

    return(
        <div className="d-flex flex-column align-items-center justify-content-center">
            {!loading 
                ? <>
                    <h3 className="font-weight-bold mt-5">Other Users</h3>
                    <div>
                        {users?.map(user => 
                        <>
                            {user.email !== loggedInUser?.email &&
                                <div className="card text-center m-4">
                                    <div className="card-header d-flex align-items-center justify-content-center">
                                        <img style={{width:'150px'}} src={deffaultPhoto} alt="" />
                                        <span className="d-none d-sm-block ml-5 shadow-lg p-5">{user.role}</span>
                                    </div>
                                    <div className="card-body">
                                        <h5 className="card-title">{user.name}</h5>
                                        <p className="card-text">{user.email}</p>
                                        <span className="d-block d-sm-none font-weight-bold">{user.role}</span>
                                    </div>
                                    <div>
                                        <button className="w-75 mb-2 btn btn-primary" onClick={() => handleOpenModal(user)}>EDIT</button>
                                    </div>
                                </div>
                            }
                        </>
                        )}
                    </div>
                </>
                : <div className="d-flex align-items-center justify-content-center border w-100 vh-100">
                    <div className="spinner-border text-dark" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
                </div>
            }
            <ModalWindow 
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
                user={selectedUser}
            />
        </div>
    )
}

export default EditPage;