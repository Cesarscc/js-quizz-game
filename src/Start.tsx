import { Button } from "@mui/material"
import { useQuestionsStore } from "./store/questions"

const LIMIT_QUESTIONS = 10

export const Start = () => {

    const fetcQuestions = useQuestionsStore(state => state.fetchQuestion);

    const handleClick = () => {
        fetcQuestions(LIMIT_QUESTIONS);
    }

    return (
        <Button sx={{ marginTop: '25px' }} onClick={handleClick} variant="contained">¡Empezar!</Button>
    )

}