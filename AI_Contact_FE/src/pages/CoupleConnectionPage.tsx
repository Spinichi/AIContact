import '../styles/CoupleConnection.css';
import Logo from '../components/Logo';
import MyConnectionInfo from '../components/coupleConnection/MyConnectionInfo';
import PartnerConnectionForm from '../components/coupleConnection/PartnerConnectionForm';
import ConnectionBinder from '../components/coupleConnection/ConnectionBinder';

export default function CoupleConnectionPage(){
    return(
        <>
            <Logo variant="fixed" />
            <ConnectionBinder />
            <div className="main-layout">
                <div className = "couple-container">
                    <MyConnectionInfo />
                </div>
                <div className = "couple-container">
                    <PartnerConnectionForm />
                </div>
            </div>
        </>
    )
}