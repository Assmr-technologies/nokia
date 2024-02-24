import { useContext } from "react";
import { Alert, Button, Col, Form, Row, Stack } from "react-bootstrap";
import { AuthContext } from "../Context/AuthContext";
const Register = () => {
  const {
    registerInfo,
    updateRegisterInfo,
    RegisterUser,
    registerError,
    registerLoading,
  } = useContext(AuthContext);
  return (
    <>
      <Form onSubmit={RegisterUser}>
        <Row
          style={{
            height: "100vh",
            justifyContent: "center",
            paddingTop: "10%",
          }}
        >
          <Col xs={6}>
            <Stack gap="3">
              <h2>Register</h2>
              <Form.Control
                type="text"
                placeholder="Name"
                value={registerInfo.name}
                onChange={e => {
                  updateRegisterInfo({ ...registerInfo, name: e.target.value });
                }}
              />
              <Form.Control
                type="email"
                placeholder="Email"
                value={registerInfo.email}
                onChange={e => {
                  updateRegisterInfo({
                    ...registerInfo,
                    email: e.target.value,
                  });
                }}
              />
              <Form.Control
                type="password"
                placeholder="Password"
                value={registerInfo.password}
                onChange={e => {
                  updateRegisterInfo({
                    ...registerInfo,
                    password: e.target.value,
                  });
                }}
              />
              <Button variant="primary" type="submit">
                {registerLoading ? "Creating User" : "Register"}
              </Button>
              {registerError?.error && (
                <Alert variant="danger">
                  <p>{registerError?.message}</p>
                </Alert>
              )}
            </Stack>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default Register;
