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
            navigate('/main-page');
        } else {
            const timer = setTimeout(() => {
                setCounter(counter - 1);
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [counter, navigate]);

    return (
        <div className='container'>
            <Header title="Warning" />
            <Button color="green" text="Return Main" onClick={onMain} />
            <p className='warning-message'>
                You will be redirected to the main page in {counter} seconds.
            </p>
        </div>
    )
}

export default WarningPage
