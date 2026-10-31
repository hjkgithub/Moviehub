
import "./global.css";

export const metadata = {
  title: "Movie Hub",
  description: "Discover movies from Wikidata"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

