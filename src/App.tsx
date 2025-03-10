import './App.css'
import { Container, Stack, Typography } from '@mui/material';
import { JavaScriptLogo } from './JavaScriptLogo';
import { Start } from './Start';
import { useQuestionsStore } from './store/questions';
import { Game } from './Game';

function App() {

  const questions = useQuestionsStore(state => state.questions);
  return (
    <main>
      <Container maxWidth='sm' sx={{ placeContent: 'center', minHeight: '100vh' }}>
        <Stack direction={'row'} gap={2} alignItems={'center'} justifyContent={'center'}>
          <JavaScriptLogo />
          <Typography variant='h4' component='h4'>
            Javascript Quizz
          </Typography>
        </Stack>

        {questions.length === 0 && <Start />}
        {questions.length > 0 && <Game />}
      </Container>
    </main>
  )
}

export default App
