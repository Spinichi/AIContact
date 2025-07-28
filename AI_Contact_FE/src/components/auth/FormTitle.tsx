import serviceLogo from '../../assets/images/Union.png';

export default function FormTitle(){
  return(
      <div className="form-title">
          <img src={serviceLogo} alt="서비스로고" className="service-logo" />
          <h2>AI Contact</h2>
      </div>
  );
}