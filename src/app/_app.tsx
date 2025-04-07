import Head from "next/head";

const App = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Head>
        <title>TabSync</title>
        <meta name="application-name" content="TabSync" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="TabSync" />
        <meta name="description" content="TabSync - Your Tabs Accross Devices" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#8f94fb" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#8f94fb" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="https://tabsyncclient.vercel.app" />
        <meta name="twitter:title" content="TabSync" />
        <meta name="twitter:description" content="TabSync - Your Tabs Accross Devices" />
        <meta
          name="twitter:image"
          content="https://tabsyncclient.vercel.app/icons/android-chrome-192x192.png"
        />
        <meta name="twitter:creator" content="@nhanquach1802" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="TabSync" />
        <meta property="og:description" content="TabSync - Your Tabs Accross Devices" />
        <meta property="og:site_name" content="TabSync" />
        <meta property="og:url" content="https://tabsyncclient.vercel.app" />
        <meta
          property="og:image"
          content="https://yourdomain.com/icons/apple-touch-icon.png"
        />
      </Head>
      <body>{children}</body>
    </>
  );
};

export default App;
