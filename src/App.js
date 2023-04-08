import './App.css';
import { useSelector } from 'react-redux';
import { Route, Routes, useNavigate } from 'react-router-dom';

import Auth from './Components/Auth/Auth';
import Main from './Components/Main/Main';
import EditUsersPage from './Components/EditUsersPage/EditPage';
import CreateTrip from './Components/CreateTrip/CreateTrip';
import Error from './Components/Error/Error';
import { useEffect } from 'react';

function App() { 
  const user = useSelector(state => state.authReducer.user); 
  const error = useSelector(state => state.appReducer.error); 

  const navigate = useNavigate();

  useEffect(() => {
    !user && navigate('/auth')
  }, []) // eslint-disable-line

  return (
    <div className="app">
      <div className="app-wrap">
          <Routes>
            {!user && <Route path='/auth' element={<Auth />} />}
            <Route path='/list-of-users' element={<EditUsersPage />} />
            <Route path='/create-trip' element={<CreateTrip />} />
            <Route path='/' element={<Main />} />
            <Route path='*' element={<Error />} />
          </Routes>
          {error && <Error />}
      </div>
    </div>
  );
}

export default App;
