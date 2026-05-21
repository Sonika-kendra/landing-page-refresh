export const baseURL: string = import.meta.env.VITE_API_URL!;
export const newApiURL: string = import.meta.env.VITE_NEW_API_URL!;
export const oldWebsiteURL: string = 'https://henigdiamonds.co.uk';
export const oldJewelleryWebsiteURL: string = 'https://jewellery.henigdiamonds.co.uk';

export const websiteUrlConfig = {
    Home: `/`,
    Blogs: `/blogs`,
    Careers: `/careers`,
    Contact: `/contact`,
    TermsAndConditions: `/terms-and-conditions`,
    PrivacyPolicy: `/privacy-policy`,
    CancellationReturnsPolicy: `/cancellation-returns-policy`,
    QualityPolicy: `/quality-policy`,
    CookiesPolicy: `/cookies-policy`,
    Landing: {
        ShopCollection: `${oldJewelleryWebsiteURL}/collections/all`,
        BestSeller: `${oldJewelleryWebsiteURL}/collections/all`
    },
    Jewellery: {
        Home: '/jewellery',
        All: '/jewellery/all',
        NewArrival: '/jewellery/all',
        BestSeller: '/jewellery/all',
        Rings: '/jewellery/all',
        Earrings: '/jewellery/all',
        Bracelets: '/jewellery/all',
        Necklaces: '/jewellery/all',
    },
    Diamonds: {
        Home: `${oldWebsiteURL}/diamonds/all`,
        All: `${oldWebsiteURL}/diamonds/all`,
    }
};