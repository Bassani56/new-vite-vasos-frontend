import { useLocation } from "react-router-dom";

import Menu from "../../componentes/menu/Menu.jsx";
import Footer from "../../componentes/rodape/Footer.jsx";
import Cards from "../../componentes/cards/Cards.jsx";
import { apiUrl } from "../../config/api.js";

import "./produtos.css";
import { useEffect, useState } from "react";

function Produtos() {
    const location = useLocation();

    const produto = location.state?.produto;

    const [acabamento, setAcabamento] = useState(
        produto?.variantes?.[0]?.acabamento || ""
    );

    const [tamanho, setTamanho] = useState(
        produto?.variantes?.[0]?.tamanho || ""
    );

    const [imagemSelecionada, setImagemSelecionada] = useState(
        produto?.imagem_geral?.[0]?.url || null
    );

    const [relacionados, setRelacionados] = useState([]);

    const [quantidade, setQuantidade] = useState(1);

    useEffect(() => {
        if (!produto) return;

        const grupoCor = produto.imagens_por_cor?.find(
            item => item.cor === acabamento
        );

        if (grupoCor?.imagens?.length > 0) {
            setImagemSelecionada(grupoCor.imagens[0].url);
        } else if (produto.imagem_geral?.length > 0) {
            setImagemSelecionada(produto.imagem_geral[0].url);
        }
    }, [acabamento, produto]);

    useEffect(() => {
        async function fetchRelacionados() {
            try {
                const resposta = await fetch(
                    apiUrl("/relacionados"),
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            produto,
                        }),
                    }
                );

                const json = await resposta.json();
                console.log("Produtos relacionados recebidos:", json);

                setRelacionados(json.rel || []);
            } catch (error) {
                console.error(error);
            }
        }

        if (produto) {
            fetchRelacionados();
            window.scrollTo(0, 0);
        }
    }, [produto]);

    if (!produto) {
        return <div>Produto não encontrado.</div>;
    }

    const grupoCorAtual = produto.imagens_por_cor?.find(
        item => item.cor === acabamento
    );

    const imagensFiltradas =
        grupoCorAtual?.imagens?.length > 0
            ? grupoCorAtual.imagens.map(img => img.url)
            : produto.imagem_geral?.map(img => img.url) || [];

    const variacaoSelecionada = produto.variantes.find(
        variante =>
            variante.acabamento === acabamento &&
            variante.tamanho === tamanho
    );

    function adicionarAoCarrinho(
        id,
        titulo,
        preco,
        quantidade,
        imagemSelecionada,
        varianteSelecionada,
        acabamento
    ) {
        const novoProduto = {
            id,
            titulo,
            preco,
            quantidade,
            diretorio: imagemSelecionada,
            variante: varianteSelecionada,
            opcao: acabamento,
            selecionado: true,
        };

        try {
            let produtos = JSON.parse(
                localStorage.getItem("produto")
            );

            if (produtos) {
                const index = produtos.findIndex(prod =>
                    prod.id === novoProduto.id &&
                    prod.preco === novoProduto.preco &&
                    prod.diretorio === novoProduto.diretorio &&
                    prod.variante?.id === novoProduto.variante?.id &&
                    prod.opcao === novoProduto.opcao
                );

                if (index !== -1) {
                    produtos[index].quantidade += quantidade;
                } else {
                    produtos.push(novoProduto);
                }

                localStorage.setItem(
                    "produto",
                    JSON.stringify(produtos)
                );
            } else {
                localStorage.setItem(
                    "produto",
                    JSON.stringify([novoProduto])
                );
            }
        } catch (error) {
            console.error(error);
        }
    }

    const gerarSlug = (texto = "") =>
        texto
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

    const formatarPreco = (valor) =>
        (Number(valor) || 0).toFixed(2);

    const formatarDimensao = (valor) => {
        if (!valor) return null;

        const texto = String(valor);

        return texto.toLowerCase().includes("cm") ? texto : `${texto}cm`;
    };

    const formatarMedida = (variante) => {
        if (variante?.tamanho) {
            return variante.tamanho;
        }

        const altura = variante?.dimensoes?.altura;
        const largura = variante?.dimensoes?.largura;

        if (altura && largura) {
            return `${formatarDimensao(altura)} x ${formatarDimensao(largura)}`;
        }

        return null;
    };

    const gerarLinkProduto = () => {
        const slug = `${gerarSlug(produto.titulo_geral)}-${produto._id}`;
        const dirParam = imagemSelecionada
            ? `?dir=${encodeURIComponent(imagemSelecionada)}`
            : "";

        return `https://casadooleiroo.com.br/produto/${slug}${dirParam}`;
    };

    const gerarMensagemWhatsApp = () => {
        const preco = variacaoSelecionada?.preco || produto.variantes?.[0]?.preco;
        const medida = formatarMedida(variacaoSelecionada);
        const total = Number(preco) * Number(quantidade);

        let msg = "Ola! Tenho interesse nos seguintes produtos:\n\n";

        msg += `- ${produto.titulo_geral}\n`;
        if (medida) msg += `Medida: ${medida}\n`;
        if (acabamento) msg += `Acabamento: ${acabamento}\n`;
        msg += `Quantidade: ${quantidade}\n`;
        msg += `Preco un: R$ ${formatarPreco(preco)}\n`;
        msg += `Link: ${gerarLinkProduto()}\n\n`;
        msg += `Total: R$ ${formatarPreco(total)}\n`;

        const url = `https://api.whatsapp.com/send/?phone=5541995264057&text=${encodeURIComponent(msg)}&type=phone_number&app_absent=0`;
        window.open(url, "_blank");
    };

    return (
        <div className="dashboard-produtos">
            <header>
                <Menu />
            </header>

            <section>
                <div className="container-center-produtos">
                    <div className="container-carousel-produtos">
                        {imagensFiltradas.map((img) => (
                            <div
                                key={img}
                                className="carousel-produtos"
                                onClick={() =>
                                    setImagemSelecionada(img)
                                }
                            >
                                <img src={img} alt="" />
                            </div>
                        ))}
                    </div>

                    <div className="container-imagem-principal">
                        <div className="img-principal">
                            <img
                                src={imagemSelecionada}
                                alt={produto.titulo_geral}
                            />
                        </div>
                    </div>

                    <div className="descricao-produto">
                        <div className="descricao-info">
                            <h1>{produto.titulo_geral}</h1>

                            <span className="preco-produto">
                                R${" "}
                                {variacaoSelecionada
                                    ? variacaoSelecionada.preco
                                    : produto.variantes?.[0]?.preco}
                            </span>

                            <span
                                style={{
                                    fontSize: "15px",
                                    fontWeight: 600,
                                    letterSpacing: 0,
                                    color: "#2d2d2d",
                                    fontFamily: "Poppins, sans-serif",
                                }}
                            >
                                Opção:
                            </span>

                            <div className="buttons-opc">
                                {[...new Set(
                                    produto.variantes.map(
                                        v => v.acabamento
                                    )
                                )].map((acab) => {
                                    const selecionado =
                                        acabamento === acab;

                                    return (
                                        <button
                                            key={acab}
                                            onClick={() =>
                                                !selecionado &&
                                                setAcabamento(acab)
                                            }
                                            disabled={selecionado}
                                            className={
                                                selecionado
                                                    ? "btn-opc ativo"
                                                    : "btn-opc"
                                            }
                                        >
                                            {acab}
                                        </button>
                                    );
                                })}
                            </div>

                            <span
                                style={{
                                    fontSize: "15px",
                                    fontWeight: 600,
                                    letterSpacing: 0,
                                    color: "#2d2d2d",
                                    fontFamily: "Poppins, sans-serif",
                                }}
                            >
                                Medidas:
                            </span>

                            <div className="buttons-opc">
                                {[...new Set(
                                    produto.variantes.map(
                                        v => v.tamanho
                                    )
                                )].map((tam) => {
                                    const selecionado =
                                        tamanho === tam;

                                    return (
                                        <button
                                            key={tam}
                                            onClick={() =>
                                                !selecionado &&
                                                setTamanho(tam)
                                            }
                                            disabled={selecionado}
                                            className={
                                                selecionado
                                                    ? "btn-opc ativo"
                                                    : "btn-opc"
                                            }
                                        >
                                            {tam}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="container-buttons">
                            <div className="cima">
                                <div className="quantidade_container">
                                    <button
                                        className="qtd_btn"
                                        onClick={() =>
                                            quantidade > 1 &&
                                            setQuantidade(
                                                quantidade - 1
                                            )
                                        }
                                    >
                                        -
                                    </button>

                                    <span className="qtd_valor">
                                        {quantidade}
                                    </span>

                                    <button
                                        className="qtd_btn"
                                        onClick={() =>
                                            setQuantidade(
                                                quantidade + 1
                                            )
                                        }
                                    >
                                        +
                                    </button>
                                </div>

                                <button
                                    className="buy-button"
                                    onClick={() =>
                                        adicionarAoCarrinho(
                                            produto._id,
                                            produto.titulo_geral,
                                            variacaoSelecionada?.preco ||
                                                produto.variantes[0]
                                                    .preco,
                                            quantidade,
                                            imagemSelecionada,
                                            variacaoSelecionada,
                                            acabamento
                                        )
                                    }
                                >
                                    Adicionar ao Carrinho
                                </button>
                            </div>

                            <button
                                className="whats-button"
                                onClick={gerarMensagemWhatsApp}
                            >
                                Entrar em Contato
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div className="container-descr-geral">
                    <h2>Descrição Geral</h2>

                    <div className="descricao-produto">
                        {produto.descricao
                            ?.split("\n")
                            .map((linha, index) => {
                                if (linha.includes(":")) {
                                    const [titulo, ...resto] =
                                        linha.split(":");

                                    return (
                                        <p key={index}>
                                            <strong>
                                                {titulo}:
                                            </strong>{" "}
                                            {resto.join(":")}
                                        </p>
                                    );
                                }

                                return (
                                    <p key={index}>{linha}</p>
                                );
                            })}
                    </div>
                </div>
            </section>

            <section>
                <h2>Produtos Relacionados</h2>

                <div className="container-related-produtos">
                    {relacionados.map((rel) => {
                        if (String(rel._id) === String(produto._id))
                            return null;

                        return (
                            <Cards
                                key={rel._id}
                                titulo={rel.titulo_geral}
                                valor={rel.variantes?.[0]?.preco}
                                diretorio={rel.imagem_geral}
                                produto={rel}
                            />
                        );
                    })}
                </div>
            </section>

            <footer>
                <Footer />
            </footer>
        </div>
    );
}

export default Produtos;
