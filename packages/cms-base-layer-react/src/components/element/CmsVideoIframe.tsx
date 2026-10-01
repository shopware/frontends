export type CmsVideoIframeProps = {
  src: string;
  title: string;
};

export function CmsVideoIframe({ src, title }: CmsVideoIframeProps) {
  return (
    <iframe
      className="w-full inset-0 aspect-video"
      src={src}
      title={title}
      allowFullScreen
    />
  );
}
