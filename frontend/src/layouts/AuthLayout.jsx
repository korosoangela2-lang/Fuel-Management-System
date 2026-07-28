import AuthLeftPanel from "../components/layout/AuthLeftPanel";
import AuthRightPanel from "../components/layout/AuthRightPanel";

function AuthLayout({ children }) {
  return (
    <div className="auth-container">
      <AuthLeftPanel />
      <AuthRightPanel>
        {children}
      </AuthRightPanel>
    </div>
  );
}

export default AuthLayout;