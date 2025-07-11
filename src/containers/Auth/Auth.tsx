import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { Outlet } from "react-router";
import { StoredUserInfoType } from "../../shared/CommonTypes.interface";
import { navigateRef } from "../../containers/CommonInit/CommonInit";
import axios from "axios";
import { Button, Modal, Skeleton, Typography } from "antd";
import { twJoin } from "tailwind-merge";
import { emitter } from "../../utils/emitter";

export default function Auth() {
  const [update, setUpdate] = useState({});
  const user = useMemo(() => {
    try {
      return (
        update &&
        (JSON.parse(String(localStorage.getItem("user"))) as StoredUserInfoType)
      );
    } catch {
      return null;
    }
  }, [update]);

  useEffect(() => {
    const listener = () => {
      setUpdate({});
    };
    window.addEventListener("storage", listener);
    return () => window.removeEventListener("storage", listener);
  }, []);

  useLayoutEffect(() => {
    return emitter.on("LOG_OUT", () => {
      setUpdate({});
    });
  });

  useEffect(() => {
    const accessToken = user?.accessToken;
    if (!accessToken) {
      navigateRef.current("login", { replace: true });
      return;
    }

    axios.defaults.headers["Authorization"] = `Bearer ${accessToken}`;
  }, [user?.accessToken]);

  if (!user) {
    return <Skeleton data-no-user />;
  }

  return <AuthenticatedLayout />;
}

function AuthenticatedLayout() {
  const [header, setHeader] = useState("");

  useLayoutEffect(() => emitter.on("UPDATE_HEADER", setHeader), []);

  return (
    <div className={twJoin("w-screen", "h-screen", "flex", "flex-col")}>
      <div className={twJoin("flex", "flex-row", "items-center", "p-[24px]")}>
        <div className={twJoin("flex-1", "text-center")}>
          <Typography.Title>{header}</Typography.Title>
        </div>
        <div>
          <Button
            type="primary"
            onClick={() => {
              Modal.confirm({
                content: "Are you sure you want to log out?",
                cancelText: "No, stay back",
                okText: "OK, log me out!",
                onOk() {
                  localStorage.clear();
                  emitter.emit("LOG_OUT");
                  return true;
                },
              });
            }}
          >
            Logout
          </Button>
        </div>
      </div>
      <div className={twJoin("flex-1", "overflow-auto", "p-[24px]")}>
        <Outlet />
      </div>
    </div>
  );
}
