export default function getUrlPrefix() {
  try {
    return inject("urlPrefix", "");
  } catch ($error) {
    return "";
  }
}
