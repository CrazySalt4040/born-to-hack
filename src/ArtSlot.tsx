/** Optional art hook. No assets are loaded until a licensed src is supplied. */
export function ArtSlot({src,alt}:{src?:string;alt:string}) {
  return src?<img className="art-slot" src={src} alt={alt} loading="lazy"/>:null;
}
