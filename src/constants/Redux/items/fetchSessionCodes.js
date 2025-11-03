import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';

export const sessionsApi = createApi({
    reducerPath: 'sessionsApi',
    baseQuery: fakeBaseQuery(),
    endpoints: (builder) => ({
        // Get all items (Reading)
        getAllSessionCodes: builder.query({
            queryFn: async () => {
                try {
                    const snapshot = await getDocs(collection(db, 'stock', 'items', 'sessionCodes'));
                    const codes = [];

                    // Iterate through the Firestore snapshot and collect the data
                    snapshot.forEach((doc) => {
                        codes.push({
                            id: doc.id,
                            ...doc.data(),
                        });
                    });

                    // Return data in the format expected by RTK Query
                    return { data: codes };
                } catch (error) {
                    // If an error occurs, return the error message
                    return { error: { message: 'Error fetching items' } };
                }
            },

        }),
    }),
});

export const { useGetAllSessionCodesQuery } = sessionsApi;

