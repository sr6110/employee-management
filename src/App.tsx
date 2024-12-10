import React from "react";
import EmployeeTable from "./components/EmployeeTable";
import { Toaster } from "react-hot-toast";

const App: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <Toaster />
      <EmployeeTable />
    </div>
  );
};

export default App;
