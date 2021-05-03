import React, {useState, useCallback , useEffect } from 'react';
import WaiterPanel from './WaiterPanel';
import { useLazyQuery } from '@apollo/client';
import { GET_EMPLOYEE } from "./../Queries";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./../Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentEmployee, setCurrentEmployee] = useState("");

  useEffect(() => { //load after refresh
    const parsedcurrentEmployee= String(localStorage.getItem("currentEmployee") || "")
    setCurrentEmployee(parsedcurrentEmployee)
    setEmail(parsedcurrentEmployee);
    console.log(parsedcurrentEmployee);
    if(parsedcurrentEmployee) {document.getElementById("loginform").style.display = "none";}
      else {document.getElementById("loginform").style.display = "block";}
  }, [])

  useEffect(() => { //save before refresh
    localStorage.setItem("currentEmployee", currentEmployee)
  }, [currentEmployee])

  const [getEmployees, {data}] = useLazyQuery(GET_EMPLOYEE, { variables: { email: email, password: password } ,
      onCompleted: (data) => {
        if(data.getEmployee != null)
        {
          if(data.getEmployee[0].['password'] === password){
            let email = data.getEmployee[0].['email'];
            console.log(email);
            document.getElementById("loginform").style.display = "none";
            setCurrentEmployee(email);
          }else{
            console.log("wrong password");
          }
        }else{
          console.log("not found");
        }
    }}
  );

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
  }

  const onLogout = useCallback(() => {
    document.getElementById("loginform").style.display = "block";
    setCurrentEmployee("");
    setPassword("");
  },[])

  return (
    <div className="Login" border="1">
    {currentEmployee !== "" && <p>Logged as {currentEmployee} <button class="btn-table" onClick={() => {onLogout()}} ><i class="fa fa-sign-out"></i> Log out</button></p>}
      <Form id="loginform" onSubmit={handleSubmit}>
        <Form.Group size="lg" controlId="email">
        <h2>Login form:</h2>
          <Form.Label>Email</Form.Label>
          <Form.Control
            autoFocus
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group size="lg" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <button class="btn-table" block size="lg" onClick={ () => getEmployees() } disabled={!validateForm()}>
          <i class="fa fa-sign-in"></i> Login
        </button>
      </Form>

      {false && <Button onClick={ () => getEmployees() }>Get employee</Button> }
      {false && data && data.getEmployee && <div>{data.getEmployee.email} - {data.getEmployee.password}</div> }
      {currentEmployee !== "" && <WaiterPanel id="waiterpanel" waitername={email} />}
    </div>
  );
}

export default Login;
