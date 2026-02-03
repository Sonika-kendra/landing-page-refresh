import { Product } from '@/config/jewellery/products';


const ProductListRow = ({ product }: { product: Product }) => {
    return (
        <div className="flex gap-10 items-start border-b pb-12">
            <div className="relative w-[280px] shrink-0">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full object-contain"
                />


                <div className="absolute right-3 top-3 flex flex-col gap-3">
                    <button className="h-9 w-9 rounded-full border bg-white text-xs">♡</button>
                    <button className="h-9 w-9 rounded-full border bg-white text-xs">⟳</button>
                    <button className="h-9 w-9 rounded-full border bg-white text-xs">🔍</button>
                </div>
            </div>


            <div className="flex-1 max-w-[640px]">
                <p className="text-xs text-muted-foreground uppercase">Rings</p>


                <h3 className="mt-1 text-lg font-medium">{product.name}</h3>


                <p className="mt-2 text-sm font-semibold">
                    {product.currency}
                    {product.price.toFixed(2)}
                </p>


                <div className="mt-3 flex gap-2">
                    <span className="h-6 w-6 rounded-full border bg-yellow-400" />
                    <span className="h-6 w-6 rounded-full border bg-gray-300" />
                    <span className="h-6 w-6 rounded-full border bg-zinc-200" />
                </div>


                <p className="mt-4 text-sm text-muted-foreground line-clamp-3">
                    This collection of Rings in 18KT White Gold, 18KT Yellow Gold, 950 Platinum,
                    each featuring diamonds in weight(s) of 1.0 Ct. Available in sizes M.
                </p>


                <button className="mt-6 text-sm underline underline-offset-4">
                    Select Options
                </button>
            </div>
        </div>
    );
};


export default ProductListRow;