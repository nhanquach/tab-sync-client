import AppLayout from "../../components/app-layout/AppLayout";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  return <AppLayout>{children}</AppLayout>;
};

export default Layout;

