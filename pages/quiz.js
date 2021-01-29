/* eslint-disable react/prop-types */
import React from 'react';
import db from '../db.json';
import Widget from '../src/components/Widget';
import QuizLogo from '../src/components/QuizLogo';
import QuizBackground from '../src/components/QuizBackground';
import QuizContainer from '../src/components/QuizContainer';
import AlternativeForm from '../src/components/AlternativeForm';
import Button from '../src/components/Button';
import styled from 'styled-components'
import {useRouter} from 'next/router'


function ResultWidget({ results }) {
    const router = useRouter()
    const name = router.query.name
    return (
        <Widget>
            <Widget.Header>
                Resultado
        </Widget.Header>

            <Widget.Content>
                <p>Você Acertou {results.reduce((somatorioAtual, resultAtual) => {

                    const isCorrect = resultAtual === true

                    if (isCorrect) {
                        return somatorioAtual + 1
                    }

                    return somatorioAtual


                }, 0)} {name}</p>
                <ul>


                    {results.map((result, index) => (

                        <li key={`result__${index}`}>#0{index + 1} Resultado: {result === true ? 'Acertou' : 'Errou'}</li>






                    ))}






                </ul>


            </Widget.Content>
        </Widget>
    );
}

const Loading = styled.div`
  animation: is-rotating 1s infinite;
  border: 6px solid #e5e5e5;
  border-radius: 50%;
  border-top-color: #51d4db;
  height: 50px;
  width: 50px;
  @keyframes is-rotating {
  to {
    transform: rotate(1turn);
  }
}
`;

const LoadingContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;

`;


function LoadingWidget() {
    return (
        <Widget>
            <Widget.Header>
                
            </Widget.Header>

            <Widget.Content>
                <LoadingContainer>
                    <Loading />
                </LoadingContainer>
                
            </Widget.Content>
        </Widget >
    );
}

function QuestionWidget({
    question,
    questionIndex,
    totalQuestions,
    onSubmit,
    addResult
}) {
    const questionId = `question__${questionIndex}`;
    const [selectedAlternative, setSelectedAlternative] = React.useState(undefined)
    const isCorrect = selectedAlternative === question.answer
    const [isQuestSubmited, setIsQuestSubmited] = React.useState(false)
    const hasAlternativeSelected = selectedAlternative !== undefined


    return (
        <Widget>
            <Widget.Header>
                {/* <BackLinkArrow href="/" /> */}
                <h3>
                    {`Pergunta ${questionIndex + 1} de ${totalQuestions}`}
                </h3>
            </Widget.Header>

            <img
                alt="Descrição"
                style={{
                    width: '100%',
                    height: '150px',
                    objectFit: 'cover',
                }}
                src={question.image}
            />
            <Widget.Content>
                <h2>
                    {question.title}
                </h2>
                <p>
                    {question.description}
                </p>

                <AlternativeForm
                    onSubmit={(infosDoEvento) => {
                        infosDoEvento.preventDefault();
                        setIsQuestSubmited(true);

                        setTimeout(() => {
                            addResult(isCorrect)
                            onSubmit();
                            setIsQuestSubmited(false)
                            setSelectedAlternative(undefined)

                        }, 1000)

                    }}
                >
                    {question.alternatives.map((alternative, alternativeIndex) => {
                        const alternativeId = `alternative__${alternativeIndex}`;
                        const alternativeStatus = isCorrect ? "SUCCESS" : "ERROR"
                        const isSelected = selectedAlternative === alternativeIndex

                        return (
                            <Widget.Topic
                                as="label"
                                htmlFor={alternativeId}
                                data-selected={isSelected}
                                data-status={isQuestSubmited && alternativeStatus}
                            >
                                <input
                                    style={{ display: 'none' }}
                                    id={alternativeId}
                                    name={questionId}
                                    type="radio"
                                    onChange={() => { setSelectedAlternative(alternativeIndex) }}
                                />
                                {alternative}
                            </Widget.Topic>
                        );
                    })}

                    {/* <pre>
            {JSON.stringify(question, null, 4)}
          </pre> */}
                    <Button type="submit" disabled={!hasAlternativeSelected}>
                        Confirmar
          </Button>


                    {isQuestSubmited && isCorrect && <p>Você acertou</p>}
                    {isQuestSubmited && !isCorrect && <p>Você errou</p>}


                </AlternativeForm>
            </Widget.Content>
        </Widget>
    );
}

const screenStates = {
    QUIZ: 'QUIZ',
    LOADING: 'LOADING',
    RESULT: 'RESULT',
};



export default function QuizPage() {
    const [screenState, setScreenState] = React.useState(screenStates.LOADING);
    const totalQuestions = db.questions.length;
    const [currentQuestion, setCurrentQuestion] = React.useState(0);
    const questionIndex = currentQuestion;
    const question = db.questions[questionIndex];
    const [result, setResult] = React.useState([])



    function addResult(resultNew) {
        setResult([...result, resultNew])


    }

    // [React chama de: Efeitos || Effects]
    // React.useEffect
    // atualizado === willUpdate
    // morre === willUnmount
    React.useEffect(() => {
        // fetch() ...
        setTimeout(() => {
            setScreenState(screenStates.QUIZ);
        }, 1 * 1000);
        // nasce === didMount
    }, []);

    function handleSubmitQuiz() {
        const nextQuestion = questionIndex + 1;
        if (nextQuestion < totalQuestions) {
            setCurrentQuestion(nextQuestion);
        } else {
            setScreenState(screenStates.RESULT);
        }
    }

    return (
        <QuizBackground backgroundImage={db.bg}>
            <QuizContainer>
                <QuizLogo />
                {screenState === screenStates.QUIZ && (
                    <QuestionWidget
                        question={question}
                        questionIndex={questionIndex}
                        totalQuestions={totalQuestions}
                        onSubmit={handleSubmitQuiz}
                        addResult={addResult}
                    />
                )}

                {screenState === screenStates.LOADING && <LoadingWidget />}

                {screenState === screenStates.RESULT && <ResultWidget results={result} />}
            </QuizContainer>
        </QuizBackground>
    );
}
