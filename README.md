# report-node-api

Projeto para uma API de relatorios de fluxos e usuarios.

# Tecnologias envolvidas
- MongoDB
- NodeJS
- Docker
- Docker-compose

# Docker
O projeto utiliza docker e docker-compose para sua execução.

Pré-requisitos instalados:
- Docker
- Docker-compose

# Instalação do docker e docker-compose

https://docs.docker.com/engine/installation/
https://docs.docker.com/compose/install/

# Comandos de controle

 - Inicializar serviço
  - ./commands start
 - Entrar no console do container NodeJs - Precisa estar com o serviço rodando
  - ./commands console app
 - Entrar no console do container MongoDB - Precisa estar com o serviço rodando
  - ./commands console mongo
 - Buildar ambiente - Por algum motivo que não descobri, não consigo dar build após estar com o banco de dados importado.
  - ./commands build
  
# Serviço

A API roda na porta 8080
Rotas para os relatorios, todos os endpoints respondem as queries string `page` e `size` para a navegação entre paginas e quantidade de dados por pagina variavel:
 - /user_history
 - /user_history/:user_id
 - /flow_statistics
 - /flow_statistics/:flow_id
 
 # Modelagem do banco de dados
 
 Foi elaborado duas collections para os relatorios, e quatro collections de relacionamento.
 
- Flow
- Step
- Activity
- User
- FlowStatistics - Dados otimizados para apresentar relatorio quantitativo de atividades relacionadas, organizado por flow.
- UserHistory - Dados otimizados para apresentar informações da trajetoria do user pelos fluxos e passos, organizado por user. 
 
