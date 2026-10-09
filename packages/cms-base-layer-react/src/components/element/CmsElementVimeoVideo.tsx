import { getTranslatedProperty } from "@shopware/helpers";

import { cx } from "../../helpers/cx";
import { getConfigValue } from "../../helpers/slots";
import type { CmsComponentProps } from "../../registry";
import { getCmsTranslate, withTranslationDefaults } from "../../translations";
import type { CmsElementVimeoVideo as CmsElementVimeoVideoContent } from "../../types";
import { CmsMedia } from "../ui/CmsMedia";
import { CmsVideoConsent } from "./CmsVideoConsent";
import { CmsVideoIframe } from "./CmsVideoIframe";
import { getVimeoVideoUrl } from "./videoEmbedUrl";

const translations = {
  cms: {
    video: {
      privacyNoticeText:
        "By viewing the video you agree that your data will be transferred to {platform} and that you have read the privacy policy.",
      acceptButtonLabel: "Accept",
    },
    vimeoVideo: {
      iframeTitle: "Vimeo video",
    },
  },
};

export function CmsElementVimeoVideo({
  content,
  ctx,
  className,
  style,
}: CmsComponentProps<CmsElementVimeoVideoContent>) {
  const t = withTranslationDefaults(ctx.translations, translations);

  const videoUrl = getVimeoVideoUrl({
    videoID: getConfigValue(content, "videoID"),
    byLine: getConfigValue(content, "byLine"),
    color: getConfigValue(content, "color"),
    doNotTrack: getConfigValue(content, "doNotTrack"),
    loop: getConfigValue(content, "loop"),
    mute: getConfigValue(content, "mute"),
    title: getConfigValue(content, "title"),
    portrait: getConfigValue(content, "portrait"),
    controls: getConfigValue(content, "controls"),
    autoplay: getConfigValue(content, "autoplay"),
  });

  const iframeTitle =
    getConfigValue(content, "iframeTitle") || t.cms.vimeoVideo.iframeTitle;
  const needsConfirmation = !!getConfigValue(content, "needsConfirmation");
  const previewMedia = content.data?.media;

  return (
    <div className={cx("cms-element-vimeo-video", className)} style={style}>
      {needsConfirmation ? (
        <CmsVideoConsent
          cookieName="vimeo-video"
          videoUrl={videoUrl}
          iframeTitle={iframeTitle}
          privacyNoticeText={getCmsTranslate(t.cms.video.privacyNoticeText, {
            platform: "Vimeo",
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
        <CmsVideoIframe src={videoUrl} title={iframeTitle} />
      )}
    </div>
  );
}
