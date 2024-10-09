import './App.scss';
import Convert from '@sections/Convert/Convert.tsx';
import Price from '@sections/Price/Price.tsx';
import History from '@sections/History/History.tsx';
import { ConvertProvider } from './store/ConvertProvider/ConvertProvider.tsx';

function App() {
  return (
    <ConvertProvider>
      <section className={'app'}>
        <Convert className={'convert'} />
        <History className={'history'} />

        <Price className={'price'} />
      </section>
    </ConvertProvider>
  );
}

export default App;
