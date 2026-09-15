/** Resolve local artwork beneath the deployment base; leave external URLs alone. */
export function assetUrl(path: string | undefined): string | undefined {
  if (!path?.startsWith('/art/')) return path
  return import.meta.env.BASE_URL + path.slice(1)
}
