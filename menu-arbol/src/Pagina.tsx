interface Props {
  titulo: string;
}

function Pagina({ titulo }: Props) {
  return <h1>{titulo}</h1>;
}

export default Pagina;
