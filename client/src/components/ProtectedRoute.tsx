import React from "react";
function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
}) {
  //TODO: change after implementing custom auth hook
  const role = "admin";
  //TODO: add checking if user is authenticated
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <p>Access Denied</p>;
  }
  return children;
}

export default ProtectedRoute;
