export const isMobileApp = () => {
  return window.location.pathname === "/mobileapp";
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isMobileDevice = (navigator: any) => {
  if (!navigator) {
    return false;
  }

  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};
