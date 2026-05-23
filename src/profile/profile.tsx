export default function Profile({ name, semester, Academic }: 
    { name: string, semester: string, Academic: string
        
     }) {
    return (
        <h1 className="text-[#ffffff]">
            Estudiante {name} Semestre: {semester} Programa académico: {Academic}
        </h1>
    );
}
