import { Skeleton } from "antd";
import { twJoin } from "tailwind-merge";

export default function Loader() {
  return (
    <div className={twJoin("p-[16px]")}>
      <Skeleton active />
    </div>
  );
}
