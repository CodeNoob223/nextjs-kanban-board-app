import { berry } from "@/app/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const berryApi = createApi({
  reducerPath: "berryApi",
  baseQuery: fetchBaseQuery({baseUrl: "http://localhost:3000/api/test"}),
  tagTypes: ["berry"],
  endpoints: (builder) => ({
    search: builder.query<{data: berry[]}, string>({ //<What it returns, what is the input>
      query: (q) => `?name=${q}`,
      providesTags: (result, error, search) => [{
        type: "berry",
        search
      }]
    })
  })
});

export const { useSearchQuery : useSearchBerry } = berryApi;