import Sidebar from "./Sidebar";

function Layout({ children }: any) {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Sidebar />
      <div className="ml-64 p-6">
        {children}
      </div>
    </div>
  );
}

export default Layout;