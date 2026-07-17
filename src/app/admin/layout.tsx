import { AdminLayoutClient } from "./layout-client";
import "../[locale]/globals.css";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <body className="antialiased">
        <AdminLayoutClient>{children}</AdminLayoutClient>
      </body>
    </html>
  );
}
