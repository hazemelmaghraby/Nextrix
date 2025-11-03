import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { db } from '../../firebase'; // Import your Firebase DB instance
import { collection, getDocs } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';

// Create the items API with fakeBaseQuery
export const itemsApi = createApi({
    reducerPath: 'itemsApi',
    baseQuery: fakeBaseQuery(),
    endpoints: (builder) => ({
        // Get all items (Reading)
        getAllItems: builder.query({
            queryFn: async () => {
                try {
                    const querySnapshot = await getDocs(collection(db, 'stock', 'items', 'books'));
                    const items = [];

                    // Iterate through the Firestore snapshot and collect the data
                    querySnapshot.forEach((doc) => {
                        items.push({
                            id: doc.id,
                            ...doc.data(),
                        });
                    });

                    // Return data in the format expected by RTK Query
                    return { data: items };
                } catch (error) {
                    // If an error occurs, return the error message
                    return { error: { message: 'Error fetching items' } };
                }
            },

        }),
    }),
});

export const { useGetAllItemsQuery } = itemsApi;
