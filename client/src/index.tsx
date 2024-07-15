import ReactDOM from 'react-dom/client'
import './app/layouts/styles.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { RouterProvider } from 'react-router-dom';
import { routes } from './app/router/Routes.tsx';
import { Provider } from 'react-redux';
import { store } from './app/store/configureStore.ts';
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'


ReactDOM.createRoot(document.getElementById('root')!).render(
      <Provider store={store}>
        <RouterProvider router={routes}/>
      </Provider>
)
