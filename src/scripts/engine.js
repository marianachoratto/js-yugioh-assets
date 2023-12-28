const state = {
    score:{
        playerScore: 0,
        computerScore: 0, 
        scoreBox: document.getElementById('score_points'),
    },
    // imagem da carta
    cardSprites: {
       avatar: document.getElementById('card-image'), 
       name: document.getElementById('card-name'), 
       type: document.getElementById('card-type'), 
    },
    fieldCards:{
        player: document.getElementById('player-field-card'),
        computer: document.getElementById('computer-field-card'),
    }, 
    button: document.getElementById('next-duel'),
    audioBackground: document.getElementById('background-music'),
}

// Como pegar coisas com JS e deixar mais fácil a chamada
const playerSides = {
    player1: "player-cards",
    player1BOX:  document.querySelector('#player-cards'),
    computer: "computer-cards",
    computerBOX: document.querySelector('#computer-cards'),
}

// Cartas
const cardData = [
    {
        id:0, 
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: "./src/assets/icons/dragon.png",
        WinOf:[1],
        LoseOf: [2], 
    },
    {
        id:1, 
        name: "Dark Magician",
        type: "Rock",
        img: "./src/assets/icons/magician.png",
        WinOf:[2],
        LoseOf: [0], 
    },
    {
        id:2, 
        name: "Exodia",
        type: "Scisors",
        img: "./src/assets/icons/exodia.png",
        WinOf:[0],
        LoseOf: [1], 
    },
]

// Função de dar um ID aleatório 
async function getRandomCardId(){
    const randomIndex = Math.floor(Math.random() * cardData.length)
    return cardData[randomIndex].id
}

// Criando as cartas dinamicamente 
async function creatCardImage(IdCard, fieldSide){
    const cardImage = document.createElement('img');
    // criando tags HTML no JS
    cardImage.setAttribute('height', '100px');
    cardImage.setAttribute('src', './src/assets/icons/card-back.png');
    cardImage.setAttribute("data-id", IdCard);
    // Quando você cria a classe card, vc pode estilizar ela no CSS
    cardImage.classList.add('card');

    // quando o jogador clicar, colocar a carta no tabuleiro
    if( fieldSide === playerSides.player1){
        
        // quando passar o mouse, ver a carta no left_container
        cardImage.addEventListener('mouseover', ()=>{
            drawSelectedCard(IdCard);
        })
        
        cardImage.addEventListener('click', ()=>{
            setCardsField(cardImage.getAttribute('data-id'))
        })
    }

    return cardImage;
}

// Mostrar a carta no left container 
async function drawSelectedCard(index){
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = `Attribute: ${cardData[index].type}`;
}

// Colocar a minha carta e do meu oponente em campo 
async function setCardsField(cardId){
    // remove temporariamente todas as cartas do jogo quando o usuário coloca a carta na mesa
    await removeAllCardsImages();

    // Eu jogo uma carta 
    // fazer o computador jogar uma carta 
    let computerCardId = await getRandomCardId(); 

    // Limpar o left container depois que a carta sair
    await hiddenCardDetails(true);

    // bloquear as outras cartas
    // await showHiddenCardsInTheField(value);
    state.fieldCards.player.style.display = 'block';
    state.fieldCards.computer.style.display = 'block';
    
    // Colocar na mesa uma carta de id igual à minha ou do computador 
    await drawCardsInField(cardId, computerCardId);

    let duelResults = await checkDuelResults(cardId, computerCardId );

    await updateScore();
    await drawButton(duelResults);
}

// Colocar na mesa uma carta de id igual à minha ou do computador 
async function drawCardsInField(cardId, computerCardId ){
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;
}

// Limpar o left container depois que a carta sair
async function hiddenCardDetails(){
    state.cardSprites.name.innerText = ''
    state.cardSprites.type.innerText = ''
    state.cardSprites.avatar.src = ''
}

// Remove temporariamente todas cartas do tabuleiro 
async function removeAllCardsImages(){
    // Guardar todas as cartas na memória, para não perdê-las a cada rodada 
    let cards = playerSides.computerBOX
    // pegar todas as imagens que tem dentro das cartas 
    let imgElements = cards.querySelectorAll('img')
    imgElements.forEach((img)=> img.remove())

    // Fazer isso para as minhas cartas
    cards = playerSides.player1BOX 
    imgElements = cards.querySelectorAll('img')
    imgElements.forEach((img)=> img.remove())
}

// Checar quem venceu o duelo
async function checkDuelResults(playerCardId, computerCardId){
    // Padrão: empate
    let duelResults = 'draw'.toUpperCase();

    let playerCard = cardData[playerCardId];

    if(playerCard.WinOf.includes(computerCardId)){
        duelResults = 'win'.toUpperCase();
        state.score.playerScore++;
        await playAudio('win');
    } 
    
    if(playerCard.LoseOf.includes(computerCardId)){
        duelResults = 'lose'.toUpperCase();
        state.score.computerScore++;
        
    }
    await playAudio(duelResults);
    return duelResults;
}

// Depois que o duelo acaba, aparece o botão
async function drawButton(text){
    state.button.innerText = text;
    state.button.style.display = 'block';
} 

// Arrumando o placar 
async function updateScore(){
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`
}

//  1- Sorteando as cartas
async function drawCards(cardNumbers, fieldSide){
    for (let i = 0; i < cardNumbers; i++) {
        // para sortear uma carta aleatoriamente eu preciso do ID delas
        const randomIdCard = await getRandomCardId();
        // preciso criar a imagem 
        const cardImage = await creatCardImage(randomIdCard, fieldSide);
        //preciso colocar a carta no tabuleiro
        document.getElementById(fieldSide).appendChild(cardImage)
    }
}

// Reiniciando a partida
async function resetDuel(){
    // limpar carta do left container 
    state.cardSprites.avatar.src = '';
    // Esconder o botão
    state.button.style.display = 'none';
    // limpar as cartas da mesa 
    state.fieldCards.player.style.display = 'none';
    state.fieldCards.computer.style.display = 'none';
    // dar as cartas novamente
    init();
}

// Tocar áudio 
async function playAudio(status){
    const audio = new Audio(`./src/assets/audios/${status}.wav`)
    audio.play();
    // audio.volume = 0.45;
}


function init(){
    state.fieldCards.player.style.display = 'none'
    state.fieldCards.computer.style.display = 'none'

    drawCards(5, playerSides.player1);
    drawCards(5, playerSides.computer);

    state.audioBackground.play();
    state.audioBackground.volume = 0.15;
}

// Função que chama o estado inicial do jogo
init();