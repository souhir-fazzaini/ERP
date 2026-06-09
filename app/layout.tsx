
import './globals.css';
import {AuthProvider} from "@/app/context/AuthContext";
import NavBar from "@/app/components/NavBar";

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  return (
      <html lang="fr">
      <body>
      <AuthProvider>
        <NavBar />
        <main>{children}</main>
      </AuthProvider>
      </body>
      </html>
  );
}
