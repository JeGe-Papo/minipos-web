import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
    departamentsApi,
    type CreateDepartamentDto,
    type UpdateDepartamentDto,
} from "./departaments";

const keys = {
    all: ["departaments"] as const,
};

export function useDepartaments() {
    return useQuery({
        queryKey: keys.all,
        queryFn: departamentsApi.list,
    });
}

export function useCreateDepartament() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (dto: CreateDepartamentDto) =>
            departamentsApi.create(dto),

        onSuccess: () =>
            qc.invalidateQueries({
                queryKey: keys.all,
            }),
    });
}

export function useUpdateDepartament() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            dto,
        }: {
            id: number;
            dto: UpdateDepartamentDto;
        }) => departamentsApi.update(id, dto),

        onSuccess: () =>
            qc.invalidateQueries({
                queryKey: keys.all,
            }),
    });
}

export function useDeleteDepartament() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (id: number) =>
            departamentsApi.remove(id),

        onSuccess: () =>
            qc.invalidateQueries({
                queryKey: keys.all,
            }),
    });
}