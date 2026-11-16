import { getConfigValue } from "../../helpers/slots";
import type { CmsComponentProps } from "../../registry";
import { withTranslationDefaults } from "../../translations";
import type { CmsElementVimeoVideo as CmsElementVimeoVideoContent } from "../../types";
import { CmsVideoElement } from "./CmsVideoElement";
import { getVimeoVideoUrl } from "./videoEmbedUrl";

const translations = {
  cms: { vimeoVideo: { iframeTitle: "Vimeo video" } },
};

export function CmsElementVimeoVideo({
  content,
  ...layout
}: CmsComponentProps<CmsElementVimeoVideoContent>) {
  const t = withTranslationDefaults(layout.ctx.translations, translations);

  return (
    <CmsVideoElement
      {...layout}
      platform="Vimeo"
      cookieName="vimeo-video"
      rootClassName="cms-element-vimeo-video"
      videoUrl={getVimeoVideoUrl({
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
      })}
      iframeTitle={
        getConfigValue(content, "iframeTitle") || t.cms.vimeoVideo.iframeTitle
      }
      needsConfirmation={!!getConfigValue(content, "needsConfirmation")}
      previewMedia={content.data?.media}
    />
  );
}
