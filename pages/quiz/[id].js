import QuizScreen from '../../src/screens/Quiz'

import { ThemeProvider } from 'styled-components';

export default function otherQuizes({ dbExterno }) {

    return (
        <div>
            <ThemeProvider theme={dbExterno.theme}>
                <QuizScreen
                    externalQuestions={dbExterno.questions}
                    externalBg={dbExterno.bg}
                />
            </ThemeProvider>
        </div>

    



  

    )

}



export async function getServerSideProps(context) {
    const [projectName, githubUser] = context.query.id.split('___');

    try {
        const dbExterno = await fetch(`https://${projectName}.${githubUser}.vercel.app/api/db`)
            .then((respostaDoServer) => {

                if (respostaDoServer.ok) {
                    return respostaDoServer.json();
                }
                throw new Error('Falha em pegar os dados');
            })
            .then((respostaConvertidaEmObjeto) => respostaConvertidaEmObjeto)
        // .catch((err) => {
        //   // console.error(err);
        // });

        console.log('dbExterno', dbExterno);
        // console.log('Infos que o Next da para nós', context.query.id);
        return {
            props: {
                dbExterno,
            },
        };
    } catch (err) {
        throw new Error(err);
    }
}