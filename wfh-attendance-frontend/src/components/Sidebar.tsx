import { NavLink, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

function Sidebar() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded: any = jwtDecode(token);
      setRole(decoded.role);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const linkClass = ({ isActive }: any) =>
    `block px-4 py-3 rounded-lg transition ${
      isActive
        ? "bg-blue-100 text-blue-600 font-semibold"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <div className="w-64 bg-white border-r flex flex-col fixed left-0 top-0 h-screen">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-blue-600">
          WFH Attendance
        </h1>
      </div>

      <div className="flex-1 p-4 space-y-2">
        <NavLink to="/my-attendance" className={linkClass}>
          My Calendar
        </NavLink>

        {role === "hrd" && (
          <>
            <NavLink to="/dashboard" className={linkClass}>
              View Attendance
            </NavLink>
            <NavLink to="/employees" className={linkClass}>
              Manage Employee
            </NavLink>
          </>
        )}
      </div>

      <div className="p-4 border-t">
        <button
          onClick={logout}
          className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;