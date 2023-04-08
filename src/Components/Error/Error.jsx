import './Error.scss';

const Error = () => {
    return(
        <div className='error-wrap'>
            <div className="top">
                <h1 className="error-404">404</h1>
                <h3 className="page-not-found">page not found</h3>
            </div>
            <div className="container">
                <div className="ghost-copy">
                    <div className="one"></div>
                    <div className="two"></div>
                    <div className="three"></div>
                    <div className="four"></div>
                </div>
                <div className="ghost">
                    <div className="face">
                    <div className="eye"></div>
                    <div className="eye-right"></div>
                    <div className="mouth"></div>
                    </div>
                </div>
                <div className="shadow"></div>
            </div>
        </div>
    )
}

export default Error;