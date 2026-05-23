import { http } from "./http";

export type Departament = {
    id: number;
    name: string;
   
};

export type CreateDepartamentDto = {

    name: string;


};

export type UpdateDepartamentDto = Partial<CreateDepartamentDto>;

export const departamentsApi = {
    list: () => http<Departament[]>("/departments"),
    
    create: (dto: CreateDepartamentDto) =>
        http<Departament>("/departments", { method: "POST", body: JSON.stringify(dto) }),

    update: (id: number, dto: UpdateDepartamentDto) =>
        http<Departament>(`/departments/${id}`, {
            method: "PATCH", body: JSON.stringify(dto)
        }),

    remove: (id: number) => http<void>(`/departments/${id}`, { method: "DELETE" }),
}; 