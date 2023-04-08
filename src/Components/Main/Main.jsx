import { useSelector } from 'react-redux';
import Navbar from '../Navbar/Navbar';

const Main = () => {
    const user = useSelector(state => state.authReducer.user);
    return(
        <div>
            {user &&
                <>
                    <Navbar />
                    {/* Тут буде інша компонента, наприклад, тіло сайт  */}
                </>
            }
        </div>
    )
}

export default Main;