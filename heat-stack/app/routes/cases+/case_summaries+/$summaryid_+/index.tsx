import { Outlet } from "react-router";

export default function Cases() {
  return (
    <div className="w-100p h-100p bk-primary">
      <h1>Case name</h1>
      <Outlet />
    </div>
  );
}
