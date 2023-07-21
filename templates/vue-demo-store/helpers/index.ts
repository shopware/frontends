export const getPath = (imgurl: string) => {
  var url = new URL(imgurl);
  return url.pathname;
};
