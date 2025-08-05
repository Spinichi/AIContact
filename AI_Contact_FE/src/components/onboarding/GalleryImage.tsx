import type { ImgHTMLAttributes } from "react";

interface GalleryImageProps{
    img : ImgHTMLAttributes<HTMLImageElement>;
    desc : string;
}

export default function GalleryImage({img, desc} : GalleryImageProps){
    return(
        <div className="on-image">
            <img src={img} />
            <p>{desc}</p>
        </div>
    );
}