import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Employee {
    id: number;
    name: string;
    position: string;
    department: string;
}

export const employeeApi = createApi({
    reducerPath: "employeeApi",
    baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
    endpoints: (builder) => ({
        getEmployees: builder.query<Employee[], void>({
            query: () => "employees",
        }),
        addEmployee: builder.mutation<void, Omit<Employee, "id">>({
            query: (employee) => ({
                url: "employees",
                method: "POST",
                body: employee,
            }),
        }),
        updateEmployee: builder.mutation<void, Employee>({
            query: ({ id, ...rest }) => ({
                url: `employees/${id}`,
                method: "PUT",
                body: rest,
            }),
        }),
        deleteEmployee: builder.mutation<void, number>({
            query: (id) => ({
                url: `employees/${id}`,
                method: "DELETE",
            }),
        }),
    }),
});

export const {
    useGetEmployeesQuery,
    useAddEmployeeMutation,
    useUpdateEmployeeMutation,
    useDeleteEmployeeMutation,
} = employeeApi;
