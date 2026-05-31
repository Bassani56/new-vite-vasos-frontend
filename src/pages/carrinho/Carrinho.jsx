import { useEffect, useState } from 'react'
import './carrinho.css'

function Carrinho(){

    const [produto, SetProduto] = useState([])

    useEffect(() => {

        try {
            const produtos = JSON.parse(
                localStorage.getItem("produto")
            ) || []

            SetProduto(produtos)

        } catch (error) {
            console.log('Carrinho vazio')
        }

        

    }, [])

    const total = produto.reduce((acumulador, item) => {

        // se estiver desmarcado, ignora
        if (item.selecionado === false){
            return acumulador
        }

        return acumulador + (
            Number(item.preco) * Number(item.quantidade)
        )

    }, 0)

    function removerProduto(index){
        let produtos = JSON.parse(
            localStorage.getItem("produto")
        ) || []
        console.log('remover index: ', index)
        produtos.splice(index, 1)

        localStorage.setItem(
            "produto",
            JSON.stringify(produtos)
        )

        console.log(produtos)
        SetProduto(produtos)
    }

    function alterarQuantidade(index, valor){
        if(produto[index].selecionado === false){
            return
        }


        const novosProdutos = [...produto]

        novosProdutos[index].quantidade += valor

        // evita quantidade menor que 1
        if (novosProdutos[index].quantidade < 1){
            novosProdutos[index].quantidade = 1
        }

        SetProduto(novosProdutos)

        localStorage.setItem(
            "produto",
            JSON.stringify(novosProdutos)
        )
    }

    const toggleSelecionado = (index_selecionado) => {

        const novosProdutos = [...produto]

        // se não existir, considera true
        if (novosProdutos[index_selecionado].selecionado === undefined){
            novosProdutos[index_selecionado].selecionado = false
        }

        else{
            novosProdutos[index_selecionado].selecionado =
                !novosProdutos[index_selecionado].selecionado
        }

        SetProduto(novosProdutos)

        localStorage.setItem(
            "produto",
            JSON.stringify(novosProdutos)
        )
    }

    const gerarSlug = (texto = "") =>
    texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const formatarPreco = (valor) =>
        (Number(valor) || 0).toFixed(2)

    const formatarDimensao = (valor) => {
        if (!valor) return null

        const texto = String(valor)

        return texto.toLowerCase().includes("cm") ? texto : `${texto}cm`
    }

    const formatarMedida = (item) => {
        const variante = item.variante

        if (variante?.tamanho) {
            return variante.tamanho
        }

        const altura = variante?.dimensoes?.altura
        const largura = variante?.dimensoes?.largura

        if (altura && largura) {
            return `${formatarDimensao(altura)} x ${formatarDimensao(largura)}`
        }

        return null
    }

    const gerarLinkProduto = (item) => {
        const slug = item.slug || `${gerarSlug(item.titulo)}-${item.id}`
        const dirParam = item.diretorio
            ? `?dir=${encodeURIComponent(item.diretorio)}`
            : ""

        return `https://casadooleiroo.com.br/produto/${slug}${dirParam}`
    }

    const gerarMensagemWhatsApp = () => {
        const selecionados = produto.filter((item) => item.selecionado !== false);
        if (selecionados.length === 0) return;

        let msg = "Ola! Tenho interesse nos seguintes produtos:\n\n";

        selecionados.forEach((item) => {
            const medida = formatarMedida(item);

            msg += `- ${item.titulo}\n`;

            if (medida) msg += `Medida: ${medida}\n`;
            if (item.opcao) msg += `Acabamento: ${item.opcao}\n`;

            msg += `Quantidade: ${item.quantidade}\n`;
            msg += `Preco un: R$ ${formatarPreco(item.preco)}\n`;
            msg += `Link: ${gerarLinkProduto(item)}\n\n`;
        });

        msg += `Total: R$ ${total.toFixed(2)}\n`;

        const url = `https://api.whatsapp.com/send/?phone=5541995264057&text=${encodeURIComponent(msg)}&type=phone_number&app_absent=0`;
        window.open(url, "_blank");
    };


    return(
        <div className='dashboard-carrinho'>
            <div className='container-center-carrinho'>
                
                <div className='container-carrinho-produtos'>
                    <div className='titulo-carrinho'>
                        <h1>Seu Carrinho</h1>
                    </div>

                    <div className='carrinho-produtos'>

                        {produto.length === 0 && (
                            <div className="carrinho_vazio">
                            <p>Seu carrinho esta vazio.</p>
                            <span>Adicione produtos para comecar!</span>
                            </div>
                        )}

                        {produto.map((produto, index) => (

                            <div className='item-carrinho' key={index}>

                                <div className='container-img-selecionada'>
                                    <input
                                        type="checkbox"
                                        checked={produto.selecionado !== false}
                                        onChange={() => toggleSelecionado(index)}
                                        className="item_checkbox"
                                    />
                                    {produto.diretorio && (
                                        <img src={produto.diretorio} alt={produto.titulo} />
                                    )}
                                </div>

                                <div className='info-item'>
                                    <h3>{produto.titulo}</h3>
                                    <p>R$ {formatarPreco(produto.preco)}</p>
                                    {formatarMedida(produto) && (
                                        <p>Medida: {formatarMedida(produto)}</p>
                                    )}
                                    {produto.opcao && (
                                        <p>Acabamento: {produto.opcao}</p>
                                    )}
                                </div>

                                <div className='quantidade'>
                                    <button onClick={() => alterarQuantidade(index, -1)}>-</button>

                                    <span>
                                        {produto.quantidade}
                                    </span>

                                    <button onClick={() => alterarQuantidade(index, 1)}>+</button>
                                </div>

                                <div onClick={()=> removerProduto(index)} className='remover'>
                                    ✕
                                </div>

                            </div>

                        ))}

                        
                    </div>
                </div>

                <div className='container-carrinho-info'>
                    <div className='carrinho-info'>
                        <h2>Resumo do Pedido</h2>

                        <div className='linha'>
                            <span>Produtos selecionados </span>
                            <span>
                                {
                                    produto.filter(item =>
                                        item.selecionado !== false
                                    ).length
                                }
                            </span>
                        </div>

                        <div className='linha total'>
                            <span>Total</span>
                            <span>R$ {total.toFixed(2)}</span>
                        </div>

                        <button  onClick={() => gerarMensagemWhatsApp()} className='btn-finalizar'>
                            Finalizar pelo WhatsApp
                        </button>
                    </div>

                   <div className="metodos_pagamento">
                        <h3>Meios de Pagamento</h3>

                        <div className="pagamento_destaque">
                            <img
                                loading="lazy"
                                src="https://http2.mlstatic.com/storage/logos-api-admin/f3e8e940-f549-11ef-bad6-e9962bcd76e5-m.svg"
                                alt="Mercado Pago"
                            />
                            <p>
                                Pague em ate <strong>6x sem juros!</strong>
                            </p>
                        </div>

                        <div className="pagamento_secao">
                            <h4>Cartoes de credito</h4>
                            <div className="bandeiras">
                                <img loading="lazy" src="https://http2.mlstatic.com/storage/logos-api-admin/a5f047d0-9be0-11ec-aad4-c3381f368aaf-m.svg" alt="Visa" />
                                <img
                                loading="lazy"
                                src="https://http2.mlstatic.com/storage/logos-api-admin/9cf818e0-723a-11f0-a459-cf21d0937aeb-m.svg"
                                alt="Mastercard"
                                />
                                <img loading="lazy" src="https://http2.mlstatic.com/storage/logos-api-admin/bb7c7bb0-adec-11f0-92e6-59fb0bcb38c2-m.svg" alt="Elo" />
                                <img loading="lazy" src="https://http2.mlstatic.com/storage/logos-api-admin/ddf23a60-f3bd-11eb-a186-1134488bf456-m.svg" alt="Hipercard" />
                                <img loading="lazy" src="https://http2.mlstatic.com/storage/logos-api-admin/b2c93a40-f3be-11eb-9984-b7076edb0bb7-m.svg" alt="Amex" />
                            </div>
                        </div>

                        <div className="pagamento_secao">
                            <h4>Pix</h4>
                            <img loading="lazy" className="img_pix" src="https://http2.mlstatic.com/storage/logos-api-admin/f99fcca0-f3bd-11eb-9984-b7076edb0bb7-m.svg" alt="Pix" />
                        </div>

                        <div className="pagamento_secao">
                            <h4>Boleto</h4>
                            <img loading="lazy" className="img_boleto" src="https://http2.mlstatic.com/storage/logos-api-admin/00174300-571e-11e8-8364-bff51f08d440-m.svg" alt="Boleto" />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Carrinho
