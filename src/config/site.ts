export const baseURL: string = import.meta.env.VITE_API_URL!;
export const newApiURL: string = import.meta.env.VITE_NEW_API_URL!;
export const oldWebsiteURL: string = 'https://henigdiamonds.co.uk';
export const oldJewelleryWebsiteURL: string = 'https://jewellery.henigdiamonds.co.uk';

export const websiteUrlConfig = {
    Home: `/`,
    Blogs: `/blogs`,
    Careers: `/careers`,
    Contact: `/contact`,
    Sitemap: `/sitemap`,
    TermsAndConditions: `/terms-and-conditions`,
    PrivacyPolicy: `/privacy-policy`,
    CancellationReturnsPolicy: `/cancellation-returns-policy`,
    CookiesPolicy: `/cookies-policy`,
    SupplyOfGoodsTerms: `/supply-of-goods-terms`,
    AmlPolicy: `/aml-policy`,
    WebsiteTermsOfUse: `/website-terms-of-use`,
    Landing: {
        ShopCollection: `${oldJewelleryWebsiteURL}/collections/all`,
        BestSeller: `${oldJewelleryWebsiteURL}/collections/all`
    },
    Jewellery: {
        Home: '/jewellery',
        All: '/jewellery/all',
        NewArrival: '/jewellery/all',
        BestSeller: '/jewellery/all',
        Rings: '/jewellery/rings',
        Earrings: '/jewellery/earrings',
        Bracelets: '/jewellery/bracelets',
        Necklaces: '/jewellery/necklaces',
    },
    Diamonds: {
        Home: `/diamonds`,
        All: `/diamonds/all`,
    }
};