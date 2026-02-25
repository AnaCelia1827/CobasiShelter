<img src="../assets/logointeli.png">


# GDD - Game Design Document - Módulo 1 - Inteli

## Bordot Studios

Ana Célia Augusta Santos do Amaral  
Anita Fratelli Sonobe Silveira  
Davi Viana Tricarico  
Gustavo Luz Fantasia Barbosa  
Isaac Nicolas Alves Silva  
João Pedro Fuzzo Poveda  
Pedro Lemos Negri
Valter Lucas Garcia de Lima

## Sumário

[1. Introdução](#c1)

[2. Visão Geral do Jogo](#c2)

[3. Game Design](#c3)

[4. Desenvolvimento do jogo](#c4)

[5. Casos de Teste](#c5)

[6. Conclusões e trabalhos futuros](#c6)

[7. Referências](#c7)

[Anexos](#c8)

<br>


# <a name="c1"></a>1. Introdução (sprints 1 a 4)

## 1.1. Plano Estratégico do Projeto

### 1.1.1. Contexto da indústria (sprint 2)

*Posicione aqui o texto que explica o contexto da indústria/mercado do qual o parceiro de projeto faz parte. Contextualize o segmento de atuação do parceiro (pode ser indústria, comércio ou serviço). Caracterize as atividades executadas pelo negócio do parceiro e a abrangência de suas atividades (âmbito internacional, nacional ou regional).*

#### 1.1.1.1. Modelo de 5 Forças de Porter (sprint 2)

*Posicione aqui o modelo de 5 Forças de Porter para sustentar o contexto da indústria.*

### 1.1.2. Análise SWOT (sprint 2)

*Posicione aqui a análise SWOT relacionada ao parceiro de projeto. Utilize a análise SWOT para fazer uma análise ambiental do parceiro no âmbito estratégico. Leve em consideração o contexto da indústria, concorrência e as características do ambiente interno (forças e fraquezas) e externo (oportunidades e ameaças) do parceiro.*

### 1.1.3. Missão / Visão / Valores (sprint 2)

*Posicione aqui a Missão, Visão e Valores do seu projeto.*

### 1.1.4. Proposta de Valor (sprint 4)

*Posicione aqui o canvas de proposta de valor. Descreva os aspectos essenciais para a criação de valor da ideia do produto com o objetivo de ajudar a entender melhor a realidade do cliente e entregar uma solução que está alinhado com o que ele espera.*

### 1.1.5. Descrição da Solução Desenvolvida (sprint 4)

*Descreva brevemente a solução desenvolvida para o parceiro de negócios. Descreva os aspectos essenciais para a criação de valor da ideia do produto com o objetivo de ajudar a entender melhor a realidade do cliente e entregar uma solução que está alinhado com o que ele espera. Observe a seção 2 e verifique que ali é possível trazer mais detalhes, portanto seja objetivo aqui. Atualize esta descrição até a entrega final, conforme desenvolvimento.*

### 1.1.6. Matriz de Riscos (sprint 4)

*Registre na matriz os riscos identificados no projeto, visando avaliar situações que possam representar ameaças e oportunidades, bem como os impactos relevantes sobre o projeto. Apresente os riscos, ressaltando, para cada um, impactos e probabilidades com plano de ação e respostas.*

### 1.1.7. Objetivos, Metas e Indicadores (sprint 4)

*Definição de metas SMART (específicas, mensuráveis, alcançáveis, relevantes e temporais) para seu projeto, com indicadores claros para mensuração*

## 1.2. Requisitos do Projeto

Os requisitos do projeto foram definidos para estruturar a experiência do jogador a partir da mecânica central de cuidado com animais domésticos, garantindo alinhamento entre jogabilidade e propósito social. O jogo deverá possuir gatos e cães como espécies principais, delimitando o universo temático e aproximando a experiência da realidade dos animais mais adotados. Essa escolha fortalece a proposta de conscientização sobre responsabilidade no cuidado e na adoção.
\# | Requisitos
--- | --- 
1 | O jogo deve possuir gatos e cães como animais.
2 | A tela inicial do jogo irá possuír botões de "Jogar", "Tutorial", "Sair" e uma engrenagem para alterar configurações.
3 | O jogador deve tratar do animal (realizando suas necessidades como lavar, alimentar, medicar, brincar, etc.) a fim de progredir no jogo.
4 | O jogo terá como mecânica principal o cuidado com os animais. Ao começar uma fase, animais descuidados aparecerão para o jogador tratar. 
5 | Em certo momento do jogo, o jogador se depará com um animal totalmente limpo e não precisará tratar, esse animal conterá uma mensagem junto a ele conscientizando sobre a devolução de animais adotados.
6 | O Jogo terá cenários para cada tipo de tratamento (ex: área de alimentação).
7 | O jogo terá indicação visual no mouse para áreas interativas.
8 | O jogador ganhará moedas ao tratar animais as quais podem ser usadas para melhorias.
9 | O jogo deverá possuir uma Cena de Banho, onde o jogador poderá remover sujeira, lama e parasitas do animal através de interações como esfregar, enxaguar e aplicar shampoo.
10 | A Cena de Banho deverá conter feedback visual e sonoro (espuma, água escorrendo, animal reagindo positivamente ao ficar limpo).
11 | O sistema de limpeza deverá ser progressivo: a sujeira diminui conforme o jogador interage corretamente.
12 | Caso o jogador utilize as ferramentas erradas para a ação, haverá uma indicação visual para a ferramenta correta.
13 | Cada tipo de animal poderá apresentar variações de problemas (pulgas, carrapatos, feridas leves), exigindo abordagens específicas.

Os requisitos não operam de forma isolada, mas de maneira articulada. A definição das espécies estabelece o escopo temático; a mecânica de cuidado estrutura a jogabilidade; os cenários organizam as ações; o sistema de moedas promove progressão; a indicação visual aprimora a interação; e o momento de conscientização consolida o propósito social do projeto. O desenvolvimento será realizado de forma incremental nas sprints iniciais, priorizando a implementação da mecânica central e das interações básicas, e posteriormente incorporando o sistema de recompensas e o evento educativo, garantindo viabilidade técnica e coerência na evolução do jogo.

## 1.3. Público-alvo do Projeto

O Público alvo do nosso projeto é qualquer um que tenha interesse em aprender e dar uma qualidade de vida melhor ao seu Pet. Apesar de ser acessível para qualquer um, é previsto que a Geração Z tenha mais contato com o jogo pela seu apreço com jogos e pela crescente onda de pais de pets entre essa geração.
fonte: https://pet.istoe.com.br/pesquisa-global-aponta-vivemos-uma-nova-era-de-tutores-e-pets



# <a name="c2"></a>2. Visão Geral do Jogo

## 2.1. Objetivos do Jogo

O jogo tem como objetivo central promover o cuidado e o bem-estar dos animais, em especial dos cachorros, dentro do projeto Cobasi Cuida. A experiência é organizada em fases progressivas, cada uma apresentando novos desafios e diferentes perfis de cães, variando em raça, porte, idade e peso.
O jogador assume o papel de cuidador responsável e, para avançar no jogo, precisa realizar uma série de atividades interativas por meio de minigames. Esses minigames simulam tarefas de cuidado, como encher o pote de ração, oferecer brinquedos, dar banho ou proporcionar momentos de lazer. Cada ação realizada contribui para o aumento da barra de felicidade, indicador visual que demonstra o nível de satisfação e bem-estar do animal.

O progresso do jogador é medido pela sua capacidade de manter os cães felizes e saudáveis. A cada animal bem cuidado, o jogador recebe moedas virtuais como recompensa. Essas moedas desempenham um papel estratégico, pois permitem Comprar rações e equipamentos melhores, que facilitam os cuidados nas fases seguintes., Adquirir acessórios e itens de personalização, que tornam a experiência mais divertida e permitem enfeitar os animais, Desbloquear novos conteúdos e desafios, ampliando a diversidade de cães e atividades disponíveis.Assim, os objetivos do jogo se dividem em duas partes principais: o primeiro é garantir garantir o cuidado adequado dos animais, mantendo a barra de felicidade sempre elevado e o secundario é acumular moedas para investir em melhorias, acessórios e desbloqueios, tornando a jornada mais rica e recompensadora.


## 2.2. Características do Jogo 

### 2.2.1. Gênero do Jogo 

O gênero do jogo é simulação, pois o jogador assume o papel de um voluntário do projeto Cobasi Cuida, responsável por cuidar de diferentes cães em situações variadas. A proposta é reproduzir, de forma lúdica e interativa, a experiência de oferecer atenção, carinho e cuidados básicos aos animais, aproximando o jogador da realidade de quem atua em abrigos ou projetos de adoção.
Dentro do gênero de simulação, o jogo incorpora elementos de progressão e personalização, permitindo que o jogador evolua conforme realiza os cuidados e acumula moedas virtuais. Essa mecânica aproxima o jogo de características de RPG leve, já que há evolução de recursos, desbloqueio de fases e aquisição de itens que melhoram a experiência.
Além disso, o jogo pode ser classificado como casual, pois apresenta minigames acessíveis e intuitivos, voltados para públicos diversos, sem exigir domínio de controles complexos ou estratégias avançadas. O foco está na diversão, na sensação de responsabilidade e na recompensa emocional de ver os animais felizes.

### 2.2.2. Plataforma do Jogo 

O jogo será disponibilizado para desktop, com execução diretamente em navegadores web modernos, como Google Chrome, Microsoft Edge, Safari e Opera. Essa escolha de plataforma garante maior acessibilidade e praticidade, já que não será necessário instalar programas adicionais ou realizar downloads complexos.
A opção por navegadores permite que o jogo seja multiplataforma, funcionando em diferentes sistemas operacionais (Windows, macOS e Linux), desde que o usuário tenha acesso a um navegador compatível. Além disso, essa abordagem facilita a atualização contínua do jogo, pois qualquer melhoria ou correção pode ser aplicada diretamente no servidor, sem exigir que o jogador baixe novas versões.
Outro ponto importante é que a execução em navegadores torna o jogo mais inclusivo e acessível, permitindo que seja jogado em computadores com diferentes níveis de desempenho, sem exigir configurações avançadas de hardware.


### 2.2.3. Número de jogadores 
O jogo foi projetado para apenas um jogador, com o objetivo de fortalecer o vínculo individual entre o cuidador e os animais. Essa escolha garante maior senso de responsabilidade, já que cada decisão e ação realizada impacta diretamente no bem-estar dos cães.
A experiência single-player também permite que o jogador se envolva de forma mais imersiva e pessoal, sem distrações externas, reforçando a proposta central do projeto Cobasi Cuida: estimular a empatia, o cuidado e a dedicação aos animais.

### 2.2.4. Títulos semelhantes e inspirações

#### 2.2.4.1 Meu Talking Tom - Android ou IOS

É a principal inspiração para nosso protótipo. Jogo simples com o objetivo de cuidar do Tom.

Ideias de funcionalidades: 
- Toque interativo (tocar no pet e ele reagir).
- Pet ouvir sua fala e replicar com uma voz diferente (não seria original).
- Vestir o pet .
- Alimentar o pet (diferentes alimentos; não só ração ou sachês).
- Nível de pet (conforme atividades são realizadas o nível sobe) → possível integração com a ideia de fases.
- Troca de ambientação (sala, quarto, banheiro, quintal, parque, loja…).
- Estilo de interface (felicidade, fome, sede, sono, foguinho).

#### 2.2.4.2 Nintendogs - Nintendo DS/3DS:

- Referência em funcionalidades de cuidados com o Pet. 
- Pet reage às ações: seu visual muda conforme o cuidado (sujo/limpo/feliz/triste)
- Toque sensível na tela é usada para acariciar o Pet
- O jogo inclui diversas raças de diferentes de cães e gatos

#### 2.2.4.3 Animal Shelter Simulator - Google Play e IOS: 

A proposta é “rodar um abrigo” com tarefas operacionais e cuidado dos animais.

- Loop de tarefas (higiene, alimentação, rotina)
- Progressão (desbloqueios / expansão)



### 2.2.5 Tempo estimado de jogo (sprint 5)


# <a name="c3"></a>3. Game Design (sprints 2 e 3)

## 3.1. Enredo do Jogo (sprints 2 e 3)

*Descreva o enredo/história do jogo, criando contexto para os personagens (seção 3.2) e o mundo do jogo (seção 3.3). Uma boa história costuma ter um arco narrativo de contexto, conflito e resolução. Utilize etapas sequenciais para descrever esta história.* 

*Caso seu jogo não possua enredo/história (ex. jogo Tetris), mencione os motivos de não existir e como o jogador pode se contextualizar com o ambiente do jogo.*

## 3.2. Personagens (sprints 2 e 3)

### 3.2.1. Controláveis

*Descreva os personagens controláveis pelo jogador. Mencione nome, objetivos, características, habilidades, diferenciais etc. Utilize figuras (character art, sprite sheets etc.) para ilustrá-los. Caso utilize material de terceiros em licença Creative Commons, não deixe de citar os autores/fontes.* 

*Caso não existam personagens (ex. jogo Tetris), mencione os motivos de não existirem e como o jogador pode interpretar tal fato.*

### 3.2.2. Non-Playable Characters (NPC)

*\<opcional\> Se existirem coadjuvantes ou vilões, aqui é o local para descrevê-los e ilustrá-los. Utilize listas ou tabelas para organizar esta seção. Caso utilize material de terceiros em licença Creative Commons, não deixe de citar os autores/fontes. Caso não existam NPCs, remova esta seção.*

### 3.2.3. Diversidade e Representatividade dos Personagens

Considerando as personagens do game, analise se estas estão alinhadas ao público-alvo do jogo (seção 1.3), e compare-as dentro da realidade da sociedade brasileira. Por fim, discorra sobre qual é o impacto esperado da escolha dessas personagens.

## 3.3. Mundo do jogo (sprints 2 e 3)

### 3.3.1. Locações Principais e/ou Mapas (sprints 2 e 3)

*Descreva o ambiente do jogo, em que locais ele ocorre. Ilustre com imagens. Se houverem mapas, posicione-os aqui, descrevendo as áreas em acordo com o enredo. Se houverem fases, descreva-as também em acordo com o enredo (pode ser um jogo de uma fase só). Utilize listas ou tabelas para organizar esta seção. Caso utilize material de terceiros em licença Creative Commons, não deixe de citar os autores/fontes.*

### 3.3.2. Navegação pelo mundo (sprints 2 e 3)

*Descreva como os personagens se movem no mundo criado e as relações entre as locações – como as áreas/fases são acessadas ou desbloqueadas, o que é necessário para serem acessadas etc. Utilize listas ou tabelas para organizar esta seção.*

### 3.3.3. Condições climáticas e temporais (sprints 2 e 3)

*\<opcional\> Descreva diferentes condições de clima que podem afetar o mundo e as fases, se aplicável*

*Caso seja relevante, descreva como o tempo passa, se ele é um fator limitante ao jogo (ex. contagem de tempo para terminar uma fase)*

### 3.3.4. Concept Art (sprint 2)

*Inclua imagens de Concept Art do jogo que ainda não foram demonstradas em outras seções deste documento. Para cada imagem, coloque legendas, como no exemplo abaixo.*

<img src="../assets/concept1.jpg">

Figura 1: detalhe da cena da partida do herói para a missão, usando sua nave

### 3.3.5. Trilha sonora (sprint 4)

*Descreva a trilha sonora do jogo, indicando quais músicas serão utilizadas no mundo e nas fases. Utilize listas ou tabelas para organizar esta seção. Caso utilize material de terceiros em licença Creative Commons, não deixe de citar os autores/fontes.*

*Exemplo de tabela*
\# | titulo | ocorrência | autoria
--- | --- | --- | ---
1 | tema de abertura | tela de início | própria
2 | tema de combate | cena de combate com inimigos comuns | Hans Zimmer
3 | ... 

## 3.4. Inventário e Bestiário (sprint 3)

### 3.4.1. Inventário

*\<opcional\> Caso seu jogo utilize itens ou poderes para os personagens obterem, descreva-os aqui, indicando títulos, imagens, meios de obtenção e funções no jogo. Utilize listas ou tabelas para organizar esta seção. Caso utilize material de terceiros em licença Creative Commons, não deixe de citar os autores/fontes.* 

*Exemplo de tabela*
\# | item |  | como obter | função | efeito sonoro
--- | --- | --- | --- | --- | ---
1 | moeda | <img src="../assets/coin.png"> | há muitas espalhadas em todas as fases | acumula dinheiro para comprar outros itens | som de moeda
2 | madeira | <img src="../assets/wood.png"> | há muitas espalhadas em todas as fases | acumula madeira para construir casas | som de madeiras
3 | ... 

### 3.4.2. Bestiário

*\<opcional\> Caso seu jogo tenha inimigos, descreva-os aqui, indicando nomes, imagens, momentos de aparição, funções e impactos no jogo. Utilize listas ou tabelas para organizar esta seção. Caso utilize material de terceiros em licença Creative Commons, não deixe de citar os autores/fontes.* 

*Exemplo de tabela*
\# | inimigo |  | ocorrências | função | impacto | efeito sonoro
--- | --- | --- | --- | --- | --- | ---
1 | robô terrestre | <img src="../assets/inimigo2.PNG"> |  a partir da fase 1 | ataca o personagem vindo pelo chão em sua direção, com velocidade constante, atirando parafusos | se encostar no inimigo ou no parafuso arremessado, o personagem perde 1 ponto de vida | sons de tiros e engrenagens girando
2 | robô voador | <img src="../assets/inimigo1.PNG"> | a partir da fase 2 | ataca o personagem vindo pelo ar, fazendo movimento em 'V' quando se aproxima | se encostar, o personagem perde 3 pontos de vida | som de hélice
3 | ... 

## 3.5. Gameflow (Diagrama de cenas) (sprint 2)

*Posicione aqui seu "storyboard de programação" - o diagrama de cenas do jogo. Indique, por exemplo, como o jogo começa, quais opções o jogador tem, como ele avança nas fases, quais as condições de 'game over', como o jogo reinicia. Seu diagrama deve representar as classes, atributos e métodos usados no jogo.*

## 3.6. Regras do jogo (sprint 3)

*Descreva aqui as regras do seu jogo: objetivos/desafios, meios para se conseguir alcançar*

*Ex. O jogador deve pilotar o carro e conseguir terminar a corrida dentro de um minuto sem bater em nenhum obstáculo.*

*Ex. O jogador deve concluir a fase dentro do tempo, para obter uma estrela. Se além disso ele coletar todas as moedas, ganha mais uma estrela. E se além disso ele coletar os três medalhões espalhados, ganha mais uma estrela, totalizando três. Ao final do jogo, obtendo três estrelas em todas as fases, desbloqueia o mundo secreto.*  

## 3.7. Mecânicas do jogo (sprint 3)

*Descreva aqui as formas de controle e interação que o jogador tem sobre o jogo: quais os comandos disponíveis, quais combinações de comandos, e quais as ações consequentes desses comandos. Utilize listas ou tabelas para organizar esta seção.*

*Ex. Em um jogo de plataforma 2D para desktop, o jogador pode usar as teclas WASD para mecânicas de andar, mirar para cima, agachar, e as teclas JKL para atacar, correr, arremesar etc.*

*Ex. Em um jogo de puzzle para celular, o jogador pode tocar e arrastar sobre uma peça para movê-la sobre o tabuleiro, ou fazer um toque simples para rotacioná-la*

## 3.8. Implementação Matemática de Animação/Movimento (sprint 4)

*Descreva aqui a função que implementa a movimentação/animação de personagens ou elementos gráficos no seu jogo. Sua função deve se basear em alguma formulação matemática (e.g. fórmula de aceleração). A explicação do funcionamento desta função deve conter notação matemática formal de fórmulas/equações. Se necessário, crie subseções para sua descrição.*

# <a name="c4"></a>4. Desenvolvimento do Jogo

## 4.1. Desenvolvimento preliminar do jogo 
 

 *Durante a primeira fase de desenvolvimento, foram estabelecidas as prioridades do projeto, com foco na definição dos requisitos iniciais e na estruturação da narrativa principal. A equipe realizou sessões de brainstorming com o objetivo de consolidar a ideia central do jogo, definir suas mecânicas e organizar o escopo do sistema. A partir dessas definições, foi feita a organização inicial do software, com a implementação das primeiras funcionalidades e a distribuição de funções entre os membros da equipe, estabelecendo uma estrutura promissora para as próximas sprints.*

*No desenvolvimento da narrativa, optou-se por um personagem principal que representa uma pessoa comum, aproximando o jogador da realidade proposta pelo jogo. As mecânicas centrais envolvem o resgate de animais e os cuidados prestados a eles, com o objetivo de sensibilizar o público quanto à importância da adoção responsável e de ensinar, de maneira lúdica e educativa, os cuidados necessários com os animais. Essa definição foi essencial para alinhar os elementos narrativos às funcionalidades técnicas implementadas.*

*Em seguida, foi desenvolvida a estrutura técnica inicial do projeto, que incluiu a criação do cenário em pixel art e a implementação da tela inicial do jogo, com seus respectivos elementos visuais e interativos. Nesta primeira versão, foi entregue uma tela inicial funcional contendo os botões “Jogar”, "Sair",“Opções” e “Tutorial”, além de um sistema de navegação entre telas. Os botões possuem um feedback para o usuário saber que são clicáveis. Nessa primeira etapa focamos apenas em deixar o botão de configurações utilizável (símbolo de engrenagem), que ao ser selecionado abre uma tela para alterar diversas opções que serão implementadas em breve.*

![Tela Inicial](assets/telaInicial.png)

_Autoria própria (2025)_


*Durante essa primeira sprint, foram enfrentadas algumas dificuldades, principalmente no desenvolvimento das artes em pixel art, na utilização do GitLab para controle de versões, na organização das tarefas em grupo e na adaptação da equipe ao fluxo da metodologia Scrum. Apesar dos desafios, a equipe conseguiu entregar uma versão inicial funcional, que serviu como base estruturada para a continuidade do desenvolvimento do projeto.*


## 4.2. Desenvolvimento básico do jogo (sprint 2)

*Descreva e ilustre aqui o desenvolvimento da versão básica do jogo, explicando brevemente o que foi entregue em termos de código e jogo. Utilize prints de tela para ilustrar. Indique as eventuais dificuldades e próximos passos.*

<div align = "center">
    <p>Figura x - título</p>
    <img src = "">
    <p>Fonte: material produzido pelos autores (2026).</p>
</div>

## 4.3. Desenvolvimento intermediário do jogo (sprint 3)

*Descreva e ilustre aqui o desenvolvimento da versão intermediária do jogo, explicando brevemente o que foi entregue em termos de código e jogo. Utilize prints de tela para ilustrar. Indique as eventuais dificuldades e próximos passos.*

## 4.4. Desenvolvimento final do MVP (sprint 4)

*Descreva e ilustre aqui o desenvolvimento da versão final do jogo, explicando brevemente o que foi entregue em termos de MVP. Utilize prints de tela para ilustrar. Indique as eventuais dificuldades e planos futuros.*

## 4.5. Revisão do MVP (sprint 5)

*Descreva e ilustre aqui o desenvolvimento dos refinamentos e revisões da versão final do jogo, explicando brevemente o que foi entregue em termos de MVP. Utilize prints de tela para ilustrar.*

# <a name="c5"></a>5. Testes

## 5.1. Casos de Teste (sprints 2 a 4)

*Descreva nesta seção os casos de teste comuns que podem ser executados a qualquer momento para testar o funcionamento e integração das partes do jogo. Utilize tabelas para facilitar a organização.*

*Exemplo de tabela*
\# | pré-condição | descrição do teste | pós-condição 
--- | --- | --- | --- 
1 | posicionar o jogo na tela de abertura | iniciar o jogo desde seu início | o jogo deve iniciar da fase 1
2 | posicionar o personagem em local seguro de inimigos | aguardar o tempo passar até o final da contagem | o personagem deve perder uma vida e reiniciar a fase
3 | ...

## 5.2. Testes de jogabilidade (playtests) (sprint 5)

### 5.2.1 Registros de testes

*Descreva nesta seção as sessões de teste/entrevista com diferentes jogadores. Registre cada teste conforme o template a seguir.*

Nome | João Jonas (use nomes fictícios)
--- | ---
Já possuía experiência prévia com games? | sim, é um jogador casual
Conseguiu iniciar o jogo? | sim
Entendeu as regras e mecânicas do jogo? | entendeu as regras, mas sobre as mecânicas, apenas as essenciais, não explorou os comandos complexos
Conseguiu progredir no jogo? | sim, sem dificuldades  
Apresentou dificuldades? | Não, conseguiu jogar com facilidade e afirmou ser fácil
Que nota deu ao jogo? | 9.0
O que gostou no jogo? | Gostou  de como o jogo vai ficando mais difícil ao longo do tempo sem deixar de ser divertido
O que poderia melhorar no jogo? | A responsividade do personagem aos controles, disse que havia um pouco de atraso desde o momento do comando até a resposta do personagem

### 5.2.2 Melhorias

*Descreva nesta seção um plano de melhorias sobre o jogo, com base nos resultados dos testes de jogabilidade*

# <a name="c6"></a>6. Conclusões e trabalhos futuros (sprint 5)

*Escreva de que formas a solução do jogo atingiu os objetivos descritos na seção 1 deste documento. Indique pontos fortes e pontos a melhorar de maneira geral.*

*Relacione os pontos de melhorias evidenciados nos testes com plano de ações para serem implementadas no jogo. O grupo não precisa implementá-las, pode deixar registrado aqui o plano para futuros desenvolvimentos.*

*Relacione também quaisquer ideias que o grupo tenha para melhorias futuras*

# <a name="c7"></a>7. Referências (sprint 5)

_Incluir as principais referências de seu projeto, para que seu parceiro possa consultar caso ele se interessar em aprofundar. Um exemplo de referência de livro e de site:_<br>

LUCK, Heloisa. Liderança em gestão escolar. 4. ed. Petrópolis: Vozes, 2010. <br>
SOBRENOME, Nome. Título do livro: subtítulo do livro. Edição. Cidade de publicação: Nome da editora, Ano de publicação. <br>

INTELI. Adalove. Disponível em: https://adalove.inteli.edu.br/feed. Acesso em: 1 out. 2023 <br>
SOBRENOME, Nome. Título do site. Disponível em: link do site. Acesso em: Dia Mês Ano

# <a name="c8"></a>Anexos

*Inclua aqui quaisquer complementos para seu projeto, como diagramas, imagens, tabelas etc. Organize em sub-tópicos utilizando headings menores (use ## ou ### para isso)*
