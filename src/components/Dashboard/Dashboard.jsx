import { useState, useEffect } from "react";

function Dashboard({ user, setUser }) {
    return (
        <div className="flex flex-col gap-8 p-6 min-h-screen">
      {/* Header */}
      <header className="mb-6">
        <h1 className="flex justify-center">Welcome, {user.first_name}!</h1>
        <p className="flex justify-center text-gray-600 text-lg">
          Manage your children and campaigns below.
        </p>
        </header>
        </div>
    );
}

export default Dashboard;