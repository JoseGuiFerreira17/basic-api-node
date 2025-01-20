export function buildRoutePath(path) {
  const regex = /:([a-zA-Z]+)/g;

  const pathWithParams = path.replaceAll(regex, "(?<$1>[\\w\\-]+)");

  const pathRegex = new RegExp(`^${pathWithParams}(?<query>\\?.*)?$`);

  return pathRegex;
}
