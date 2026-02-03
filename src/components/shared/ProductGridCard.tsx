import { Product } from '@/config/jewellery/products';


const ProductGridCard = ({ product }: { product: Product }) => {
    return (
        <div className="group">
            <div className="aspect-[3/4] overflow-hidden rounded-md">
                <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
            </div>


            <div className="mt-4">
                <h3 className="text-sm font-medium">{product.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{product.material}</p>
                <p className="mt-2 text-sm font-semibold">
                    {product.currency}
                    {product.price.toFixed(2)}
                </p>
            </div>
        </div>
    );
};


export default ProductGridCard;