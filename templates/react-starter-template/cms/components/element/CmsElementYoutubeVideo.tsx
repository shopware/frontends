import { getConfigValue } from "../../helpers/slots";
import type { CmsComponentProps } from "../../registry";
import { withTranslationDefaults } from "../../translations";
import type { CmsElementYoutubeVideo as CmsElementYoutubeVideoContent } from "../../types";
import { CmsVideoElement } from "./CmsVideoElement";
import { getYoutubeVideoUrl } from "./videoEmbedUrl";

const translations = {
  cms: { youtubeVideo: { iframeTitle: "YouTube video" } },
};

export function CmsElementYoutubeVideo({
  content,
  ...layout
}: CmsComponentProps<CmsElementYoutubeVideoContent>) {
  const t = withTranslationDefaults(layout.ctx.translations, translations);

  return (
    <CmsVideoElement
      {...layout}
      platform="YouTube"
      cookieName="youtube-video"
      rootClassName="cms-element-youtube-video"
      videoUrl={getYoutubeVideoUrl({
        videoID: getConfigValue(content, "videoID"),
        loop: getConfigValue(content, "loop"),
        showControls: getConfigValue(content, "showControls"),
        start: getConfigValue(content, "start"),
        end: getConfigValue(content, "end"),
        advancedPrivacyMode: getConfigValue(content, "advancedPrivacyMode"),
      })}
      iframeTitle={
        getConfigValue(content, "iframeTitle") || t.cms.youtubeVideo.iframeTitle
      }
      needsConfirmation={!!getConfigValue(content, "needsConfirmation")}
      previewMedia={content.data?.media}
    />
  );
}
