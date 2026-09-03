import saleorLogoDarkMode from "@assets/images/sidebar-deafult-logo-darkMode.png";
import saleorLogoLightMode from "@assets/images/sidebar-default-logo.png";
import { useTheme } from "@dashboard/theme/hook";
import { type DefaultTheme } from "@saleor/macaw-ui-next";

const getFSCommerceLogoUrl = (theme: DefaultTheme) => {
  switch (theme) {
    case "defaultLight":
      return saleorLogoLightMode;
    case "defaultDark":
      return saleorLogoDarkMode;
    default:
      throw new Error("Invalid theme mode, should not happen.");
  }
};

export const FSCommerceLogo = () => {
  const { theme } = useTheme();

  return <img src={getFSCommerceLogoUrl(theme)} alt="" />;
};
