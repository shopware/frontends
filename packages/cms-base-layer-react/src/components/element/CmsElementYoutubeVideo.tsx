import { getTranslatedProperty } from "@shopware/helpers";

import { cx } from "../../helpers/cx";
import { getConfigValue } from "../../helpers/slots";
import type { CmsComponentProps } from "../../registry";
import { getCmsTranslate, withTranslationDefaults } from "../../translations";
import type { CmsElementYoutubeVideo as CmsElementYoutubeVideoContent } from "../../types";
import { CmsMedia } from "../ui/CmsMedia";
import { CmsVideoConsent } from "./CmsVideoConsent";
import { CmsVideoIframe } from "./CmsVideoIframe";
import { getYoutubeVideoUrl } from "./videoEmbedUrl";

const translations = {
  cms: {
    video: {
      privacyNoticeText:
        "By viewing the video you agree that your data will be transferred to {platform} and that you have read the privacy policy.",
      acceptButtonLabel: "Accept",
    },
    youtubeVideo: {
      iframeTitle: "YouTube video",
    },
  },
};

export function CmsElementYoutubeVideo({
  content,
  ctx,
  className,
  style,
}: CmsComponentProps<CmsElementYoutubeVideoContent>) {
  const t = withTranslationDefaults(ctx.translations, translations);

  const videoUrl = getYoutubeVideoUrl({
    videoID: getConfigValue(content, "videoID"),
    loop: getConfigValue(content, "loop"),
    showControls: getConfigValue(content, "showControls"),
    start: getConfigValue(content, "start"),
    end: getConfigValue(content, "end"),
    advancedPrivacyMode: getConfigValue(content, "advancedPrivacyMode"),
  });

  const iframeTitle =
    getConfigValue(content, "iframeTitle") || t.cms.youtubeVideo.iframeTitle;
  const needsConfirmation = !!getConfigValue(content, "needsConfirmation");
  const previewMedia = content.data?.media;

  return (
    <div className={cx("cms-element-youtube-video", className)} style={style}>
      {needsConfirmation ? (
        <CmsVideoConsent
          cookieName="youtube-video"
          videoUrl={videoUrl}
          iframeTitle={iframeTitle}
          privacyNoticeText={getCmsTranslate(t.cms.video.privacyNoticeText, {
            platform: "YouTube",
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
