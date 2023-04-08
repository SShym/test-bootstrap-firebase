import { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/actions';
import deffaultPhoto from '../../images/gug.webp'

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const user = useSelector(state => state.authReducer.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const handleLogout = () => dispatch(logout(navigate, user.email));

    const navigateToEditPage = () => navigate('/list-of-users');
    const navigateToCreateTripPage = () => navigate('/create-trip');

    return (
        <nav className="navbar navbar-light bg-light border-bottom">
            <button className="navbar-toggler" type="button" onClick={toggleMenu}>
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="navbar-brand d-inline-block">
                <span className='d-none d-sm-inline-flex mr-3 my-class text-muted small'>{user?.name}</span>
                <img src={deffaultPhoto} style={{width:'35px', height:'35px'}} alt="Avatar" />
                <button onClick={handleLogout} className='btn btn-primary ml-4 pl-4 pr-4'>logout</button>
            </div>
            <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarNav">
                <ul className="navbar-nav">
                    <li className="nav-item" onClick={navigateToCreateTripPage}>
                        <div className="nav-link">Create trip</div>
                    </li>
                    <li className="nav-item">
                        <div className="nav-link ">Information</div>
                    </li>
                    <li className="nav-item">
                        <div className="nav-link">Price-list</div>
                    </li>
                    {user?.isAdmin &&
                        <li className="nav-item" onClick={navigateToEditPage}>
                            <div className="nav-link">Editing users page</div>
                        </li>
                    }
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
