import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { db } from '../../firebase'; // Import your Firebase DB instance
import { collection, getDocs } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';

// Create the items API with fakeBaseQuery
export const coursesApi = createApi({
    reducerPath: 'coursesApi',
    baseQuery: fakeBaseQuery(),
    endpoints: (builder) => ({
        // Get all courses (Reading)
        getAllCourses: builder.query({
            queryFn: async () => {
                try {
                    const querySnapshot = await getDocs(collection(db, 'courses'));
                    const courses = [];

                    // Iterate through the Firestore snapshot and collect the data
                    querySnapshot.forEach((doc) => {
                        courses.push({
                            id: doc.id,
                            ...doc.data(),
                        });
                    });

                    // Return data in the format expected by RTK Query
                    return { data: courses };
                } catch (error) {
                    // If an error occurs, return the error message
                    return { error: { message: 'Error fetching courses' } };
                }
            },
        }),
    }),
});

export const { useGetAllCoursesQuery } = coursesApi;
