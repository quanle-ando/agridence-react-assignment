import noop from "lodash-es/noop";
import { NavigateFunction, Outlet, useNavigate } from "react-router";

export const navigateRef = { current: noop as NavigateFunction };

export default function CommonInit() {
  const navigate = useNavigate();

  navigateRef.current = navigate;

  return <Outlet />;
}
