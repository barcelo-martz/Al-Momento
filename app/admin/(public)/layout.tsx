import Headeradmin from "@/components/admin/Headeradmin";
import SideBar from "@/components/admin/SideBar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Headeradmin />
      <SideBar />
      <main className="flex-1 p-md ">{children}</main>
    </div>
  );
}
