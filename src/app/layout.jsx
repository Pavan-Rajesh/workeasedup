import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";
import Provider from "@/components/Provider";
export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children, authModal }) {
  return (
    <html lang="en">
      <body>
        <Provider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            {authModal}
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
