import { Alert, Button, Card, notification } from "antd";
import { useEffect, useState } from "react";
import { twJoin } from "tailwind-merge";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router";
import FormInput from "../../components/FormInput/FormInput";
import { StoredUserInfoType } from "../../shared/CommonTypes.interface";
import { navigateRef } from "../../containers/CommonInit/CommonInit";

export default function Login() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const navigate = useNavigate();

  function onSubmit() {
    setIsLoggingIn(true);
    axios("/api/login", { method: "post", data: credentials })
      .then((res) => {
        localStorage.setItem("user", JSON.stringify(res.data));
        navigate("/auth/personal-notes");
        notification.success({
          message: `Welcome back, ${res.data.fullname}!`,
          duration: 1,
        });
      })
      .catch((e: AxiosError) => {
        if (e.status === 401) {
          notification.error({
            message: "Invalid username/password",
            duration: 1,
          });
        }
      })
      .finally(() => {
        setIsLoggingIn(false);
      });
  }

  useEffect(() => {
    try {
      const accessToken = (
        JSON.parse(String(localStorage.getItem("user"))) as StoredUserInfoType
      ).accessToken;

      if (accessToken) {
        navigateRef.current("auth", { replace: true });
      }
    } catch {}
  }, []);

  return (
    <div className={twJoin("p-[16px]")}>
      <Card className={twJoin("w-[500px]", "m-auto")}>
        <div className={twJoin("flex", "flex-col", "gap-[16px]")}>
          <FormInput
            fieldLabel="Username"
            placeholder="Please input your username here"
            value={credentials.username}
            onChange={(e) => {
              setCredentials((cur) => ({ ...cur, username: e.target.value }));
            }}
            onPressEnter={onSubmit}
          />

          <FormInput
            fieldLabel="Password"
            placeholder="Please input your password here"
            type="password"
            value={credentials.password}
            onChange={(e) => {
              setCredentials((cur) => ({ ...cur, password: e.target.value }));
            }}
            onPressEnter={onSubmit}
          />

          <Alert
            type="info"
            showIcon
            message={
              <div>
                For testing purposes, please use <b>admin</b> for the username
                and <b>password</b> for the password to log in
              </div>
            }
          />

          <Button
            type="primary"
            onClick={() => {
              onSubmit();
            }}
            loading={isLoggingIn}
          >
            Sign in
          </Button>
        </div>
      </Card>
    </div>
  );
}
