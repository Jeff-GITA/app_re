import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


// Import components //
import Header from '../components/Header';
import Button from '../components/Button';

const WarningPage = () => {

    const navigate = useNavigate();
    const [counter, setCounter] = useState(5);

    const onMain = () => {
        navigate("/main-page")
    }

    useEffect(() => {
        if (counter === 0) {
            
            // navigate('/main-page');
            window.electronAPI.closeWarinig("Close Warning...");

        } else {
            const timer = setTimeout(() => {
                setCounter(counter - 1);
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [counter, navigate]);

    window.electronAPI.getWarningMsg((event, message) => {
        document.getElementById('warning_msg').textContent = message;

    });

    return (
        <div className='container'>
            <Header title="Warning" />
            <p className='warning-message' id='warning_msg'></p>
            <p className='warning-message'>
                This window will be closed in {counter} seconds.
            </p>
        </div>
    )
}

export default WarningPage
