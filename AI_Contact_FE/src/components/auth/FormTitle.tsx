import logo from '../../assets/images/symbol.png';

export default function FormTitle(){
  return(
      <div className="form-title">
          <img src={logo} alt="서비스로고" className="service-logo" />
          <h2>AI Contact</h2>
      </div>
  );
}