import Linkedin1 from "@/assets/landing/socialmedia/Linkedin-1.png";
import Instagram2 from "@/assets/landing/socialmedia/Instagram-21.jpg";
import Linkedin3 from "@/assets/landing/socialmedia/Linkedin-3.jpeg";
import Instagram4 from "@/assets/landing/socialmedia/Instagram-4.png";
import Linkedin5 from "@/assets/landing/socialmedia/Linkedin-5.png";
import Instagram6 from "@/assets/landing/socialmedia/Instagram-6.jpg";
import Linkedin7 from "@/assets/landing/socialmedia/Linkedin-7.png";
import Linkedin8 from "@/assets/landing/socialmedia/Linkedin-8.jpeg";
import { InstagramSvg, Linkedin, Whatsapp } from "@/assets/footer";
import { brandConfig } from "./theme";

  export const socialIcons = [
    { src: Linkedin, href: brandConfig.social.linkedin, alt: "LinkedIn" },
    { src: InstagramSvg, href: brandConfig.social.instagram, alt: "Instagram" },
    { src: Whatsapp, href: brandConfig.social.whatsApp, alt: "WhatsApp" },
  ];

export const socialConfig = [
    {
        title: "Emerald Diamond with Clips",
        image: Linkedin1,
        link: "https://www.linkedin.com/posts/henig-diamonds_our-stock-your-advantage-activity-7386357744783609856-6iS9?",
        icon: { src: Linkedin, href: brandConfig.social.linkedin, alt: "LinkedIn" }
    },
    {
        title: "Diamonds (Instagram)",
        image: Instagram2,
        link: "https://www.instagram.com/p/DTIjwXxiMmH/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
        icon: { src: InstagramSvg, href: brandConfig.social.instagram, alt: "Instagram" }
    },
    {
        title: "Marquise Cut",
        image: Linkedin3,
        link: "https://www.linkedin.com/posts/henig-diamonds_classic-cuts-redefined-activity-7373626821491273728-K-HD?utm_source=share&utm_medium=member_desktop&rcm=ACoAADVdQvsBZs0PdA2n-QpxLGJfitPBd8sfyvk",
        icon: { src: Linkedin, href: brandConfig.social.linkedin, alt: "LinkedIn" }
    },
    {
        title: "Waterfall Bracelet",
        image: Instagram4,
        link: "https://www.instagram.com/henigdiamonds/p/DRPqvYLCGEH/",
        icon: { src: InstagramSvg, href: brandConfig.social.instagram, alt: "Instagram" }
    },
    {
        title: "Rings (LinkedIn)",
        image: Linkedin5,
        link: "https://www.linkedin.com/feed/update/urn:li:activity:7404505209042915329",
        icon: { src: Linkedin, href: brandConfig.social.linkedin, alt: "LinkedIn" }
    },
    {
        title: "Bespoke",
        image: Instagram6,
        link: "https://www.instagram.com/p/DR2Q0qBjD1D/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
        icon: { src: InstagramSvg, href: brandConfig.social.instagram, alt: "Instagram" }
    },
    {
        title: "Jewellery Certification",
        image: Linkedin7,
        link: "https://www.linkedin.com/feed/update/urn:li:activity:7396483192209186816",
        icon: { src: Linkedin, href: brandConfig.social.linkedin, alt: "LinkedIn" }
    },
    {
        title: "Diamonds (LinkedIn)",
        image: Linkedin8,
        link: "https://www.linkedin.com/feed/update/urn:li:activity:7377363860439306240",
        icon: { src: Linkedin, href: brandConfig.social.linkedin, alt: "LinkedIn" }
    }
];