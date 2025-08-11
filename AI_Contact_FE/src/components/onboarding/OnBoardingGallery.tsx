import image1 from "../../assets/images/Slides/slide1.png";
import image2 from "../../assets/images/Slides/slide2.png";
import image3 from "../../assets/images/Slides/slide3.png";
import image4 from "../../assets/images/Slides/slide4.png";
import image5 from "../../assets/images/Slides/slide5.png";
import image6 from "../../assets/images/Slides/slide6.png";
import GalleryImage from "./GalleryImage";

export default function OnBoardingGallery() {
  return (
    <div className="onboarding-gallery">
      <GalleryImage img={image1} desc="채팅" />
      <GalleryImage img={image2} desc="고민상담소" />
      <GalleryImage img={image3} desc="네컷만화" />
      <GalleryImage img={image4} desc="공유캘린더" />
      <GalleryImage img={image5} desc="공유갤러리" />
      <GalleryImage img={image6} desc="화상통화" />
    </div>
  );
}
