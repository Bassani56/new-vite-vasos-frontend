import { useLocation, useNavigate } from "react-router-dom";

import Menu from "../../componentes/menu/Menu.jsx";
import Footer from "../../componentes/rodape/Footer.jsx";
import Cards from "../../componentes/cards/Cards.jsx";
import { apiUrl } from "../../config/api.js";

import "./produtos.css";
import { useEffect, useState } from "react";

// ─── Ícone SVG do carrinho ─────────────────────────────────────────────────
function IconeCarrinho({ size = 22 }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <path
                d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <line
                x1="3"
                y1="6"
                x2="21"
                y2="6"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <path
                d="M16 10a4 4 0 01-8 0"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

// ─── Carrinho Flutuante ────────────────────────────────────────────────────
function CarrinhoFlutuante({ quantidade, onClick }) {
    return (
        <button
            className="carrinho-flutuante"
            onClick={onClick}
            aria-label={`Ver carrinho${quantidade > 0 ? ` — ${quantidade} ${quantidade === 1 ? "item" : "itens"}` : ""}`}
            title="Ver carrinho"
        >
            <span className="carrinho-flutuante__icone">
                <IconeCarrinho size={22} />
                {quantidade > 0 && (
                    <span className="carrinho-flutuante__badge" aria-hidden="true">
                        {quantidade > 99 ? "99+" : quantidade}
                    </span>
                )}
            </span>
            <span className="carrinho-flutuante__texto">
                {quantidade > 0 ? `Ver carrinho (${quantidade})` : "Carrinho"}
            </span>
        </button>
    );
}

// ─── Página principal ──────────────────────────────────────────────────────
function Produtos() {
    const location = useLocation();
    const navigate = useNavigate();

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
    const [corDesejada, setCorDesejada] = useState("");
    const [mostrarCorDesejada, setMostrarCorDesejada] = useState(false);
    const [quantidade, setQuantidade] = useState(1);
    const [qtdCarrinho, setQtdCarrinho] = useState(0);

    // Atualiza badge do carrinho sempre que o localStorage mudar
    useEffect(() => {
        function atualizarContagem() {
            try {
                const itens = JSON.parse(localStorage.getItem("produto")) || [];
                const total = itens.reduce((acc, item) => acc + (item.quantidade || 1), 0);
                setQtdCarrinho(total);
            } catch {
                setQtdCarrinho(0);
            }
        }
        atualizarContagem();
        window.addEventListener("storage", atualizarContagem);
        return () => window.removeEventListener("storage", atualizarContagem);
    }, []);

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

    const variacaoCorPersonalizada = produto.variantes.find(
        variante =>
            variante.acabamento !== "natural" &&
            variante.tamanho === tamanho
    );

    const precoExibido = mostrarCorDesejada
        ? (variacaoCorPersonalizada?.preco ?? variacaoSelecionada?.preco ?? produto.variantes?.[0]?.preco)
        : (variacaoSelecionada?.preco ?? produto.variantes?.[0]?.preco);

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
            let produtos = JSON.parse(localStorage.getItem("produto"));

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

                localStorage.setItem("produto", JSON.stringify(produtos));
            } else {
                localStorage.setItem("produto", JSON.stringify([novoProduto]));
            }

            // Atualiza o badge imediatamente após adicionar
            const total = (produtos || [novoProduto]).reduce(
                (acc, item) => acc + (item.quantidade || 1),
                0
            );
            setQtdCarrinho(total);
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
        const preco = precoExibido;
        const medida = formatarMedida(variacaoSelecionada ?? variacaoCorPersonalizada);
        const total = Number(preco) * Number(quantidade);

        let msg = "Ola! Tenho interesse nos seguintes produtos:\n\n";

        msg += `- ${produto.titulo_geral}\n`;
        if (medida) msg += `Medida: ${medida}\n`;
        if (corDesejada) {
            msg += `Cor desejada: ${corDesejada}\n`;
        } else if (acabamento) {
            msg += `Acabamento: ${acabamento}\n`;
        }
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
                    {/* Carrossel lateral */}
                    <div className="container-carousel-produtos">
                        {imagensFiltradas.map((img) => (
                            <div
                                key={img}
                                className="carousel-produtos"
                                onClick={() => setImagemSelecionada(img)}
                            >
                                <img src={img} alt="" />
                            </div>
                        ))}
                    </div>

                    {/* Imagem principal */}
                    <div className="container-imagem-principal">
                        <div className="img-principal">
                            <img
                                src={imagemSelecionada}
                                alt={produto.titulo_geral}
                            />
                        </div>
                    </div>

                    {/* Informações do produto */}
                    <div className="descricao-produto">
                        <div className="descricao-info">
                            <h1>{produto.titulo_geral}</h1>

                            <span className="preco-produto">
                                R$ {precoExibido}
                            </span>

                            {!mostrarCorDesejada && (
                                <>
                                    <span className="label-opcao">Opção</span>

                                    <div className="buttons-opc">
                                        {[...new Set(
                                            produto.variantes.map(v => v.acabamento)
                                        )].map((acab) => {
                                            const selecionado = acabamento === acab;
                                            return (
                                                <button
                                                    key={acab}
                                                    onClick={() => {
                                                        if (!selecionado) {
                                                            setAcabamento(acab);
                                                            setCorDesejada("");
                                                        }
                                                    }}
                                                    disabled={selecionado}
                                                    className={selecionado ? "btn-opc ativo" : "btn-opc"}
                                                >
                                                    {acab}
                                                </button>
                                            );
                                        })}

                                        <button
                                            type="button"
                                            className="btn-opc"
                                            onClick={() => {
                                                setMostrarCorDesejada(true);
                                                setCorDesejada("");
                                            }}
                                        >
                                            Não tem a cor que quero
                                        </button>
                                    </div>
                                </>
                            )}

                            {mostrarCorDesejada && (
                                <div className="custom-color-box">
                                    <div className="custom-color-header">
                                        <span>Qual cor você deseja?</span>
                                        <button
                                            type="button"
                                            className="btn-fechar-cor"
                                            aria-label="Fechar"
                                            onClick={() => {
                                                setMostrarCorDesejada(false);
                                                setCorDesejada("");
                                            }}
                                        >
                                            ×
                                        </button>
                                    </div>

                                    <div className="custom-color-row">
                                        <label>
                                            Cor desejada
                                            <input
                                                type="text"
                                                value={corDesejada}
                                                onChange={event =>
                                                    setCorDesejada(event.target.value)
                                                }
                                                placeholder="Ex: azul marinho, bege..."
                                            />
                                        </label>

                                        <button
                                            type="button"
                                            className="whats-button"
                                            onClick={gerarMensagemWhatsApp}
                                            disabled={!corDesejada.trim()}
                                            style={{ height: 40, borderRadius: 8, fontSize: 14, whiteSpace: "nowrap", padding: "0 14px" }}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                <path d="M20.52 3.48A11.93 11.93 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.17 1.6 5.99L0 24l6.19-1.62A11.97 11.97 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.21-1.25-6.22-3.48-8.52zM12 22c-1.85 0-3.66-.5-5.23-1.43l-.37-.22-3.88 1.02 1.04-3.77-.24-.38A9.95 9.95 0 0 1 2 12C2 6.48 6.48 2 12 2c2.67 0 5.18 1.04 7.07 2.93A9.95 9.95 0 0 1 22 12c0 5.52-4.48 10-10 10zm5.49-7.47c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.68-1.64-.93-2.24-.24-.59-.49-.51-.68-.52-.18-.01-.37-.01-.57-.01-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.87 1.22 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35z" fill="#25D366"/>
                                            </svg>
                                            Enviar
                                        </button>
                                    </div>
                                </div>
                            )}

                            <span className="label-opcao">Medidas</span>

                            <div className="buttons-opc">
                                {[...new Set(
                                    produto.variantes.map(v => v.tamanho)
                                )].map((tam) => {
                                    const selecionado = tamanho === tam;
                                    return (
                                        <button
                                            key={tam}
                                            onClick={() =>
                                                !selecionado && setTamanho(tam)
                                            }
                                            disabled={selecionado}
                                            className={selecionado ? "btn-opc ativo" : "btn-opc"}
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
                                            setQuantidade(quantidade - 1)
                                        }
                                    >
                                        −
                                    </button>

                                    <span className="qtd_valor">{quantidade}</span>

                                    <button
                                        className="qtd_btn"
                                        onClick={() =>
                                            setQuantidade(quantidade + 1)
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
                                                produto.variantes[0].preco,
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
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path d="M20.52 3.48A11.93 11.93 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.17 1.6 5.99L0 24l6.19-1.62A11.97 11.97 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.21-1.25-6.22-3.48-8.52zM12 22c-1.85 0-3.66-.5-5.23-1.43l-.37-.22-3.88 1.02 1.04-3.77-.24-.38A9.95 9.95 0 0 1 2 12C2 6.48 6.48 2 12 2c2.67 0 5.18 1.04 7.07 2.93A9.95 9.95 0 0 1 22 12c0 5.52-4.48 10-10 10zm5.49-7.47c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.68-1.64-.93-2.24-.24-.59-.49-.51-.68-.52-.18-.01-.37-.01-.57-.01-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.87 1.22 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35z" fill="#25D366"/>
                                </svg>
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
                                            <strong>{titulo}:</strong>{" "}
                                            {resto.join(":")}
                                        </p>
                                    );
                                }
                                return <p key={index}>{linha}</p>;
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

            {/* ─── Carrinho Flutuante ─── */}
            <CarrinhoFlutuante
                quantidade={qtdCarrinho}
                onClick={() => navigate("/carrinho")}
            />
        </div>
    );
}

export default Produtos;