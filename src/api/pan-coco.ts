import { http } from "./http";

export type PanCoco = {
    id: number;
     nombre: string;
    precio: number;
    stock: number;
   
};

export type CreatePancocoDto = {
    nombre: string;
    precio: number;
    stock: number;
};

export type UpdatePanCocoDto = Partial<CreatePancocoDto>;

export const pancocoApi = {
    list: () => http<PanCoco[]>("/pan-coco"),
    
    create: (dto: CreatePancocoDto) =>
        http<PanCoco>("/pan-coco", { method: "POST", body: JSON.stringify(dto) }),

    update: (id: number, dto: UpdatePanCocoDto) =>
        http<PanCoco>(`/pan-coco/${id}`, {
            method: "PATCH", body: JSON.stringify(dto)
        }),

    remove: (id: number) => http<void>(`/pan-coco/${id}`, { method: "DELETE" }),
};