export const baseURL: string = import.meta.env.VITE_API_URL!;
export const oldWebsiteURL: string = 'https://henigdiamonds.co.uk';
export const oldJewelleryWebsiteURL: string = 'https://jewellery.henigdiamonds.co.uk';

export const websiteUrlConfig = {
    Home: `/`,
    Blogs: `/blogs`,
    // Contact: `/contact`,
    Contact: `${oldWebsiteURL}/contact-us`,
    Landing: {
        ShopCollection: `${oldJewelleryWebsiteURL}/collections/all`,
        BestSeller: `${oldJewelleryWebsiteURL}/collections/all`
    },
    Jewellery: {
        Home: '/jewellery',
        All: `${oldJewelleryWebsiteURL}/collections/all`,
        NewArrival: `${oldJewelleryWebsiteURL}/collections/all`,
        BestSeller: `${oldJewelleryWebsiteURL}/collections/all`,
        Rings: `${oldJewelleryWebsiteURL}/collections/rings`,
        Earrings: `${oldJewelleryWebsiteURL}/collections/earrings`,
        Bracelets: `${oldJewelleryWebsiteURL}/collections/bracelets`,
        Necklaces: `${oldJewelleryWebsiteURL}/collections/necklaces`,
    },
    Diamonds: {
        Home: `${oldWebsiteURL}/diamonds/all`,
        All: `${oldWebsiteURL}/diamonds/all`,
    }
};