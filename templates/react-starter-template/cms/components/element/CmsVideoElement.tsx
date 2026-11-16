import { getTranslatedProperty } from "@shopware/helpers";

import type { Schemas } from "#shopware";

import { cx } from "../../helpers/cx";
import type { CmsComponentProps } from "../../registry";
import { getCmsTranslate, withTranslationDefaults } from "../../translations";
import { CmsMedia } from "../ui/CmsMedia";
import { CmsVideoConsent } from "./CmsVideoConsent";
import type { CmsVideoConsentProps } from "./CmsVideoConsent";
import { CmsVideoIframe } from "./CmsVideoIframe";

const translations = {
  cms: {
    video: {
      privacyNoticeText:
        "By viewing the video you agree that your data will be transferred to {platform} and that you have read the privacy policy.",
      acceptButtonLabel: "Accept",
    },
  },
};

export type CmsVideoElementProps = Omit<CmsComponentProps<never>, "content"> &
  Pick<CmsVideoConsentProps, "cookieName" | "videoUrl" | "iframeTitle"> & {
    platform: string;
    rootClassName: string;
    needsConfirmation: boolean;
    previewMedia?: Schemas["Media"] | null;
  };

export function CmsVideoElement({
  platform,
  rootClassName,
  needsConfirmation,
  previewMedia,
  ctx,
  className,
  style,
  ...video
}: CmsVideoElementProps) {
  const t = withTranslationDefaults(ctx.translations, translations);

  return (
    <div className={cx(rootClassName, className)} style={style}>
      {needsConfirmation ? (
        <CmsVideoConsent
          {...video}
          privacyNoticeText={getCmsTranslate(t.cms.video.privacyNoticeText, {
            platform,
          })}
          acceptButtonLabel={t.cms.video.acceptButtonLabel}
        >
          {previewMedia ? (
            <CmsMedia
              media={previewMedia}
              alt={getTranslatedProperty(previewMedia, "alt")}
              sizes={ctx.imageSizes}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : null}
        </CmsVideoConsent>
      ) : (
        <CmsVideoIframe src={video.videoUrl} title={video.iframeTitle} />
      )}
    </div>
  );
}
