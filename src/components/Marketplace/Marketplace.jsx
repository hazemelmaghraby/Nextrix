import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../constants/Redux/items/itemsSlice';
import { auth, db } from '../../constants/firebase';
import { collection, getDocs } from 'firebase/firestore';


const Marketplace = () => {
    const [marketplaceItems, setMarketplaceItems] = useState([]);
    const dispatch = useDispatch();
    const items = useSelector(state => state.itemsReducer.items);

    useEffect(() => {
        const fetchItems = async () => {
            const itemsRef = collection(db, 'stock', 'items', 'books');
            const itemsSnapshot = await getDocs(itemsRef);
            setMarketplaceItems(itemsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };
        fetchItems();
    }, []);
    return (
        <div>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8 text-center">Marketplace</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {marketplaceItems.map(item => (
                        <div
                            key={item.id}
                            className="bg-zinc-900 rounded-lg shadow-lg p-6 flex flex-col items-center hover:shadow-xl transition-shadow"
                        >
                            <div className="w-28 h-28 bg-zinc-800 rounded mb-4 flex items-center justify-center">
                                {/* Placeholder for image if available */}
                                {item.imageUrl ? (
                                    <img src={item.imageUrl} alt={item.name} className="object-cover w-full h-full rounded" />
                                ) : (
                                    <span className="text-zinc-400 text-4xl">{item.title?.substring(0, 1) || "?"}</span>
                                )}
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-center">{item.title}</h3>
                            {item.desc && (
                                <p className="text-zinc-400 text-sm text-center mb-4 line-clamp-3">{item.desc}</p>
                            )}
                            {item.price && (
                                <div className="mt-auto text-green-400 font-bold text-lg mb-2">
                                    ${item.price}
                                </div>
                            )}
                            {/* Example add to cart button */}
                            <button
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                                onClick={() => dispatch(addToCart({ ...item, quantity: 1 }))}
                            >
                                Add to Cart
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Marketplace;