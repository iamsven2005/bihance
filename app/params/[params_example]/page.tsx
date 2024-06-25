interface Props{
params:{
    params_example: string
}
}
export default function Props({params}: Props){
    return ( 
        <div>
            {params.params_example}
        </div>
    );
}