import { FSCommerceThrobber } from "@dashboard/components/Throbber/FSCommerceThrobber";
import { infoMessages } from "@dashboard/extensions/messages";
import { FormattedMessage } from "react-intl";

import { InfoLabelsContainer } from "../InfoLabels/InfoLabelsContainer";

export const InstallationPendingInfo = () => {
  return (
    <InfoLabelsContainer
      icon={<FSCommerceThrobber size={10} />}
      message={<FormattedMessage {...infoMessages.installationPending} />}
    />
  );
};
