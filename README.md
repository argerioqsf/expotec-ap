# Aplicativo expotec-ap

## Como subir e executar o ambiente de desenvolvimento
* Baixe o Node.js neste link [Download Node.js](https://nodejs.org/en/) e instale o seu gerenciador de pacotes npm, que por padrão já vem incluido com a instalação do Node.js.
* instale o CLI do Git neste link [Download Git](https://git-scm.com/downloads).
* instale o CLI do framework ionic com o comando abaixo.
* Crie uma conta no firebase neste link [Firebase](https://firebase.google.com/), que será utilizado como banco de dados para a aplicação, no final da sua aplicação anote suas credencias.(Se tiver duvida neste processo verifique o link "Como integrar um projeto Ionic 2 com o Firebase - Medium" no final deste documento).
#### 
    npm install -g ionic
* clone o repositório, abrindo a janela de comandos na pasta de sua escolha e digitando o código abaixo.
####  
    git clone https://github.com/argerioqsf/expotec-ap
* abra a janela de comandos dentro do diretório expotec-ap com o comando.
####
    cd expotec-ap
* e execute o comando para instalar todos os pacotes utilizados no projeto.
####
    npm install
* Crie o arquivo firebase-cred.js no diretorio src/app/, este será o arquivo de configuração do firebase, tera suas credenciais para acesar seu banco de dados no firebase.
* Adicione os seguintes codigos no arquivo firebase-cred.js, subistituindo os "XXXX" pelas suas credenciais do firebase.
####
    export const FIREBASE_CREDENTIALS = {
        apiKey: "XXXXXXXXXXXXXXXXXXXXXXXXXX",
        authDomain: "XXXXXXXXXXXXXXXXXXXXXXXXX",
        databaseURL: "XXXXXXXXXXXXXXXXXXXXXXX",
        projectId: "XXXXXXXXXXXXXXXXXX",
        storageBucket: "XXXXXXXXXXXXXXXXXXXXXXXX",
        messagingSenderId: "XXXXXXXXXXXX"
    }; 
## Após isso.
* Você poderá testar o projeto com o comando a baixo na janela de comando dentro do diretório do projeto "/expotec-ap".
####
    ionic serve
## Para mais informações consulte estes links.
* [Como integrar um projeto Ionic 2 com o Firebase - Medium](https://medium.com/@adsonrocha/como-integrar-um-projeto-ionic-2-com-o-firebase-ab228d84f445).
* [Ionic framework](https://ionicframework.com).
* [Documentação Firebase](https://firebase.google.com/docs/web/setup).
    
   