import React from "react";
import GoogleLogin from "react-google-login";
import { Card } from "react-bootstrap";
import { GOOGLE_CLIENT_ID } from "./config.json";
import logo from "../../logo.png";
import { useAuth } from "../../contexts/AuthContext";

function Login() {
  const { setUser, setAccessToken } = useAuth();

  const handleSuccessfulLogin = (response) => {
    console.log(response);
    localStorage.setItem("accessToken", response.accessToken);
    setAccessToken(response.accessToken);
    setUser(response.profileObj);
  };
  const handleFailureLogin = (response) => {
    console.log(response);
    alert("Couldn't login");
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6 mx-1 mx-md-auto">
          <Card className="bg-gray">
            <Card.Header className="bg-secondary d-flex align-items-center justify-content-center">
              <Card.Img
                src={logo}
                alt="DApp Pay Logo"
                style={{ width: 60, height: 60 }}
                className="img-fluid"
              />
              <Card.Title className="display-4">DApp Pay</Card.Title>
            </Card.Header>
            <Card.Body className="px-2 py-3 text-center">
              <Card.Subtitle>
                <h4>Decentralized Payment App</h4>
              </Card.Subtitle>
              <Card.Text>
                Pay instantly, Secure transactions and much more...
              </Card.Text>
              <GoogleLogin
                clientId={GOOGLE_CLIENT_ID}
                buttonText="Login with Google"
                theme="dark"
                onSuccess={handleSuccessfulLogin}
                onFailure={handleFailureLogin}
                cookiePolicy={"single_host_origin"}
              />
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Login;
