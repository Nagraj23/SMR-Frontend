import React from "react";
import { AuthProvider } from "./Context/AuthContext";
import Navigator from "./AppNavigator";

export default function App() {
  return (
      <AuthProvider>
        <Navigator />
      </AuthProvider>
  );
}