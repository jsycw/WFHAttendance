import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

function Navbar() {

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

  return (
    <div className="bg-white shadow">

      <div className="max-w-5xl mx-auto flex justify-between items-center p-4">

        <div className="font-bold text-lg text-blue-600">
          WFH Attendance
        </div>

        <div className="flex gap-6 items-center">

          {/* Employee & HRD */}
          <Link to="/my-attendance" className="hover:text-blue-600">
            My Attendance
          </Link>

          {/* HRD only */}
          {role === "hrd" && (
            <>
              <Link to="/dashboard" className="hover:text-blue-600">
                Dashboard
              </Link>

              <Link to="/employees" className="hover:text-blue-600">
                Employees
              </Link>
            </>
          )}

          <button
            onClick={logout}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Logout
          </button>

        </div>

      </div>

    </div>
  );
}

export default Navbar;