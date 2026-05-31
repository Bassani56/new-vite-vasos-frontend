import Icon from './icon/Icon'
import './footer.css'

function Footer(){
    return(
        <div className="container-footer" id="footer">
            <div className="center-container-footer">
                <div className="descricao-footer">
                    <h2>Casa do Oleiro</h2>
                    <p>
                        Produzimos vasos de ceramica artesanal, feitos a mao com cuidado em cada detalhe.
                    </p>

                    <p>
                        Nossos vasos decorativos em Curitiba e vasos para plantas sao resistentes e ideais 
                        para ambientes internos e externos.
                    </p>

                    <p>
                        Para mais informações, especificações ou orçamentos, entre em contato conosco.
                    </p>
                </div>
                <div className="links-rapidos">
                    <h2>Links Rapidos</h2>
                    <a href="">Início</a>
                    {/* <a href="">Informações</a> */}
                    {/* <a href="">Contato</a> */}
                    <a href="/carrinho">Carrinho</a>
                </div>

                <div className='contato-footer'>
                    <h2>Contatos</h2>
                    <a href="https://track.casadooleiroo.com.br/r/casadooleiroo14" className="contato-footer-item">
                        <Icon name="mail" />
                        <span>casadooleiro14@gmail.com</span>
                    </a>    
                    <a href="https://track.casadooleiroo.com.br/r/informacoes-whatsapp" className="contato-footer-item">
                        <Icon name="phone" />
                        <span>(41) 9526-4057</span>
                    </a> 

                    <a href="https://track.casadooleiroo.com.br/r/casadooleiroo14" className="contato-footer-item">
                        <Icon name="instagram" />
                        <span>Instagram</span>
                    </a> 

                </div>
            </div>
        </div>
    )
}

export default Footer