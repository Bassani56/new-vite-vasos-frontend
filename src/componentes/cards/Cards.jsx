import './cards.css'
import { useNavigate, useParams } from "react-router-dom";

function Cards({ titulo, valor, diretorio, produto }) {

    const navigate = useNavigate();
    const params = useParams();

    const imgSrc = diretorio?.[0]?.url;

    function gerarSlug(texto) {
        return texto
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    }

    const handleClick = (diretorio) => {
        console.log('CARDS diretorio:: ', diretorio)

        navigate(
            `/produtos/${gerarSlug(produto.titulo_geral)}-${produto._id}`,
            {
                state: {
                    diretorio,
                    produto
                }
            }
        );
    };

    return (
        <div
            onClick={() => handleClick(imgSrc)}
            className="card"
        >

            {imgSrc && (
                <img
                    src={imgSrc}
                    alt={titulo}
                />
            )}

            <div className='descricao'>
                <h3>{titulo}</h3>
                <p>A PARTIR DE</p>
                <p>R$ {valor}</p>
            </div>

        </div>
    )
}

export default Cards