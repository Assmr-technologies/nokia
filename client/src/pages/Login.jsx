import { useContext } from "react";
import { Alert, Button, Col, Form, Row, Stack } from "react-bootstrap";
import { AuthContext } from "../Context/AuthContext";
const Login = () => {
  const { loginUser, loginInfo, loginError, loginLoading, updateLoginInfo } =
    useContext(AuthContext);
  return (
    <>
      <Form onSubmit={loginUser}>
        <Row
          style={{
            height: "100vh",
            justifyContent: "center",
            paddingTop: "10%",
          }}
        >
          <Col xs={6}>
            <Stack gap="3">
              <h2>Login</h2>
              <Form.Control
                type="email"
                placeholder="Email"
                value={loginInfo.email}
                onChange={e => {
                  updateLoginInfo({ ...loginInfo, email: e.target.value });
                }}
              />
              <Form.Control
                type="password"
                placeholder="Password"
                value={loginInfo.password}
                onChange={e => {
                  updateLoginInfo({ ...loginInfo, password: e.target.value });
                }}
              />
              <Button variant="primary" type="submit">
                {loginLoading ? "Logging User" : "Login"}
              </Button>
              {loginError?.error && (
                <Alert variant="danger">
                  <p>{loginError?.message}</p>
                </Alert>
              )}
            </Stack>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default Login;
